(function() {

	//events
	document.getElementById('send-request').onclick = function() {
		var request = document.getElementById('request').value;
		var firstline = request.split('\n')[0];
		var method = firstline.split(' ')[0];
		var url = firstline.split(' ')[1];

		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
				var response = '';
				response += xmlhttp.getAllResponseHeaders();
				response += '\n';
				if (xmlhttp.status == 200) {
					response += xmlhttp.responseText;
				} else {
					response += 'response returned status code ' + xmlhttp.status;
				}
				document.getElementById("response").value = response;
			}
		};

		try {
			xmlhttp.open(method, url, true);
			xmlhttp.send();
		} catch (ex) {
			document.getElementById("response").value = ex;
		}
	};
})()