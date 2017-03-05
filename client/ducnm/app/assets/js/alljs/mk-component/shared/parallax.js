
var val = MK.val,
    utils = MK.utils;

mk_smooth_scroll = 'true';  // *Edited - Added*

MK.component.Parallax = function( el ) {
    var self = this,
        $this = $( el ),
        obj = $this[0],
        $window = $( window ),
        container = document.getElementById( 'wrapper' ),
        config = $this.data( 'parallax-config' ),
        $holder = $( config.holder ),
        headerHeight = null,
        offset = null,
        elHeight = null,
        ticking = false,
        isMobile = null;


    var clientRect = null;

    var update = function() {
        // Clear styles to check for natural styles
        // then apply position and size
        obj.style.transform = null;
        obj.style.top = null;
        obj.style.bottom = null;

        isMobile = MK.utils.isMobile();

        if( isMobile ) {
            $this.css( 'height', '' );
            return;
        }

        clientRect = $this[ 0 ].getBoundingClientRect();
        offset = clientRect.top;
        elHeight = clientRect.height;
        headerHeight = val.offsetHeaderHeight( offset );
        offset = offset - headerHeight + val.scroll(); 

        setPosition(); 
        setSize( ); 
    };


    var h = 0,
        winH = 0,
        proportion = 0,
        height = 0;

    // Position and background attachement should me moved to CSS but we repair it high specificity here as styles are not reliable currently
    var setSize = function() {
        $this.css( 'height', '' );
        winH = $window.height() - headerHeight;
        h = obj.getBoundingClientRect().height; 

        if( config.speed <= 1 && config.speed > 0 ) {
            if( offset === 0 ) {
                $this.css({
                    backgroundAttachment: 'scroll'
                });
            } else {
                $this.css({
                    height : h + ( (winH - h) * config.speed ),
                    backgroundAttachment: 'scroll'
                }); 
            }

        } else if ( config.speed > 1 && h <= winH ) {
            $this.css({
                // good for full heights - 2 because it's viewable by 2 screen heights
                height: ( winH  +  ( ( winH * config.speed ) - winH ) * 2 ),  
                top: -( ( winH * config.speed ) - winH ),
                backgroundAttachment: 'scroll'
            }); 

        } else if ( config.speed > 1 && h > winH ) {
            proportion = h / winH;
            height = ( winH  +  ( ( winH * config.speed ) - winH ) * (1 + proportion) );

            $this.css({
                height: height,
                top: -( height - (winH * config.speed) ),
                backgroundAttachment: 'scroll'
            }); 

        } else if ( config.speed < 0 && h >= winH ) {
            height = h * (1  - config.speed);
            $this.css({
                height: height + (height - h),
                top: h - height,
                backgroundAttachment: 'scroll'
            });   

        } else if ( config.speed < 0 && h < winH ) {
            // candidate to change
            var display = (winH + h) / winH;
            height = h * -config.speed * display;
            $this.css({
                height: h + (height * 2),
                top: -height,
                backgroundAttachment: 'scroll'
            });                 
        }
    };


    var currentPoint = null,
        progressVal = null,
        startPoint = null,
        endPoint = null,
        $opacityLayer = config.opacity ? $this.find( config.opacity ) : null,
        scrollY = null;

    var setPosition = function() {
        startPoint = offset - winH;
        endPoint = offset + elHeight + winH - headerHeight;
        scrollY = val.scroll();

        if( scrollY < startPoint || scrollY > endPoint ) { 
            ticking = false;
            return; 
        }

        currentPoint = (( -offset + scrollY ) * config.speed);

        $this.css({
            '-webkit-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-moz-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-ms-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-o-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            'transform': 'translateY(' + currentPoint + 'px) translateZ(0)'
        });  

        ticking = false;
    };


    var requestTick = function() {
        if( !ticking && !isMobile ) {
            window.requestAnimationFrame( setPosition );
            ticking = true;
        }
    };


    var init = function() { 
        // Disable scroll effects when smooth scroll is disabled
        if( mk_smooth_scroll === 'false' ) { return; }

        update();
        setTimeout(update, 100);
        $window.on( 'load', update );
        $window.on( 'resize', update );
        window.addResizeListener( container, update );
        
        $window.on( 'scroll', requestTick );
    };
    

    return {
        init : init
    };
};