var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}

var req;
var popup_num=0;
var old_nd=nd;
var nd=function(time){
    console.log('nd enter. popup_num:' + popup_num);
    if(popup_num>0){
        console.log('start close popup. popup_num:'+popup_num);
        popup_num--;
        return old_nd(time);
    }
    else{
        req.aborted=true;
        console.log('XMLHttpRequest aborted');
        if(req.abort){
            req.abort();
        }
    }
    return true;
};

function bubble(a) {
    
    var pop_html ='';	
    
    if(a.href.search("stv-nas") != -1) {
    
    	var a_href_array = a.href.split("/");
        var a_href_array_length = a_href_array.length                
        var build = a_href_array[a_href_array_length - 4];
        var test_run_name = a_href_array[a_href_array_length - 2];        
        var test = a_href_array[a_href_array_length - 1];
        var test_name_array = test.split("_");
        
        for (var i=0;i<=test_name_array.length - 2;i++){
            if (i == 0) test = test_name_array[i];
            else test = test + "_" + test_name_array[i];
        }
        test = test + ".txt";

        var test_exec_date_temp = test_name_array[test_name_array.length -1];
        var test_exec_date = test_exec_date_temp.slice(6,8) + "/" 
                            + test_exec_date_temp.slice(4,6) + "/" 
                            + test_exec_date_temp.slice(0,4)
                            + " " + test_exec_date_temp.slice(9,11) + ":"   
                            + test_exec_date_temp.slice(12,14) + ":"   
                            + test_exec_date_temp.slice(15,17);   
                            
        if (a.title.length == 0) { 
            var result = a.innerHTML;
        } else {
            var result = a.title;
        }
                
        pop_html = "<b>Build:</b> "+ build +"<br />";        
        pop_html = pop_html + "<b>Test:</b> "+ test +"<br />";        
        pop_html = pop_html + "<b>Result:</b> "+ result +"<br />";    
        pop_html = pop_html + "<b>Test Run Name:</b> "+ test_run_name +"<br />";  
        pop_html = pop_html + "<b>Test execution date:</b> "+ test_exec_date +"<br />"; 
        
        popup_num++;
        return overlib(pop_html,WIDTH, 350);   
    }
    else {
        var table = a.href.split("t=")[1].split("&")[0];	
     
                            
        test_run_name = a.href.split("trun=")[1].split("&tnum=")[0];
        test = a.href.split("&tnum=")[1];    
        
        
        if ( (test.search("START") == -1)  && (test.search("STOP") == -1)  && (test.search("RESET") == -1) ) {
            var XMLHttp=null
            if (window.XMLHttpRequest){
                req = new XMLHttpRequest();
            } else if (window.ActiveXObject){
                req = new ActiveXObject("Microsoft.XMLHTTP");
            }
            req.onreadystatechange=function(){
                if(req.readyState == 4){
                    if(req.aborted){
                        console.log('XMLHttpRequest response discard due to aborted.');
                        return;
                    }
                    if(req.status == 200) {
                        pop_html = req.responseText;
                    }
                    else {
                        pop_html = ' Error in UKRAV result server, XMLHttpRequest return : '+req.status;
                    }
                    popup_num++;
                    console.log('XMLHttpRequest reponse: status '+req.status+' popup_num:'+popup_num);
                    overlib(pop_html,WIDTH, 600);  
                }
            };
            var url='http://ukrav/results/get_result_rav_bubble.php?t='+table+'&trun='+test_run_name+'&tnum='+test;
            req.open('GET', url, true);
            console.log('XMLHttpRequest request: '+url);
            req.aborted=false;
            req.send(null);  
            return true;
        }
        else {
            pop_html = pop_html + "<b>Test:</b> "+ test +"<br />";                    
            pop_html = pop_html + "<b>Test Run Name:</b> "+ test_run_name +"<br />";  
            pop_html = pop_html + "<b>Please click the link to get detail information for : "+ test +"<br />"; 
            popup_num++;
            return overlib(pop_html,WIDTH, 600);   
        }        
        
    }        
	
}