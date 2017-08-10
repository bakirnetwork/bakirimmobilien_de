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

$(function() {
	var gallery = $('.slider .column'),
	    imgs    = gallery.find('.slider-img'),
	    len     = imgs.length,
	    current = 0,  // the current item we're looking
	    moving  = false, // current animation state

	    firstChild      = imgs.filter(':nth-child(1)'),
	    secondChild     = imgs.filter(':nth-child(2)'),
	    firstLastChild  = imgs.filter(':nth-last-child(1)'),
	    secondLastChild = imgs.filter(':nth-last-child(2)');

	// Clone the first and last items
	firstChild.before(secondLastChild.clone(true));
	firstChild.before(firstLastChild.clone(true));
	firstLastChild.after(secondChild.clone(true));
	firstLastChild.after(firstChild.clone(true));

	var items = gallery.find('.slider-img');

	// Add js-slider-control class to all slider <img>’s in DOM
	items.each(function() {
		$(this).addClass('js-slider-control');
	})

	$.Velocity.hook(gallery, 'translateX', -970 * 2  + 'px');
	$(imgs[current]).addClass('slider-img-current');

	updateSliderClasses(0 + 2, current + 2);

	function updateSliderClasses(oldIndex, newIndex, transition = true) {
		if (!transition) {
			$(items[oldIndex]).addClass('slider-img-no-transition');
			$(items[newIndex]).addClass('slider-img-no-transition');

			setTimeout(function() {
				$(items[oldIndex]).removeClass('slider-img-no-transition');
				$(items[newIndex]).removeClass('slider-img-no-transition');
			}, 1)
		}

		$(items[oldIndex]).removeClass('slider-img-current');
		$(items[oldIndex - 1]).removeClass('js-slider-prev');
		$(items[oldIndex + 1]).removeClass('js-slider-next');

		$(items[newIndex]).addClass('slider-img-current');
		$(items[newIndex - 1]).addClass('js-slider-prev');
		$(items[newIndex + 1]).addClass('js-slider-next');
	}

	function moveSlider(delta = 1) {
		if (gallery.is(':not(:animated)')) {

			var cycle = false;

			gallery.velocity(
				{ translateX: (current + delta + 2) * -970 },
				{ begin: function() {

					moving = true;
					updateSliderClasses(current + 2, current + delta + 2);

				}, complete: function() {

					current += delta;

					// cycling of the slider when one “turn” is completed
					if (current == -1 ) {
						// left overflow
						console.log(len);
						current = len - 1;
						$.Velocity.hook(gallery, 'translateX', -970 * (current + 2)  + 'px');
						updateSliderClasses(1, len + 1, false);
					} else if (current > len -1) {
						// right overflow
						current = 0;
						$.Velocity.hook(gallery, 'translateX', -970 * (current + 2)  + 'px');
						updateSliderClasses(len + 2, current + 2, false);
					}

					moving = false;

				}}
			);
		}
	}

	$('.js-slider-control').click(function() {
		that = $(this);

		if (moving) {
			return;
		}

		if (that.hasClass('js-slider-prev')) {
			moveSlider(-1);
		} else if (that.hasClass('js-slider-next')) {
			moveSlider(1);
		}
	});

	$('.js-open-request-modal').click(function() {
		$('body').addClass('no-scroll');
		$('#request-modal-container').addClass('modal-container-show');
	});

	$('.js-close-request-modal').click(function() {
		$('body').removeClass('no-scroll');
		$('#request-modal-container').removeClass('modal-container-show');
	});

	$('.modal').click(function(e) {
		e.stopPropagation();
	});
});
