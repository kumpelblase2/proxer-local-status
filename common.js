var DETAILS_REGEX = /info\/(\d+)(\/details)?(#top)?$/;
var WINDOW_REGEX = /ucp\?s=anime$/;
var UCP_REGEX = /ucp((#top)?|(\?s=.+))$/;
var ENTRY_REGEX = /entry\d+$/;
var ID_REGEX = /Cover:(\d+)$/;

var MAIN_CONTENT_ID = 'main';
var TABLES_ID = 'box-table-a';
var LAST_ACTION_ID = 'newComment';
var CONTENT_CLASS = 'hreview-aggregate';
var CONTENT_TAG = 'SPAN';
var BUTTON_ID = 'toggleLocal';
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
