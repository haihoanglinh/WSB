

// -----    slideshow  -----
jQuery(window).on( 'load', function() {

    "use strict";

    $('.js-lcd-slideshow').each( function() {

        var $slideshow = $(this).find('.lcd-slideshow__inner'),
            options = $.parseJSON( $slideshow.attr('data-options') );

        $slideshow.flexslider({
            animation:            options.animation,
            selector:             '.lcd-slideshow__slides > li',
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

$(document).ready(function(){
    var height_left = $('#flyer-helike-left>div').innerHeight();
    var height_right = $('#flyer-helike-right>div').innerHeight();
    var temp;
    if(height_left>height_right) {
        height_right=height_left;
        temp=height_right;
    }else {
        height_left=height_right;
        temp=height_left;
    }
    $('#flyer-helike-left>div').css("min-height",temp);
    $('#flyer-helike-right>div').css("min-height",temp);
});
$(document).ready(function(){
    $(".checkbox-search").click(function(){
        $(this).hide();
        $(this).next().show();
    });
    $(".checkbox-search-2").click(function(){
        $(this).hide();
        $(this).prev().show();
    });
});
