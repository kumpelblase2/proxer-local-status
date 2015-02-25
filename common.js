var DETAILS_REGEX = /info\/(\d+)(\/details)?(#top)?$/;
var WINDOW_REGEX = /ucp\?s=(anime|manga)$/;
var UCP_REGEX = /ucp((#top)?|(\?s=.+))$/;
var ENTRY_REGEX = /entry\d+$/;
var ID_REGEX = /Cover:(\d+)$/;

var MAIN_CONTENT_ID = 'main';
var TABLES_ID = 'box-table-a';
var LAST_ACTION_ID = 'newComment';
var CONTENT_CLASS = 'hreview-aggregate';
var CONTENT_TAG = 'SPAN';
var BUTTON_ID = 'buttonLocal';
var STATUS_CLASS = 'localStatus';
var LINK_CLASS = 'localLink';


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

function insertAfter(inNewElement, inToAppend)
{
    inToAppend.parentNode.insertBefore(inNewElement, inToAppend.nextSibling);
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
