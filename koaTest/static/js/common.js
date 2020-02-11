	function getLocalTimeStr(nS) {
	    if (nS && nS.indexOf("T") != -1) {
	        nS = nS.replace("T", " ").substring(0, 19);
	    } else if (nS && nS.indexOf(" ") != -1) {
	        nS = nS.substring(0, 19);
	    }
	    return nS;
	}

	function getLocalDateStr(nS) {
	    if (nS && nS.indexOf("T") != -1) {
	        nS = nS.replace("T", " ").substring(0, 10);
	    } else if (nS && nS.indexOf(" ") != -1) {
	        nS = nS.substring(0, 10);
	    }
	    return nS;
	}

	function getNowDate() {
	    var date = new Date();
	    var year = date.getFullYear();
	    var month = date.getMonth() + 1;
	    var day = date.getDate();
	    var hour = date.getHours();
	    var minute = date.getMinutes();
	    var second = date.getSeconds();
	    var result = new Date(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
	    return result.Format("yyyy-MM-dd");
	}

	function getNowDateByTimes(cur) {
	    var date = new Date(cur);
	    var year = date.getFullYear();
	    var month = date.getMonth() + 1;
	    var day = date.getDate();
	    var hour = date.getHours();
	    var minute = date.getMinutes();
	    var second = date.getSeconds();
	    var result = new Date(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
	    return result.Format("yyyy-MM-dd");
	}