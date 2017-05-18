
//debugger;
var profile_enable=true;

(function(){
    var url=document.URL;
    if(url.search(/\/tables_30(_filter)?\.php\?/i)>=0||url.search(/\/compare\.php$/i)>=0){
        // http://ukrav/results/tables_30.php?page=lte_3gpp_fdd_platc_cue
        // http://ukrav/results/compare.php
        product_page();
    }
    else if(url.search(/full_test_history\.php\?/i)>=0){
        // http://ukrav/results/full_test_history.php?page=lte_3gpp_fdd_platc_cue&test_number=30525
        history_page(url);
    }
}());

function history_page(url){
    profile_start();
    // http://ukrav/results/get_result_rav.php?t=lte-plat-c-tdd3gpp&trun=RAV31_15_01_21_18_57&tnum=90169
    // add_url = r'http://ukrav/results/get_result_rav.php?t=%s&trun=\2&tnum=%s' % (product, test_case)
    var r=/full_test_history\.php\?page=([^&]+)&test_number=(\d{5})/.exec(url)
    var product=r[1], test_num=r[2];
    var doms=document.getElementsByTagName('table')[0].getElementsByTagName('tr');
    profile_end('parse url');
    var td_buffer=new Array();
    var td=document.createElement('TD');
    var text=document.createTextNode('Info');
    td.appendChild(text);
    td_buffer.push(td);
    for(var d=1,len=doms.length;d<len;d++){
        td=document.createElement('TD');
        text=document.createTextNode('INFO');
        var link=document.createElement('A');
        link.href=['get_result_rav.php?t=',product,'&trun=',doms[d].children[2].innerText,'&tnum=',test_num].join('');
        link.appendChild(text);
        td.appendChild(link);
        td.className=doms[d].children[3].className;
        td_buffer.push(td);
    }
    profile_end(doms.length+' rows gen');
    for(var d=0,len=doms.length;d<len;d++){
        doms[d].appendChild(td_buffer[d]);
    }
    profile_end(doms.length+' rows show');
}

var start_time;
function profile_start(){
    if(profile_enable)start_time=new Date().getTime();
}

function profile_end(s){
    if(profile_enable){
        var now=new Date().getTime();
        //alert(s+':run time '+(now-start_time)/1000+'s');
        console.log(s+':run time '+(now-start_time)/1000+'s');
        profile_start();
    }
}

function product_page(){
    profile_start();
    var table=document.getElementsByTagName('table')[0];
    table.setAttribute('id', 'change_table');
    // 1. remove pass bubble
    /*
    var doms=document.getElementsByClassName("PASS");
    for(var d=0,len=doms.length;d<len;d++){
        var c=doms[d].firstChild;
        if(c && c.nodeName==='A'){
            c.onmouseover='';
            c.onmouseout='';
        }
    }
    profile_end('process PASS');
    */
    // 2. change history
    var doms=document.getElementsByClassName("test");
    for(var d=0,len=doms.length;d<len;d++){
        var history=doms[d].firstElementChild;
        // history_plot.php?table=lte-plat-c-tdd3gpp&branch=ALL&var=ALL&tnum=82808
        // full_test_history.php?page=lte_3gpp_fdd_platc_cue&test_number=32891
        history.href=history.href.replace(/^.*table=([^&]+)&.*&tnum=(\d{5})$/, 'full_test_history.php?page=$1&test_number=$2');
    }
    profile_end('process history');
    // 3. add link
    var tds=table.getElementsByTagName('tr')[1].getElementsByTagName('td');
    var html='<br><br>[<a href="javascript:void(0);" class="showall">All</a>] [<a href="javascript:void(0);" class="showrun">Run</a>] [<a href="javascript:void(0);" class="showfail">Fail</a>] [<a href="javascript:void(0);" class="showcrash">Crash</a>]';
    for(var i=1,len=tds.length;i<len;i++){
        tds[i].insertAdjacentHTML("beforeEnd",html);
    }

    var dict = {"showall": function(){show_all(this);},
                "showrun": function(){show(this,show_run_hide);},
                "showfail": function(){show(this,show_fail_hide);},
                "showcrash": function(){show(this,show_crash_hide);}
               }
    for(var c in dict){
        var doms=document.getElementsByClassName(c);
        for(var i=0,len=doms.length;i<len;i++){
            doms[i].addEventListener("click", dict[c], false);
        }
    }
    profile_end('process add link');
    // 4. get product name
    var td=table.getElementsByTagName('tr')[2].getElementsByTagName('td')[1];
    var r=/table=([^&]+)&trun=/.exec(td.firstElementChild.href);
    var product_name=r[1];
    window.postMessage({ type: "FROM_INJECT_CONTECT", text: product_name }, "*");
    profile_end('send product name to script loader');
}

var g_hidden_trs=new Array();
function show_all(dom){
    profile_start();
    if(g_hidden_trs.length>0){
        for(var i=0;i<g_hidden_trs.length;i++){
            g_hidden_trs[i].style.display='';
        }
        g_hidden_trs=[];
    }
    profile_end('show all');
}
function show_run_hide(text){
    if(text=='Not Run')return true;
    return false;
}
function show_fail_hide(text){
    if((text=='Not Run')||(text.indexOf('PASS')>=0&&text.indexOf('FAIL')<0&&text.indexOf('CRASH')<0))return true;
    return false;
}
function show_crash_hide(text){
    if(text.indexOf('CRASH')>=0)return false;
    return true;
}
function show(dom,hide_rule){
    profile_start();
    var td=dom.parentNode;
    var index=0;
    while(td=td.previousSibling){
        if(td.nodeName=='TD')index++;
    }
    var trs=document.getElementById('change_table').getElementsByTagName('tr');
    show_all(dom);
    for(var i=3;i<trs.length;i++){
        if(hide_rule(trs[i].getElementsByTagName('td')[index].innerText)){
            g_hidden_trs.push(trs[i]);
        }
    }
    for(var i=0;i<g_hidden_trs.length;i++){
        g_hidden_trs[i].style.display='none';
    }
    profile_end('show '+dom.className);
}