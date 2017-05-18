chrome.runtime.onMessage.addListener(function(request) {
    document.getElementById('img1').src=request.img1_url;
    document.getElementById('img2').src=request.img2_url;
    document.getElementById('img3').src=request.img3_url;
    document.getElementById('img4').src=request.img4_url;
});