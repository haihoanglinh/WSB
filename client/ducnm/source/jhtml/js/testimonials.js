jQuery(function($) {


    $('.js-testimonial-slider').each( function() {

        var $testimonial_slider = $(this),
            options = {};

        if ( $testimonial_slider.hasClass('testimonial-slider--modern') ) {

            options = {
                selector: ".js-testimonial-slides > li",
                slideshow: true,
                animation: "fade",
                smoothHeight: true,
                slideshowSpeed: 6000,
                animationSpeed: 400,
                pauseOnHover: true,
                controlNav: true,
                smoothHeight: false,
                directionNav: false,
                controlsContainer:  $testimonial_slider.find('.testimonial_slider__nav'),
                customDirectionNav: $testimonial_slider.find('.testimonial_slider__nav a'),
            };

        } else {

            options = {
                selector: ".js-testimonial-slides > li",
                slideshow: true,
                animation: "fade",
                smoothHeight: true,
                slideshowSpeed: 6000,
                animationSpeed: 400,
                pauseOnHover: true,
                controlNav: false,
                smoothHeight: false,
                directionNav: true,
                controlsContainer:  $testimonial_slider.find('.testimonial_slider__nav'),
                customDirectionNav: $testimonial_slider.find('.testimonial_slider__nav a'),
            };

        }

        $testimonial_slider.flexslider(options);

    });
    
    
});