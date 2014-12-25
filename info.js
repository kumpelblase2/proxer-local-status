var DETAILS_REGEX = /info\/(\d+)(\/details)?(#top)?$/;

var LAST_ACTION_ID = 'newComment';
var MAIN_CONTENT_ID = 'main';
var CONTENT_CLASS = 'hreview-aggregate';
var CONTENT_TAG = 'SPAN';
var BUTTON_ID = 'toggleLocal';

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

function createButton(inLocal)
{
    var button = document.createElement('a');
    button.className = 'menu ajaxLink';
    button.style.display = 'block';
    button.href = 'javascript:void(0);';
    button.id = BUTTON_ID;
    button.innerHTML = chrome.i18n.getMessage((inLocal ? 'actionRemoveLocal' : 'actionSetLocal'));
    return button;
}

function insertAfter(inNewElement, inToAppend)
{
    inToAppend.parentNode.insertBefore(inNewElement, inToAppend.nextSibling);
}

function clearTable(inTable)
{
    var action = document.getElementById(BUTTON_ID);
    if(action)
    {
        action.parentNode.removeChild(action.previousSibling);
        action.parentNode.removeChild(action);
    }
}

function applyToTable(inInfoTable)
{
    clearTable(inInfoTable);

    var id = DETAILS_REGEX.exec(window.location)[1];
    var leftColumn = inInfoTable.rows[0].cells[0];
    var actionTable = leftColumn.children[0];
    var actions = actionTable.rows[2].cells[0];
    var blankLine = document.createElement('br');
    var lastAction = document.getElementById(LAST_ACTION_ID);
    insertAfter(blankLine, lastAction);
    chrome.storage.sync.get(id, function(value) {
        if(chrome.runtime.lastError){
            createStorageEntry(id);
        }

        var local = (value && id in value && value[id])
        var button = createButton(local);
        button.onclick = function() {
            value = value || {};
            value[id] = !local;
            chrome.storage.sync.set(value, function() {
                if(chrome.runtime.lastError) {
                    alert('There was an error saving to storage: ' + runtime.lastError);
                } else {
                    applyToTable(inInfoTable);
                }
            });
        };

        insertAfter(button, blankLine);
    });
}

function applyInfo()
{
    var classElements = document.getElementsByClassName(CONTENT_CLASS);
    for(var i = 0; i < classElements.length; i++)
    {
        var element = classElements[i];
        if(element.parentNode.id === MAIN_CONTENT_ID && element.nodeName === CONTENT_TAG)
        {
            applyToTable(element.children[1]);
        }
    }
}

function addObserver()
{
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(DETAILS_REGEX.test(window.location))
            {
                if(mutation.addedNodes.length >= 1)
                {
                    var newNodes = mutation.addedNodes;
                    for(var i = 0; i < newNodes.length; i++)
                    {
                        var node = newNodes[i];
                        if(node.className === CONTENT_CLASS && node.nodeName === CONTENT_TAG)
                            applyToTable(node.children[1]);
                        }
                    }
                }
            });
        });
        observer.observe(document.getElementById(MAIN_CONTENT_ID), { childList: true });
    }



if(DETAILS_REGEX.test(window.location)){
    applyInfo();
}

addObserver();
