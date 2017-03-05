//author:Hossein Hashemi
function animatedColumns() {

    var me = $(this);
    var col = $('.animatedcol__item');

    var colFullContent = "animatedcol--full";
    var colSimple = "animatedcol--simple";

    $('.animatedcol__item').each(function () {
        var me = $(this);
        var colType = me.parent();
        var itemHeight = me.height();

        if (colType.hasClass(colFullContent)) {

            var iconHeight = me.find('.animatedcol__top').height();
            var iconTop = (itemHeight / 2) - (iconHeight / 2) + "px";
            me.find('.animatedcol__top').css("padding-top", iconTop);
        }
    });

    //col type 1 : default type with title , desc and button
    col.hover(function () {

        //get parent for recognize column type
        var colType = $(this).parent();

        //handlerIn function:

        if (colType.hasClass(colFullContent)) {

            var me = $(this);
            //for theme Default
            TweenLite.to(me.find(".animatedcol__top"), 0.5, {
                top: '-20%',
                ease: Back.easeOut
            });

            TweenLite.to(me.find(".animatedcol__desc"), 0.5, {
                top: '50%',
                ease: Expo.easeOut
            }, 0.4);

            TweenLite.to(me.find(".animatedcol__btn"), 0.3, {
                top: '80%',
                ease: Expo.easeOut8
            }, 0.6);
        }

        if (colType.hasClass(colSimple)) {

            var me = $(this);

            // for dark and colored 
            TweenLite.to(me.find(".animatedcol__top"), 0.5, {
                top: '100%',
                ease: Back.easeOut
            });

            TweenLite.to(me.find(".animatedcol__desc"), 0.7, {
                top: '50%',
                marginTop: "-25px",
                ease: Back.easeOut
            }, 0.4);
        }
    }, function () {

        var colType = $(this).parent();
        //handlerOut function:
        if (colType.hasClass(colFullContent)) {

            var me = $(this);

            TweenLite.to(me.find(".animatedcol__top"), 0.3, {
                top: '0%',
                ease: Back.easeOut
            });

            TweenLite.to(me.find(".animatedcol__desc"), 0.2, {
                top: '100%',
                ease: Back.easeOut
            }, 0.2);

            TweenLite.to(me.find(".animatedcol__btn"), 0.2, {
                top: '100%',
                ease: Back.easeOut
            }, 0.4);
        }

        if (colType.hasClass(colSimple)) {

            var me = $(this);

            TweenLite.to(me.find(".animatedcol__top"), 0.4, {
                top: '50%',
                ease: Expo.easeOut
            });

            TweenLite.to(me.find(".animatedcol__desc"), 0.5, {
                top: '-50%',
                ease: Back.easeOut
            }, 0.3);

        }
    }
    );
}
//document.ready();

$(window).load(function () {
    if ($.browser.safari) {
        setTimeout(function () {
            animatedColumns();
        }, 100);
    } else {
        animatedColumns();
    }
});


