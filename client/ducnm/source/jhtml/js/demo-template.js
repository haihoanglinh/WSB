
/* Header ====================================================================================================================== */

jQuery(function($){

    "use strict";


    /*---------------------------------------------------------------------------------*/
    /*  Scope Values
    /*---------------------------------------------------------------------------------*/

    var $window = $('window'),
        $body = $('body'),
        $master = $('.master'),
        $header = $('.js-header'),
        $header_holder = $header.find('.header-holder'),
        $header_nav_list = $header.find('.header-nav-list'),
        $header_cart = $header_holder.find('.header-cart-holder'),
        $header_cart_content = $header_cart.find('.header-cart-content'),
        $fullscreen_search = $('.fullscreen-search'),
        $fullscreen_search_close_btn = $fullscreen_search.find('.fullscreen-search-close-btn'),
        $fullscreen_search_input = $fullscreen_search.find('.fullscreen-search-input'),
        $header_search = $header_holder.find('.header-search-holder'),
        $header_search_btn = $header_search.find('.header-search-btn'),
        $header_search_type = $header_search.attr('data-type'),
        $header_search_content = $header_search.find('.header-search-content'),
        $header_search_input = $header_search.find('.header-search-text'),
        $responsive_menu_button = $header.find('.responsive-menu-button'),
        $responsive_nav = $header.find('.header-responsive-nav'),
        $header_placeholder = $header.find('.header-placeholder'),
        $header_toolbar = $header.find('.header-toolbar'),
        $header_toolbar_button = $header.find('.header-toolbar-button'),
        $secondary_menu_button = $header.find('.secondary-menu-button'),
        $side_dashboard_nav = $('.side-dashboard-nav-list'),
        $fullscreen_nav = $('.fullscreen-nav'),
        $fullscreen_nav_close_btn = $fullscreen_nav.find('.fullscreen-nav-close-btn'),
        is_header_style_1 = $header.hasClass('header-style-1'),
        is_header_style_2 = $header.hasClass('header-style-2'),
        is_header_style_3 = $header.hasClass('header-style-3'),
        is_header_style_4 = $header.hasClass('header-style-4'),
        is_side_dashboard = $('.side-dashboard').length,
        nav_timeout = '';


    /*---------------------------------------------------------------------------------*/
    /*  Sub Menu & Mega Menu hover
    /*---------------------------------------------------------------------------------*/

    $header_nav_list.children('.nav-item-has-submenu, .nav-item-has-megamenu').on( 'mouseenter', function() {
        var $this = $(this);
        nav_timeout = setTimeout( function() {
            $this.addClass('active');
        }, 150);
    });

    $header_nav_list.children('.nav-item-has-submenu, .nav-item-has-megamenu').on( 'mouseleave', function() {
        clearTimeout(nav_timeout);
        $(this).removeClass('active');
    });


    /*---------------------------------------------------------------------------------*/
    /*  Cart
    /*---------------------------------------------------------------------------------*/

    $header_cart.on( 'mouseenter', function() {
        $header_cart_content.stop().fadeIn(200);
        $(this).addClass('active');
    });
    $header_cart.on( 'mouseleave', function() {
        $header_cart_content.stop().fadeOut(200);
        $(this).removeClass('active');
    });


    /*---------------------------------------------------------------------------------*/
    /*  Search
    /*---------------------------------------------------------------------------------*/

    if ( $header_search_type == 'tooltip' ) {
        $header_search_btn.toggle(
            function(e) {
                e.preventDefault();
                $header_search_content.fadeIn(200);
                $(this).addClass('active');
                setTimeout( function () {
                    $header_search_input.focus();
                }, 100);
            },
            function(e) {
                e.preventDefault();
                $header_search_content.fadeOut(200);
                $(this).removeClass('active');
            }
        );
    } else if ( $header_search_type == 'fullscreen' ) {
        $header_search_btn.on( 'click', function(e) {
            e.preventDefault();
            $fullscreen_search.addClass('active');
            setTimeout( function () {
                $fullscreen_search_input.focus();
            }, 100);
        });
        $fullscreen_search_close_btn.on( 'click', function(e) {
            e.preventDefault();
            $fullscreen_search.removeClass('active');
        });
        
    }


    /*---------------------------------------------------------------------------------*/
    /*  Secondary Menu
    /*---------------------------------------------------------------------------------*/

    $secondary_menu_button.on('click', function(e) {

        e.preventDefault();
        e.stopPropagation();
        var menu_style = $(this).attr('data-menu-style');

        if ( menu_style == 'fullscreen') {

            $fullscreen_nav.addClass('active');
            $body.addClass('fullscreen-nav-active');

        } else {

            if ( $(this).hasClass('active') ) {
                $(this).removeClass('active');
                $body.removeClass('side-dashboard-active');
            } else {
                $(this).addClass('active');
                $body.addClass('side-dashboard-active');
            }

        } 

    });

    $side_dashboard_nav.find('.side-nav-item-has-submenu').children('.side-nav-icon').toggle(
        function(e) {
            $(this).siblings('.side-nav-submenu').slideDown('300');
        },
        function(e) {
            $(this).siblings('.side-nav-submenu').slideUp('300');
        }
    );

    if ( is_side_dashboard ) {
        $master.on('click', function() {
            $secondary_menu_button.removeClass('active');
            $responsive_menu_button.removeClass('active');
            $body.removeClass('side-dashboard-active');
        });
    }

    $fullscreen_nav_close_btn.on('click', function(e) {
        e.preventDefault();
        $fullscreen_nav.removeClass('active');
        $body.removeClass('fullscreen-nav-active');
    });
    

    /*---------------------------------------------------------------------------------*/
    /*  Responsive Menu
    /*---------------------------------------------------------------------------------*/

    // Responsive Navigation
    if ( !is_header_style_3 ) {

        $responsive_menu_button.toggle(
            function(e) {
                e.preventDefault();
                $(this).addClass('active');
                $body.addClass('responsive-nav-open');
                if ( $(window).width() < 768 && $header_toolbar_button.hasClass('active') ) {
                    $header_placeholder.css('height', '+=' + $header_toolbar.outerHeight() + 'px');
                } else if ( $(window).width() > 768 && $(window).width() < $header.attr('data-main-nav-threshold-width') ) {
                    $header_placeholder.css('height', '+=' + $header_toolbar.outerHeight() + 'px');
                }
                $responsive_nav.show();
            },
            function(e) {
                e.preventDefault();
                $(this).removeClass('active');
                $body.removeClass('responsive-nav-open');
                $header_placeholder.css('height', '');
                $responsive_nav.hide();
            }
        );

    } else {

        $responsive_menu_button.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var menu_style = $secondary_menu_button.attr('data-menu-style');
            if ( menu_style == 'fullscreen') {
                $fullscreen_nav.addClass('active');
                $body.addClass('fullscreen-nav-active');
            } else {
                if ( $(this).hasClass('active') ) {
                    $(this).removeClass('active');
                    $body.removeClass('side-dashboard-active');
                } else {
                    $(this).addClass('active');
                    $body.addClass('side-dashboard-active');
                }   
            }     
        });

    }


    // Responsive Submmenu
    $responsive_nav.find('.res-nav-item-has-submenu').children('.res-nav-icon').toggle(
        function(e) {
            $(this).siblings('.res-nav-submenu').slideDown('300');
        },
        function(e) {
            $(this).siblings('.res-nav-submenu').slideUp('300');
        }
    );


    // Toolbar
    function set_toolbar_height() {
        $header_toolbar.css('height', '');
        $header_toolbar.css('height', function () {
            return $(this).outerHeight();
        });
    }
    var _set_toolbar_height = _.throttle(set_toolbar_height, 100);
    $(window).resize(_set_toolbar_height);
    _set_toolbar_height()
    
    $window.on('load', function () {
        _set_toolbar_height(); 
    });

    $header_toolbar_button.toggle(
        function(e) {
            $(this).addClass('active');
            if ( $responsive_menu_button .hasClass('active') ) {
                $header_placeholder.css('height', '+=' + $header_toolbar.outerHeight() + 'px');
            }
            $header_toolbar.show();
        },
        function(e) {
           $(this).removeClass('active');
           $header_placeholder.css('height', '');
           $header_toolbar.hide();
        }
    );


    // Set Max Height for Responsive Nav
    function set_responsive_nav_maxheight() {
        $responsive_nav.css('max-height', function() {
            return $(window).height() - $header_placeholder.height();
        });
    }
    var _set_responsive_nav_maxheight = _.throttle(set_responsive_nav_maxheight, 100);
    $(window).resize(_set_responsive_nav_maxheight);
    _set_responsive_nav_maxheight()
    


    /*---------------------------------------------------------------------------------*/
    /*  Sticky Menu
    /*---------------------------------------------------------------------------------*/

    var sticky_offset = $header.attr('data-sticky-offset');
    var cached_scroll_pos = [0,1];
    var scroll_down_timeout ='';
    var scroll_up_timeout ='';

    function handle_sticky_header() {

        if (  $header.hasClass('header-sticky-slidedown') ) {
            var window_scroll = $(window).scrollTop();
            if ( window_scroll > sticky_offset ) {
                if ( !$header.hasClass('header-sticky-active') ) {
                    TweenMax.to( $header_holder, 0, { css: { top: -30 }, ease: Expo.easeOut, delay: 0 });
                    TweenMax.to( $header_holder, 0.3, { css: { top: 0 }, ease: Expo.easeOut, delay: 0 });
                }
                $header.addClass('header-sticky-active');
            } else {
                $header.removeClass('header-sticky-active');
            }
        }

        if ( $header.hasClass('header-sticky-fixed') && !$header.hasClass('header-style-2') ) {
            var window_scroll = $(window).scrollTop();
            if ( window_scroll > sticky_offset ) {
                $header.addClass('header-sticky-active');   
            } else {
                $header.removeClass('header-sticky-active');
            }
        }

        if ( $header.hasClass('header-sticky-lazy') && !$header.hasClass('header-style-2') ) {
            var current_scroll_pos = $(window).scrollTop();
            cached_scroll_pos[0] = cached_scroll_pos[1];
            cached_scroll_pos[1] = current_scroll_pos;
            if ( cached_scroll_pos[1]  > cached_scroll_pos[0] ) {  // If scroll is going down

                 if ( scroll_down_timeout == '' ) {  // Only runs scroll down function one time on multiple downside scrolls
                    clearTimeout(scroll_up_timeout);  // Cancel scroll up function (pervents unusual behavior on multiple downside/upside scroll at the same time)
                    scroll_up_timeout = '';
                    scroll_down_timeout = setTimeout(function(){
                        if ( $header.hasClass('header-sticky-active') || !$header.hasClass('header-sticky-onscroll') ) {  // If header was being shown
                            TweenMax.to( $header_holder, 0.6, { css: { top: '-125' }, ease: Expo.easeOut, delay: 0, onComplete: function(){
                                $header.removeClass('header-sticky-active');
                            }});
                        }
                    }, 600);
                }

            } else {

                if ( scroll_up_timeout == '' ) {  // Only runs scroll up function one time on multiple upside scrolls
                    clearTimeout(scroll_down_timeout);  // Cancel scroll down function (pervents unusual behavior on multiple downside/upside scroll at the same time)
                    scroll_down_timeout = '';
                    scroll_up_timeout = setTimeout(function(){
                        if ( !$header.hasClass('header-sticky-active') ) {  // If header was not being shown
                            TweenMax.to( $header_holder, 0, { css: { top: -30 }, ease: Expo.easeOut, delay: 0 });
                            TweenMax.to( $header_holder, 0.3, { css: { top: 0 }, ease: Expo.easeOut, delay: 0 });
                            $header.addClass('header-sticky-active');
                        }
                    }, 600);
                }
                
            }
            if ( current_scroll_pos == 0 ) {
                clearTimeout(scroll_down_timeout);  // Cancel scroll down function
                clearTimeout(scroll_up_timeout);  // Cancel scroll up function
                setTimeout( function() {
                    TweenMax.to( $header_holder, 0.6, { css: { top: 0 }, ease: Expo.easeOut, delay: 0 });
                    $header.removeClass('header-sticky-active');
                }, 600);
                
            } 

        }

    }
    var _handle_sticky_header = _.throttle(handle_sticky_header, 100);
    if ( $header.hasClass('header-sticky') ) {
        $(window).scroll(_handle_sticky_header);
    }
            
});


/* Header ====================================================================================================================== */
