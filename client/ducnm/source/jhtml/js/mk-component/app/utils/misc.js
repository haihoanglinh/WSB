(function($) {
	'use strict';

	MK.utils = window.MK.utils || {};

	MK.utils.misc = {};
	// TODO: move to namespace

	/**
	 * Get all top offsets from jQuery collection
	 * 
	 * @param  {$Objects}
	 * @return {Aray}
	 */
	MK.utils.offsets = function( $els ) {
		return $.map( $els, function( el ) {
			return $( el ).offset().top;
		});
	};

	/**
	 * Retrive from array of numbers first number that is higher than given parameter
	 * 
	 * @param  {Number}
	 * @param  {Array}
	 * @return {Number}
	 */
	MK.utils.nextHigherVal = function( val, arr ) {
		var i = 0,
			higher = null;

		var check = function() {
			if( val > arr[ i ]) {
				i += 1;
				check();
			} else {
				higher = arr[ i ];
			}
		};
		check();

		return higher;
	};


    MK.utils.throttle = function( delay, fn ) {
        var last;
        var deferTimer;

        return function() {
            var context = this;
            var args = arguments;
            var now = +new Date;
            if( last && now < last + delay ) {
            	clearTimeout( deferTimer );
            	deferTimer = setTimeout( function() { 
            		last = now; fn.apply( context, args ); 
            	}, delay );
          	} else {
            	last = now;
            	fn.apply( context, args );
          	}
        };
    };

})(jQuery); 