['content.js', 'overlib_bubble_new_db.js'].forEach(function(script){
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(script);
    s.onload = function() {
        //alert('js load');
        this.parentNode.removeChild(this);
    };
    (document.head||document.documentElement).appendChild(s);
});

var product_save_for_history;

// the only way to communicate with inject content script
window.addEventListener("message",function(event) {
    // We only accept messages from ourselves
    if (event.source!=window)
        return;

    if (event.data.type && (event.data.type==="FROM_INJECT_CONTECT")) {
        console.log("product name received: " + event.data.text);
        product_save_for_history=event.data.text;
    }
}, false);

//send request to background script
chrome.runtime.sendMessage({"action":"createContextMenuItem"});

// http://ukrav/results/get_result_rav.php?t=lte_3gpp_fdd_platc_cue&trun=RAV52_15_03_11_18_22&tnum=00001
// http://ukrav/results/full_test_history.php?page=lte_3gpp_fdd_platc_cue&test_number=00001

chrome.runtime.onMessage.addListener(function(request) {
    if(request.contextId==='History'){
        var url=request.contextUrl;
        if(url.search(/get_result_rav\.php\?/)>=0){
            /*
            if(!product_save_for_history){
                var r=/^.*t=([^&]+)&.*&tnum=(\d{5})$/.exec(url);
                product_save_for_history=r[1];
            }*/
            url=url.replace(/^.*t=([^&]+)&.*&tnum=(\d{5})$/, 'http://ukrav/results/full_test_history.php?page=$1&test_number=$2');
            chrome.runtime.sendMessage({"action":"openUrl", "url":url});
        }
        // file://stv-nas/LTE_Results_Builds/Release_Candidates/LTE/SUE_COMBINED/LTE-SUE-4X2-LSA_L1_15_06_17_17_31_36/Results/RAV19_15_06_17_18_28/87354_NAS_10MHz_NAS_Attach_IPv6_Default_Bearer_PacketFilter_With_ProtocolId_PPPoE_RoHC_20150618-03-20-33.html
        else if(url.search(/^file:/)>=0){
            if(product_save_for_history){
                url=url.replace(/^.*Results\/[^\/]+\/(\d{5})_.*$/, 'http://ukrav/results/full_test_history.php?page='+product_save_for_history+'&test_number=$1');
                chrome.runtime.sendMessage({"action":"openUrl", "url":url});
            }
            else{
                alert('Error: no product was detected');
            }
        }
        else{
            console.log('error: no history in url, '+url);
        }
    }
    else if(request.contextId==='Result'){
        var url=request.contextUrl;
        var req = new XMLHttpRequest();
        req.onreadystatechange=function(){
            if(req.readyState == 4 && req.status == 200){
                var r=/<a href='(file:[^<]+html)'<\/a>. HTML Result log/.exec(req.responseText)
                if(r){
                    console.log('get file url: '+r[1]);
                    chrome.runtime.sendMessage({"action":"openUrl", "url":r[1]});
                }
                else{
                    console.log('cannot find file in url: '+url);
                }
            }
        };
        req.open('GET', url, true);
        console.log('XMLHttpRequest request: ' + url);
        req.send(null);
    }
});
