MK.component.EdgeSlider = function( el ) {
    var self = this,
        $this = $( el ), 
        $window = $(window),
        $wrapper = $this.parent(),
        config = $this.data( 'edgeslider-config' );

    var callbacks = { 

        onInitialize : function( slides ) {
            self.$slides = $( slides );
            
            self.slideContents = $.map( self.$slides, function( slide ) {
                var $slide = $( slide ),
                    title = $slide.find('.edge-slide-content .edge-title').first().text(),
                    skin = $slide.attr("data-header-skin"),
                    image = $slide.find('.section-image').css('background-image') || 
                            $slide.find('.video-section-touch').css('background-image'),
                    bgColor = $slide.find('.section-image').css('background-color');

                return {
                    skin: skin,
                    title: title,
                    image: image,
                    bgColor: bgColor
                };
            });

            setNavigationContent( 1, self.$slides.length - 1 );
            setSkin( 0 );

            setTimeout( function() {
                $( '.edge-slider-loading' ).fadeOut( '100' );
            }, 1000 );
        },

        onAfterSlide : function( id ) {
            var currentId = id;

            var len = self.$slides.length,
                nextId = ( currentId + 1 === len ) ? 0 : currentId + 1,
                prevId = ( currentId - 1 === -1 ) ? len - 1 : currentId - 1; 

            setNavigationContent( nextId, prevId );
            setSkin( id );
        }
    };


    var $nav = $( config.nav ),
        $prev = $nav.find( '.edge-nav-prev' ),
        $prevTitle = $prev.find( '.edge-nav-item-caption' ),
        $prevBg = $prev.find('.edge-nav-bg'),
        $next = $nav.find( '.edge-nav-next' ),
        $nextTitle = $next.find( '.edge-nav-item-caption' ),
        $nextBg = $next.find('.edge-nav-bg');

    var setNavigationContent = function( nextId, prevId ) {

        if(self.slideContents[ prevId ]) {
            $prevTitle.text( self.slideContents[ prevId ].title );
            $prevBg.css( 'background', 
                self.slideContents[ prevId ].image !== 'none' ? 
                    self.slideContents[ prevId ].image :
                    self.slideContents[ prevId ].bgColor );
        }

        if(self.slideContents[ nextId ]) {
            $nextTitle.text( self.slideContents[ nextId ].title ); 
            $nextBg.css( 'background', 
                self.slideContents[ nextId ].image !== 'none' ? 
                    self.slideContents[ nextId ].image :
                    self.slideContents[ nextId ].bgColor );
        }
    };


    var $navBtns = $nav.find( 'a' ),  
        $pagination = $( '.swiper-pagination' ),
        $skipBtn = $( '.edge-skip-slider' ),
        currentSkin = null;

    var setSkin = function( id ) {  
        currentSkin = self.slideContents[ id ].skin;

        $navBtns.attr('data-skin', currentSkin);
        $pagination.attr('data-skin', currentSkin);
        $skipBtn.attr('data-skin', currentSkin); 

        if( self.config.firstEl ) {
            MK.utils.eventManager.publish( 'firstElSkinChange', currentSkin );
        }
    };


    var currentPoint;
    var $opacityLayer = $this.find('.edge-slide-content');
    var winH = null;
    var opacity = null;
    var offset = null;

    var onResize = function onResize() {
        var height = $wrapper.height();
        $this.height( height );

        var width = $wrapper.width();
        $this.width( width );

        winH = $window.height();
        offset = $this.offset().top;

        if(MK.utils.isResponsiveMenuState()) {
            $this.css({
                '-webkit-transform': 0,
                '-moz-transform': 0,
                '-ms-transform': 0,
                '-o-transform': 0,
                'transform': 0,
                'position': 'absolute'
            });
            $opacityLayer.css({
                'opacity': 1
            });
        } else {
            onScroll();
        }
    };

    var onScroll = function onScroll() {
        currentPoint = - MK.val.scroll();

        if( offset + currentPoint <= 0 ) {
            opacity = 1 + ((offset + currentPoint) / winH) * 2;
            opacity = Math.min(opacity, 1);
            opacity = Math.max(opacity, 0);

            $opacityLayer.css({
                opacity: opacity
            });
        }

        $this.css({
            '-webkit-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-moz-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-ms-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-o-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            'transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            'position': 'fixed'
        });  
    };

    onResize();
    $window.on('load resize', onResize);
    window.addResizeListener( $wrapper.get(0), onResize );

    onScroll();
    $window.on('scroll', function() {
        if(MK.utils.isResponsiveMenuState()) return;
        window.requestAnimationFrame(onScroll);
    });

    this.el = el;
    this.config = $.extend( config, callbacks );
    this.slideContents = null; // cache slide contents
};

MK.component.EdgeSlider.prototype = {
    init : function() {
        // Inherit from Slider. add prototypes if needed
        var slider = new MK.ui.Slider( this.el, this.config );
        slider.init();
    }
};