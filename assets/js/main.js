$('form.ajax').on('submit', function() {
	var that          = $(this),
	    url           = that.attr('action'),
	    method        = that.attr('method'),
	    status        = that.find('.status'),
	    successStatus = that.data('success-status'),
	    data          = {};

	that.find('[name]').each(function(index, value) {
		var that = $(this),
		    name = that.attr('name'),
		    value = that.val();

		data[name] = value;
	});

	$.ajax({
		xhr: function() {
			var xhr = new window.XMLHttpRequest();
			xhr.upload.addEventListener("progress", function(evt) {
				if (evt.lengthComputable) {
					var percentComplete = evt.loaded / evt.total;
					status.text(Math.round(percentComplete * 100) + '%');
				}
			}, false);
			return xhr;
		},
		url: url,
		type: method,
		data: data,
		success: function(response) {
			if (response.status == successStatus) {
				that.find('[name]').not('[type="hidden"]').each(function(index, value) {
					$(this).val('');
				});
				status.text('Ihre Nachricht wurde erfolgreich versendet.');
			} else {
				status.text('Fehler! Bitte überprüfen Sie ihre Eingaben.');
				console.error(response);
			}
		}
	});

	return false;
});

xpfyEl = document.querySelector('#xpfy');
titleEl = document.querySelector('#xpfy-title');
xpfyEl.addEventListener('titleChange', function(e) {
	titleEl.innerHTML = e.detail.newTitle;
});
