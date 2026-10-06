// ---- clipboard.js --------------------------------------------------------------
/*
Author       : Dreams Technologies
Template Name: Dreams AI
*/
(function () {
    "use strict";

	// Clipboard
	if (typeof ClipboardJS !== "undefined" && document.querySelector('.clipboard')) {
		const clipboard = new ClipboardJS('.btn');
	}

})();
