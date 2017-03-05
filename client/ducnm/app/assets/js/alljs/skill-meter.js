//@author : Hossein
$('.skillbar__body').each(function () {
    var me = $(this);
    var barHeight = me.height();//bar height

    //if not enough space for percent number
    if (barHeight > 20) {
        me.find('.skillbar__percent').css("line-height", me.height() + "px");
    } else {
        me.find('.skillbar__percent').addClass('skillbar__percent--small');
    }
    me.find('.skillbar__bar').animate({
        width: $(this).attr('data-percent')
    }, 2000);
});