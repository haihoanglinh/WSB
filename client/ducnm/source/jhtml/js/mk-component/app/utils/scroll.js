(function($) {
	'use strict';

	MK.utils = window.MK.utils || {};

	/**
	 * Scrolls page to static pixel offset
	 * @param  {Number}
	 */
	MK.utils.scrollTo = function( offset ) {
		$('html, body').stop().animate({
			scrollTop: offset
			}, {
	  		duration: 1200,
	  		easing: "easeInOutExpo"
		});
	};

	/**
	 * Scrolls to element passed in as object or DOM reference
	 * @param  {String|Object}
	 */
	MK.utils.scrollToAnchor = function( hash ) {
		var $target = $( hash );
		// console.log( hash );

		if( ! $target.length ) return;

		var offset  = $target.offset().top;
		offset = offset - MK.val.offsetHeaderHeight( offset );

		if( hash === '#top-of-page' ) window.history.replaceState( undefined, undefined, ' ' );
		else window.history.replaceState( undefined, undefined, hash );

		MK.utils.scrollTo( offset );
	};

	/**
	 * Controls native scroll behaviour
	 * @return {Object} => {disable, enable}
	 */
	MK.utils.scroll = (function() {
        // 37 - left arror, 38 - up arrow, 39 right arrow, 40 down arrow
	    var keys = [38, 40];

        function preventDefault(e) {
          e = e || window.event;
          e.preventDefault();
          e.returnValue = false;  
        }

        function wheel(e) {
          preventDefault(e);
        }

        function keydown(e) {
            for (var i = keys.length; i--;) {
                if (e.keyCode === keys[i]) {
                    preventDefault(e);
                    return;
                }
            }
        }

        function disableScroll() {
            if (window.addEventListener) {
                window.addEventListener('DOMMouseScroll', wheel, false);
            }
          	window.onmousewheel = document.onmousewheel = wheel;
          	document.onkeydown = keydown;
        }

        function enableScroll() {            
          	if (window.removeEventListener) {
                window.removeEventListener('DOMMouseScroll', wheel, false);
            }
            window.onmousewheel = document.onmousewheel = document.onkeydown = null; 
        }	

        return {
        	disable : disableScroll,
        	enable  : enableScroll
        };

	})();

	/**
	 * Checks if passed link element has anchor inside current page. Returns string like '#anchor' if so or false
	 * @param  {String|Object}
	 * @return {String|Boolean}
	 */
	MK.utils.detectAnchor = function( el ) {
		var $this = $( el ),
			loc = window.location,
			currentPage = loc.origin + loc.pathname,
			href = $this.attr( 'href' ),
			linkSplit = (href) ? href.split( '#' ) : '',
			hrefPage  = linkSplit[0] ? linkSplit[0] : '', 
			hrefHash  = linkSplit[1] ? linkSplit[1] : '';

		if( (hrefPage === currentPage || hrefPage === '') && typeof hrefHash !== 'undefined' && hrefHash !== '' ) {
			return '#' + hrefHash;
		} else {
			return false;
		}
	};

	/**
	 * This should be invoked only on page load. 
	 * Scrolls to anchor from  address bar
	 */
	MK.utils.scrollToURLHash = function() {
		var loc = window.location,
			hash = loc.hash;

		if ( hash.length && hash.substring(1).length ) {
			// !loading is added early after DOM is ready to prevent native jump to anchor
			hash = hash.replace( '!loading', '' );

			// Wait for one second before animating 
			// Most of UI animations should be done by then and async operations complited
			setTimeout( function() {
				MK.utils.scrollToAnchor( hash );
			}, 1000 ); 

			// Right after reset back address bar
			setTimeout( function() {
				window.history.replaceState(undefined, undefined, hash);
			}, 1001);
		}
	};

	/**
	 * Scroll Spy implementation. Spy dynamic offsets of elements or static pixel offset
	 * @param  {Number|Element}
	 * @param  {Object} => callback object {before, active, after}
	 */
	MK.utils.scrollSpy = function( toSpy, config ) {
		var $window   = $( window ),
	        container = document.getElementById( 'wrapper' ),
	        isObj     = ( typeof toSpy === 'object' ),
	        offset    = (isObj) ? MK.val.dynamicOffset( toSpy, config.position, config.threshold ) : function() { return toSpy; },
	        height    = (isObj) ? MK.val.dynamicHeight( toSpy ) : function() { return 0; },
	        cacheVals = {},
	        _p 		  = 'before'; // current position

		var checkPosition = function() {
	    	var s = MK.val.scroll(), 
	    		o = offset(),
	    		h = height();

	        if( s < o && _p !== 'before' ) {
	        	// console.log( toSpy, 'before' );
	        	if( config.before ) config.before();
	        	_p = 'before';
	        } 
	        else if( s >= o && s <= o + h && _p !== 'active' ) {
	        	// console.log( toSpy, 'active' );
	        	if( config.active ) config.active( o );
	        	_p = 'active';
	        }
	        else if( s > o + h && _p !== 'after' ) {
	        	// console.log( toSpy, 'after' );
	        	if( config.after) config.after( o + h );
	        	_p = 'after';
	        }
		};

		var rAF = function() {
			window.requestAnimationFrame( checkPosition );
		};

		var exportVals = function() {
			return cacheVals;    
		};

		var updateCache = function() {
	    	var o = offset(),
	    		h = height();
	    		
	        cacheVals = {
	        	before : o - $window.height(),
	        	active : o,
	        	after : o + h
	        };
		};

		if( config.cache ) {
			config.cache( exportVals );
		}

	    checkPosition();
	    $window.on( 'load', checkPosition );
	    $window.on( 'resize', checkPosition );
	    $window.on( 'mouseup', checkPosition );
   		window.addResizeListener( container, checkPosition );

	    $window.on( 'scroll', rAF ); 

   		updateCache();
	    $window.on( 'load', updateCache );
	    $window.on( 'resize', updateCache );
   		window.addResizeListener( container, updateCache );
	};

}(jQuery));