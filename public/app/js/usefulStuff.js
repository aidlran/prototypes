const loadingSpinnerImage = '/svg/load.svg';

window.onkeydown = function(event) {
	let overlayToClose = document.getElementById("overlay");
	switch (event.keyCode) {
		case 27: {
			if (overlayToClose instanceof Element || overlayToClose instanceof HTMLDocument)
				overlayToClose.parentElement.removeChild(overlayToClose);
		}
	}
}

function escapeHTML(text) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
function unescapeHtml(text) {
  return text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
}

function createLoadingSpinner() {
	let spinner = document.createElement('img');
	spinner.classList.add('loading-spinner');
	spinner.setAttribute('src', loadingSpinnerImage);
	return spinner;
}
function createOverlayElement(headingText, contentContainer) {

	let overlay = document.createElement("div"),
		overlayElement = document.createElement("div"),
		overlayElementHeading = document.createElement("div"),
		overlayElementContent = document.createElement("div");

	overlay.id = "overlay";
	overlayElement.id = "overlay-element";
	overlayElementHeading.id = "overlay-element-heading";
	overlayElementContent.id = "overlay-element-content";

	overlayElementHeading.appendChild(document.createTextNode(headingText));
	if (contentContainer instanceof Element || contentContainer instanceof HTMLDocument)
		overlayElementContent.appendChild(contentContainer);

	document.body.appendChild(overlay);
	overlay.appendChild(overlayElement);
	overlayElement.appendChild(overlayElementHeading);
	overlayElement.appendChild(overlayElementContent);

	overlay.onmousedown = closeOverlay;
	overlayElement.onmousedown = function(event) {event.stopPropagation();};

	return overlayElementContent;
}
function closeOverlay() {
	document.body.removeChild(document.getElementById("overlay"));
}