(function($) {
	var xmlhttp = new XMLHttpRequest();


	//utility functions
	var loadHistory = function() {
		var history = JSON.parse(localStorage.getItem('requests'));

		if (history && history.length > 0) {
			var historyHTML = '';
			for (var i=0; i<history.length; i++) {
				var h = history[i];
				historyHTML += '<li class="list-group-item" data-index="' + i + '"><a href="javascript:///" class="request">' + h.description + '</a>' +
				'<span class="glyphicon glyphicon-remove pull-right request-remove"></span>' +
				'<span class="glyphicon glyphicon-heart' + (h.favorite ? '' : '-empty') + ' pull-right request-favorite"></span></li>';
			}

			document.getElementById('history').innerHTML = historyHTML;
		} else {
			document.getElementById('history').innerHTML = '<li class="list-group-item">Your history will end up here</li>';
		}
	}

	var saveInHistory = function(request, index) {
		if (typeof index === 'undefined') {
			index = 0;
		}

		if (typeof request.favorite === 'undefined') {
			request.favorite = false;
		}

		var history = JSON.parse(localStorage.getItem('requests'));
		if (history == null) {
			history = [];
		}
		history.splice(index, 0, request);

		//purge old
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

	var removeRequestFromHistory = function(index) {
		var history = JSON.parse(localStorage.getItem('requests'));
		if (history && history.length > index) {
			history.splice(index, 1);
			localStorage.setItem('requests', JSON.stringify(history));
		}
	}

	var getFirstIndexAfterFavorites = function() {
		return parseInt($('.glyphicon-heart').last().parent().attr('data-index')) + 1;
	}

	//events
	$(document).on('click', '.request-favorite', function(ev) {
		var el = $(ev.currentTarget);
		var index = el.parent().attr('data-index');
		var newindex = 0;
		var request = getRequestFromHistory(index);
		if (typeof request.favorite === 'undefined') {
			request.favorite = false;
		}
		request.favorite = !request.favorite;
		newindex = request.favorite ? 0 : index;
		removeRequestFromHistory(index);
		saveInHistory(request, newindex);
		loadHistory();
	});

	$(document).on('click', '.request-remove', function(ev) {
		var el = $(ev.currentTarget);
		var index = el.parent().attr('data-index');
		removeRequestFromHistory(index);
		loadHistory();
	});

	$(document).on('click', '.request', function(ev) {
		var el = $(ev.currentTarget);
		var request = getRequestFromHistory(el.parent().attr('data-index'));
		document.getElementById('request').value = request.request;
		document.getElementById('description').value = request.description;
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
		var description = document.getElementById('description').value;
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

		if (description === '') {
			description = method + ' ' + url;
			document.getElementById('description').value = description;
		}
		saveInHistory({
			description: description,
			request: request
		}, getFirstIndexAfterFavorites());
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
	(function() {
		loadHistory();

		var lastrequest = getRequestFromHistory(0);
		if (lastrequest == null) {
			document.getElementById('request').value = `POST http://requestb.in/qylhrqqy HTTP/1.1
Content-Type: text/plain;charset=UTF-8

hi!`;
		} else {
			document.getElementById('request').value = lastrequest ? lastrequest.request : '';
		}
	})();
})(jQuery)