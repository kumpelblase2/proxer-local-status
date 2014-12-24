var WINDOW_REGEX = /ucp\?s=anime$/;
var UCP_REGEX = /ucp((#top)?|(\?s=.+))$/;
var ENTRY_REGEX = /entry\d+$/;
var ID_REGEX = /Cover:(\d+)$/;

var STATUS_CLASS = 'localStatus';
var LINK_CLASS = 'localLink';

var MAIN_CONTENT_ID = 'main';
var TABLES_ID = 'box-table-a';

function createStorageEntry(inId)
{
    var obj = {};
    obj[inId] = false;
    chrome.storage.sync.set(obj, function() {
        if(chrome.runtime.lastError) {
            alert('There was an error saving to storage: ' + runtime.lastError);
        }
    });
}

function createMarker(inOnDisk)
{
    var onDiskMarker = document.createElement('td');
    onDiskMarker.innerHTML = (inOnDisk ? 'X' : '-');
    onDiskMarker.className += STATUS_CLASS;
    return onDiskMarker;
}

function createLink(inText)
{
    var removeFromDiskLink = document.createElement('a');
    removeFromDiskLink.innerHTML = inText;
    removeFromDiskLink.href = 'javascript:void(0);';
    removeFromDiskLink.text = inText;
    removeFromDiskLink.className += LINK_CLASS;
    return removeFromDiskLink;
}

function clearElem(inTable, inCells, inRow)
{
    var marker = inCells[0];
    if(marker.classList.contains(STATUS_CLASS))
        marker.parentNode.removeChild(marker);

    var links = inCells[inCells.length - 1];
    var localLink = links.children[links.children.length - 1];
    if(localLink.classList.contains(LINK_CLASS))
        localLink.parentNode.removeChild(localLink);
}

function markOnDisc(inId, inTable, inCells, inRow)
{
    clearElem(inTable, inCells, inRow);

    var removeFromDiskLink = createLink(' [ ' + chrome.i18n.getMessage('actionRemoveLocal') + ' ] ');
    removeFromDiskLink.onclick = function() {
        var val = {};
        val[inId] = false;
        markNotOnDisc(inId, inTable, inCells, inRow);
        chrome.storage.sync.set(val, function() {
            if(chrome.runtime.lastError) {
                alert('There was an error saving to storage: ' + runtime.lastError);
            }
        });
    };
    inCells[inCells.length - 1].appendChild(removeFromDiskLink);

    var onDiskMarker = createMarker(true);
    inRow.insertBefore(onDiskMarker, inRow.firstChild);
}

function markNotOnDisc(inId, inTable, inCells, inRow)
{
    clearElem(inTable, inCells, inRow);

    var addToDiskLink = createLink(' [ ' + chrome.i18n.getMessage('actionSetLocal') + ' ] ');
    addToDiskLink.onclick = function() {
        var val = {};
        val[inId] = true;
        markOnDisc(inId, inTable, inCells, inRow);
        chrome.storage.sync.set(val, function() {
            if(chrome.runtime.lastError) {
                alert('There was an error saving to storage: ' + runtime.lastError);
            }
        });
    };
    inCells[inCells.length - 1].appendChild(addToDiskLink);

    var notOnDiskMarker = createMarker(false);
    inRow.insertBefore(notOnDiskMarker, inRow.firstChild);
}

function addColumnToTable(inHeadRow, inHeaderRow)
{
    var local = document.createElement('th');
    local.width = '5';
    local.innerHTML = 'L';
    inHeaderRow.insertBefore(local, inHeaderRow.firstChild);
    inHeadRow.children[0].setAttribute('colspan', '7');
}

function applyToTable(inTable)
{
    var rows = inTable.children[0].children;
    addColumnToTable(rows[0], rows[1]);

    for(var i = 0; i < rows.length; i++)
    {
        var row = rows[i];
        if(ENTRY_REGEX.test(row.id)) {
            var cells = row.children;
            var id = ID_REGEX.exec(cells[1].children[0].title)[1];
            (function(inId, inTable, inCells, inRow) {
                chrome.storage.sync.get(id, function(value) {
                    if(chrome.runtime.lastError) {
                        createStorageEntry(inId);
                    }

                    if(inId in value && value[inId]) {
                        markOnDisc(inId, inTable, inCells, inRow);
                    } else {
                        markNotOnDisc(inId, inTable, inCells, inRow);
                    }
                });
            })(id, inTable, cells, row);
        }
    }
}

function addObserver()
{
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.type === "childList")
            {
                if(mutation.addedNodes.length >= 1)
                {
                    var newNodes = mutation.addedNodes;
                    for(var i = 0; i < newNodes.length; i++)
                    {
                        var node = newNodes[i];
                        if(node.id === TABLES_ID)
                            applyToTable(node);
                    }
                }
            }
        });
    });
    observer.observe(document.getElementById(MAIN_CONTENT_ID), { childList: true });
}

function apply()
{
    if(!document.getElementById(TABLES_ID))
    {
        setTimeout(function() { apply(); }, 1000);
        return;
    }

    var mainContent = document.getElementById(MAIN_CONTENT_ID).children;
    for(var i = 0; i < mainContent.length; i++)
    {
        var table = mainContent[i];
        if(table.nodeName !== 'TABLE' || table.id !== TABLES_ID)
            continue;

        applyToTable(table);
    }
}

if(WINDOW_REGEX.test(window.location)){
    apply();
}

if(UCP_REGEX.test(window.location)) {
    addObserver();
}
