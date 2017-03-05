// (function() {
//     'use strict';

//     // Make sure the video behaves like background-size: cover
//     window.videoCover = function( holderSelector, videoSelector ) {
//         var videos = document.querySelectorAll( videoSelector ),
//             holder = document.querySelectorAll( holderSelector )[0];

//         [].forEach.call(videos, function(video) {

//             var videoAspectRatio;

//             resizeBackground(); 

//             video.onloadedmetadata = function() {
//                 // get images aspect ratio
//                 videoAspectRatio = this.height / this.width;
//                 // attach resize event and fire it once
//                 window.onresize = resizeBackground;
//                 resizeBackground();
//             };

//             function resizeBackground() {
//                 // get window size and aspect ratio
//                 var holderWidth = holder.innerWidth,
//                     holderHeight = holder.innerHeight,
//                     holderAspectRatio = holderHeight / holderWidth;

//                 //compare holder ratio to image ratio so you know which way the image should fill
//                 if ( holderAspectRatio < videoAspectRatio ) {
//                     // we are fill width
//                     video.style.width = holderWidth + "px";
//                     // and applying the correct aspect to the height now
//                     video.style.height = (holderWidth * videoAspectRatio) + "px"; // this can be margin if your element is not positioned relatively, absolutely or fixed
//                     // make sure image is always centered
//                     video.style.left = "0px";
//                     video.style.top = (holderHeight - (holderWidth * videoAspectRatio)) / 2 + "px";
//                 } else { // same thing as above but filling height instead
//                     video.style.height = holderHeight + "px";
//                     video.style.width = (holderHeight / videoAspectRatio) + "px";
//                     video.style.left = (holderWidth - (holderHeight / videoAspectRatio)) / 2 + "px";
//                     video.style.top = "0px";
//                 }
//             }

//         });
//     };

// }());
// 
// 
// 
// TODO it is temp only. make it as a plugin

(function($) {
    'use strict';

    var $videoHolder = $('.mk-center-video'),
        $wrapper = $videoHolder.parent(),
        baseAspectRatio = 56.25;

    var wrapperHeight,
        wrapperWidth,
        wrapperAspectRatio;

    function calc() {
        wrapperHeight = $wrapper.height();
        wrapperWidth = $wrapper.width();
        wrapperAspectRatio = (wrapperHeight / wrapperWidth) * 100;
    } 

    function apply() {        
        var width = (wrapperAspectRatio / baseAspectRatio) * 100,
            widthOverflow = (width - 100);

        $videoHolder.css({
            'padding-top': wrapperAspectRatio + '%',
            'width': width + '%',
            'left': -(widthOverflow / 2) + '%'
        }); 
    }

    function reset() {
        $videoHolder.css({
            'padding-top': baseAspectRatio + '%',
            'width': 100 + '%',
            'left': 0
        });
    }

    function setCover() {
        reset();
        calc();
        if(wrapperAspectRatio > baseAspectRatio) apply();
    }

    $(window).on('load', setCover);
    $(window).on('resize', setCover);


}(jQuery));