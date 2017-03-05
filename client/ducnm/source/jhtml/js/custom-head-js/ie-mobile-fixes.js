
/*---------------------------------------------------------------------------------*/
/*  Fix for the Responsive issue in IE10 on Windows Phone 8
/*---------------------------------------------------------------------------------*/

(function() {
    if ("-ms-user-select" in document.documentElement.style && navigator.userAgent.match(/IEMobile/)) {
        var msViewportStyle = document.createElement("style");
        msViewportStyle.appendChild(
            document.createTextNode("@-ms-viewport{width:auto!important}")
        );
        document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
    }
})();	