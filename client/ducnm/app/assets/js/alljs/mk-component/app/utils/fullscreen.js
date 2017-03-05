(function($) {
	'use strict';

	MK.utils = window.MK.utils || {};

	/**
	 * Control browser fullscreen mode
	 * @type {Object}
	 */
	MK.utils.fullscreen = {};

	// TODO: move to namespace
	MK.utils.launchIntoFullscreen = function ( element ) {
	    if(element.requestFullscreen) {
	     	element.requestFullscreen();
	  	} else if(element.mozRequestFullScreen) {
	    	element.mozRequestFullScreen();
	  	} else if(element.webkitRequestFullscreen) {
	    	element.webkitRequestFullscreen();
	  	} else if(element.msRequestFullscreen) {
	    	element.msRequestFullscreen();
	  	}
	};

	MK.utils.exitFullscreen = function () {
	  	if(document.exitFullscreen) {
	    	document.exitFullscreen();
	  	} else if(document.mozCancelFullScreen) {
	    	document.mozCancelFullScreen();
	  	} else if(document.webkitExitFullscreen) {
	    	document.webkitExitFullscreen();
	  	}
	};

}(jQuery));