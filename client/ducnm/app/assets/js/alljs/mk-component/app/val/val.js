(function($) {
	'use strict';

	/**
	 * 	MK.val is collection of Lambdas responsible for returning up to date values of method type like scrollY or el offset.
	 * 	The Lambda is responsible for keeping track of value of a particular property, usually takes as argument an object 
	 * 	(or DOM reference) and internally creates and updates data that is returned as primitive value - through variable reference.
	 *
	 *  Benefits of this approach:
	 *  - reduced DOM reads
	 *  - auto-updating values without need for additional logic where methods are called
	 *  - updating values when needed to be updated not read
	 *
	 *  Downsides:
	 *  - Memory overhead with closures and keeping state in memory ( still beter than read state from DOM, but use wisely - 
	 *    do not use it when you really need static value on runtime )
	 */
	MK.val = {};

	/**
	 * Current window offsetY position
	 *
	 * @uses   MK.val.scroll()
	 * @return {number}
	 */
	MK.val.scroll = (function() {
		var offset = 0,
			$window = $( window ),
			hasPageYOffset = ( window.pageYOffset !== undefined ),
			body = ( document.documentElement || document.body.parentNode || document.body ); // cross browser handling

		var update = function() {
			offset = hasPageYOffset ? window.pageYOffset : body.scrollTop;
		};

		var rAF = function() {
			window.requestAnimationFrame( update );
		}; 

		update();
		$window.on( 'load', update );
		$window.on( 'resize', update );
		$window.on( 'scroll', rAF ); 

		return function() {
			return offset; 
		};
	})();
	

	/**
	 * Changes number of percent to pixels based on viewport height
	 *
	 * @uses   MK.val.viewportPercentHeight({percent val})
	 * @param  {number}
	 * @return {number}
	 */
	MK.val.viewportPercentHeight = function( percent ) {
		return $( window ).height() * ( percent / 100 );
	};


	/**
	 * Wordpress adminbar height based on wp media queries
	 * @return {Number}
	 */
    MK.val.adminbarHeight = function() {
        if( php.hasAdminbar ) {
        	// apply WP native media-query and sizes
        	return ( window.matchMedia( '( max-width: 782px )' ).matches ) ? 46 : 32;
        } else {
        	return 0;
        }
    };
    

    /**
     * Offset when header becomes sticky. Evaluates viewport % and header height to pixels for according options
     * @return {Number}
     */
    MK.val.stickyOffset = (function() {
	    var $header = $('.mk-header').not('.js-header-shortcode').first();

		// We need to have returning function even when header is disabled
		if(!$header.length) {
			return function() {
				return 0;
			};
		}

	    var $toolbar = $header.find( '.mk-header-toolbar' ),
			config = $header.data(),
			hasToolbar = $toolbar.length,
			toolbarHeight = (hasToolbar) ? $toolbar.height() : 0,
			isVertical = (config.headerStyle === 4),
			headerHeight = (isVertical) ? 0 : config.height;

        var type = ((typeof config.stickyOffset === 'number')   ? 'number' : false) ||
                   ((config.stickyOffset === 'header')          ? 'header' : false) ||
                                                                  'percent';

        var stickyOffset = 0;
        var setOffset = function() {

			// headerHeight = (isVertical) ? 0 : config.height;
			
	        if( type === 'number' ) {
	        	stickyOffset = config.stickyOffset;
	        }
	        else if( type === 'header' ) {
	        	stickyOffset = headerHeight + toolbarHeight + MK.val.adminbarHeight(); // add all header components here, make them 0 if needed
	        }
	        else if( type === 'percent' ) {
	        	stickyOffset = MK.val.viewportPercentHeight( parseInt(config.stickyOffset) );
	        }
        };

        setOffset();
        $(window).on('resize', setOffset);

        return function() {
        	return stickyOffset;
        };
    }());



	/**
	 * Gets header height on particular offsetY position. Use to determine logic for fullHeight, smooth scroll etc.
	 * Takes one parameter which is offset position we're interested in.
	 *
	 * @uses   MK.val.offsetHeaderHeight({offset val})
	 * @param  {number}
	 * @return {number}
	 */
	MK.val.offsetHeaderHeight = (function() { // Closure avoids multiple DOM reads. We need to fetch header config only once.
	    var $header = $('.mk-header').not('.js-header-shortcode').first();

		// We need to have returning function even when header is disabled
		if(!$header.length) {
			return function() {
				return 0;
			};
		}

	    var $toolbar = $header.find( '.mk-header-toolbar' ),
			config = $header.data(),
			stickyHeight = config.stickyHeight,
			desktopHeight = config.height,
			mobileHeight = config.responsiveHeight,
			isTransparent = $header.hasClass( 'transparent-header' ),
			isSticky = config.stickyStyle.length,
			isStickyLazy = config.stickyStyle === 'lazy',
			isVertical = config.headerStyle === 4,
			hasToolbar = $toolbar.length,
			toolbarHeight = hasToolbar ? $toolbar.height() : 0,
			bufor = 5;

		var headerHeight = function( offset ) {
			var stickyOffset = MK.val.stickyOffset();

			if( MK.utils.isResponsiveMenuState() ) { // Header avaible only on top for mobile
				var totalHeight = mobileHeight + MK.val.adminbarHeight();
				if( offset <= totalHeight ) return totalHeight; 
				else return MK.val.adminbarHeight();
			} else {
				if( offset <= stickyOffset ) { 
					if( isVertical ) { 
						if( hasToolbar ) { return toolbarHeight + MK.val.adminbarHeight(); }
						else { return MK.val.adminbarHeight(); }
					}
					else if( isTransparent ) { return MK.val.adminbarHeight(); }
					else { return desktopHeight + MK.val.adminbarHeight(); } // For any other return regular desktop height
				}
				else if( offset > stickyOffset) { 
					if( isVertical ) { return MK.val.adminbarHeight(); }
					else if( ! isSticky ) { return MK.val.adminbarHeight(); }
					else if( isStickyLazy ) { return MK.val.adminbarHeight(); }	
					else if( isSticky ) { return stickyHeight + MK.val.adminbarHeight(); }
				}				
			}
			// default to 0 to prevent errors ( need to return number )
			// Anyway make sure all scenarios are covered in IFs
			return 0;
		};

		return function( offset ) {
			return headerHeight( offset - MK.val.adminbarHeight());
		};
	})();


	/**
	 * Gets current offset of given element (passed as object or DOM reference) from top or bottom (default to top) 
	 * of screen  with possible threshold (default to 0)
	 * 
	 * @uses   MK.val.dynamicOffset({obj reference}, {'top'|'bottom'}, {threshold val})
	 * @param  {string|object}
	 * @param  {string}
	 * @param  {number}
	 * @return {number}
	 */
	MK.val.dynamicOffset = function( el, position, threshold ) {
        var $window = $( window ),
	        $el = $( el ),
	        pos = position || 'top',
	        thr = threshold || 0,
	        container = document.getElementById( 'wrapper' ),
	        currentPos = 0;

	    var offset = 0,
	    	winH = 0,
	    	rect = 0,
	    	x = 0;

	    var update = function() {
	    	winH = $window.height();
	    	rect = $el[ 0 ].getBoundingClientRect();
    		offset = (rect.top + MK.val.scroll());
    		x = (pos === 'top') ? MK.val.offsetHeaderHeight( offset ) : winH + ( rect.height - thr );
	    	currentPos = offset - x - 1;
	    };

        update();
        $window.on( 'load', update );
        $window.on( 'resize', update );
        window.addResizeListener( container, update );

        return function() {
        	return currentPos;
        };
	};

	/**
	 * Gets current height of given element (passed as object or DOM reference)
	 * 
	 * @uses   MK.val.dynamicHeight({obj reference})
	 * @param  {string|object}
	 * @return {number}
	 */
	MK.val.dynamicHeight = function( el ) {
        var $window = $( window ),
	        $el = $( el ),
	        container = document.getElementById( 'wrapper' ),
	        currentHeight = 0;

	    var update = function() {
	    	currentHeight = $el.outerHeight();
	    };

        update();
        $window.on( 'load', update );
        $window.on( 'resize', update );
        window.addResizeListener( container, update );

        return function() {
        	return currentHeight;
        };
	};

})(jQuery);