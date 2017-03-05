jQuery(window).on( 'load', function() {

    "use strict";

    $('.blog-item-share-btn').toggle(
        function() {
            $(this).parent().find('.blog-item-share-services').fadeIn(300);
        },
        function() {
            $(this).parent().find('.blog-item-share-services').fadeOut(300);
        }
    );
            
});