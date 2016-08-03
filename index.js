(function($) {
	var xmlhttp = new XMLHttpRequest();


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

		var maxElementsInHistory = 100;
		if (history.length > maxElementsInHistory) {
			history.splice(maxElementsInHistory - history.length, history.length);
		}
		localStorage.setItem('requests', JSON.stringify(history));

	}

	var getRequestFromHistory = function(index) {
		var history = JSON.parse(localStorage.getItem('requests'));
		if (history && history.length > index) {
			return history[index];
		}
		return null;
	}


	//events
	$(document).on('click', '.request', function(ev) {
		var el = $(ev.currentTarget);
		var request = getRequestFromHistory(el.attr('data-index'));
		document.getElementById('request').value = request.request;
	});

	$(document).on('click', '#abort-request', function(ev) {
		xmlhttp.abort();
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

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
				var response = '';
				response += 'HTTP/1.1 ' + xmlhttp.status + ' ' + xmlhttp.statusText + '\n';
				response += xmlhttp.getAllResponseHeaders();
				response += '\n';
				response += xmlhttp.responseText;
				document.getElementById("response").value = response;
			}

			$('#send-request-spinner').hide();
			$('#abort-request').hide();
		};

		try {
			xmlhttp.open(method, url, true);

			//set headers
			for (var i=0; i<headers.length; i++) {
				xmlhttp.setRequestHeader(headers[i].name, headers[i].value);
			}

			xmlhttp.send(body);

			$('#send-request-spinner').show();
			$('#abort-request').show();
		} catch (ex) {
			document.getElementById("response").value = ex;
		}
	});


	//startup
	loadHistory();
	var lastrequest = getRequestFromHistory(0);
	if (lastrequest == null) {
		document.getElementById('request').value = `POST http://requestb.in/qylhrqqy HTTP/1.1
Content-Type: text/plain;charset=UTF-8

hi!`;
	} else {
		document.getElementById('request').value = lastrequest ? lastrequest.request : '';
	}
})(jQuery)