(function($) {
    'use strict';

    MK.component.Grid = function( el ) {
    	var $container = $(el);
    	var config = $.parseJSON( $container.data( 'grid-config' ) );

        var init = function init(){
			create();
        };

        // // Remove el hidden without adding proper class
        var removeOddlyHidden = function removeOddlyHidden() {
            var $item = $(this);
            var isHidden = ($item.css('display') === 'none');
            if(isHidden) $item.remove();
        };

        var create = function create() {

	        function grid(item) { 
                var selector = (typeof item === 'string') ? item : config.item;

                // Prevent plugin breaking when feeding it with hidden elements
                var $items = $(selector);
                $items.each( removeOddlyHidden );

	            minigrid({
		            container: el,
		            item: selector,
		            gutter: 0 
	            });
	        }

	        grid(); 

            $(window).off('resize', grid);
            $(window).on('resize', grid);

            MK.utils.eventManager.subscribe('item-expanded', grid);
            MK.utils.eventManager.subscribe('ajaxLoaded', grid);
        };
 

        return {
         	init : init
        };
    };

})(jQuery);







