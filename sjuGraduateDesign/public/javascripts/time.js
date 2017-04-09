function time2Date(time){
	 function add0(m){return m<10?'0'+m:m };
                var time = new Date(time*1000);
                var y = time.getFullYear();
                var m = time.getMonth()+1;
                var d = time.getDate();
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
//              return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
                return y+'-'+add0(m)+'-'+add0(d);
}

function time2Date2(time){
	 function add0(m){return m<10?'0'+m:m };
                var time = new Date(time*1000);
                var y = time.getFullYear();
                var m = time.getMonth()+1;
                var d = time.getDate();
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
                return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);

}


function get_unix_time(dateStr)
{
    var newstr = dateStr.replace(/-/g,'/'); 
    var date =  new Date(newstr); 
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
}

function thisTime()
{
	function add0(m){return m<10?'0'+m:m };
	var mydate = new Date();
	var y = mydate.getFullYear();
	var m = mydate.getMonth()+1;
	var d = mydate.getDate();
	return y+'-'+add0(m)+'-'+add0(d);
}
