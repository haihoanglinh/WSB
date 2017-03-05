jQuery(window).on( 'load', function() {

    "use strict";

    $('.js-slideshow').each( function() {

        var $slideshow = $(this),
            options = $.parseJSON( $slideshow.attr('data-options') );

        $slideshow.flexslider({
            animation:            options.animation,
            selector:             '.slideshow__slides > .slideshow__slide',
            smoothHeight:         options.smoothHeight,
            touch:                true,
            keyboard:             true,
            pauseOnHover:         options.pauseOnHover,
            animationLoop:        true,
            slideshow:            true,
            controlNav:           false,
            animationSpeed:       options.animationSpeed,
            slideshowSpeed:       options.slideshowSpeed,
            controlsContainer:    $slideshow.find('.slideshow__nav'),
            customDirectionNav:   $slideshow.find('.slideshow__nav a'),
        });

    });
    

});