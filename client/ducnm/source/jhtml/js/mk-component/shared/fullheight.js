var val = MK.val;

MK.component.FullHeight = function( el ) {
    var $window = $( window ),
        $this = $( el ),
        container = document.getElementById( 'wrapper' ),
        winH = null,
        height = null,
        update_count = 0,
        testing = getUrlParameter('testing'),
        offset = null;
    var update = function() {

        if(update_count == 0) {
            winH = $window.height();
            offset = $this.offset().top;
            height = winH - val.offsetHeaderHeight( offset );
            // set
            $this.css( 'min-height', height );
            if(testing !== undefined )
            update_count++;
        }

    };

    // TODO remove scroll listener by dynamic offset reader
    var init = function() {
        update();
        $window.on( 'resize', update );
        $window.on( 'scroll', update );
        window.addResizeListener( container, update );
    };

    return {
        init : init
    };
};



var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
