chrome.browserAction.onClicked.addListener(function(tab){
    var img1=chrome.extension.getURL('img1.png');
    var img2=chrome.extension.getURL('img2.png');
    var img3=chrome.extension.getURL('img3.png');
    var img4=chrome.extension.getURL('img4.png');
    chrome.tabs.create({'url': chrome.extension.getURL('help.html')}, function (tab) {
        chrome.tabs.sendMessage(tab.id, {img1_url:img1, img2_url:img2, img3_url:img3, img4_url:img4});
    });
});

//subscribe on request from content.js:
chrome.runtime.onMessage.addListener(function(request,sender,callback){
    if(request.action==='createContextMenuItem'){
        chrome.contextMenus.create({"id":'Open', "title": 'Open', "contexts":['link'],
                                    "documentUrlPatterns":['http://ukrav/results/tables*', 'http://ukrav/results/compare*', 'http://ukrav/results/full_test_history*', 'http://ukrav/results/get_result_rav*']});
        chrome.contextMenus.create({"id":'History', "title": 'History', "contexts":['link'],
                                    "documentUrlPatterns":['http://ukrav/results/tables*', 'http://ukrav/results/compare*']});
        chrome.contextMenus.create({"id":'Result', "title": 'Result Html', "contexts":['link'],
                                    "documentUrlPatterns":['http://ukrav/results/tables*', 'http://ukrav/results/compare*'],
                                    "targetUrlPatterns":['http://ukrav/results/get_result_rav*']});
    }
    else if(request.action==='openUrl'){
        chrome.tabs.create({'url':request.url, 'index':sender.tab.index+1});
    }
});

chrome.contextMenus.onClicked.addListener(function(info,tab) {
    if(info.menuItemId==='Open'){
        chrome.tabs.create({'url':info.linkUrl, 'index':tab.index+1});
    }
    else{
        chrome.tabs.sendMessage(tab.id, {contextId: info.menuItemId, contextUrl:info.linkUrl});
    }
});

