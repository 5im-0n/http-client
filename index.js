(function($) {
	//utility functions
	var loadHistory = function() {
		var history = JSON.parse(localStorage.getItem('requests'));

		if (history && history.length > 0) {
			var historyHTML = '';
			for (var i=0; i<history.length; i++) {
				var h = history[i];
				historyHTML += '<li class="list-group-item"><a href="javascript:///" class="request" data-index="' + i + '">' + h.method + ' ' + h.url + '</a></li>';
			}

			document.getElementById('history-and-favorites').innerHTML = historyHTML;
		}

	}

	var saveInHistory = function(method, url, request) {
		var requestItem = {
			method: method,
			url: url,
			request: request
		};

		var history = JSON.parse(localStorage.getItem('requests'));
		if (history == null) {
			history = [];
		}
		history.unshift(requestItem);
		localStorage.setItem('requests', JSON.stringify(history));
		localStorage.setItem('lastexecuted', JSON.stringify(history));
	}

	var getRequestFromHistory = function(index) {
		return JSON.parse(localStorage.getItem('requests'))[index];
	}


	//events
	$(document).on('click', '.request', function(ev) {
		var el = $(ev.currentTarget);
		var request = getRequestFromHistory(el.attr('data-index'));
		document.getElementById('request').value = request.request;
	});

	$(document).on('click', '#send-request', function() {
		var request = document.getElementById('request').value;
		var requestLines = request.split('\n');
		var firstline = requestLines[0];
		var method = firstline.split(' ')[0];
		var url = firstline.split(' ')[1];
		var headers = [];
		var hasBody = request.split('\n\n');
		var body = '';
		if (hasBody.length > 1) {
			body = hasBody[1];
		}

		for (var i=1; i<requestLines.length; i++) {
			if (requestLines[i] === '') {
				break;
			}
			headers.push({
				name: requestLines[i].split(': ')[0],
				value: requestLines[i].split(': ')[1]
			});
		}

		saveInHistory(method, url, request);
		loadHistory();

		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
				var response = '';
				response += 'HTTP/1.1 ' + xmlhttp.status + ' ' + xmlhttp.statusText + '\n';
				response += xmlhttp.getAllResponseHeaders();
				response += '\n';
				response += xmlhttp.responseText;
				document.getElementById("response").value = response;
			}
		};

		try {
			xmlhttp.open(method, url, true);

			//set headers
			for (var i=0; i<headers.length; i++) {
				xmlhttp.setRequestHeader(headers[i].name, headers[i].value);
			}

			xmlhttp.send(body);
		} catch (ex) {
			document.getElementById("response").value = ex;
		}
	});


	//startup
	loadHistory();
})(jQuery)