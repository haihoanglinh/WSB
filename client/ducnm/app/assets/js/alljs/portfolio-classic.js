jQuery(window).on('load', function () {

    $(".js-portfolio-fancybox").fancybox({
        tpl: {
            closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"><i class="mk-moon-close-2"></i></a>',
            next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span><i class="mk-jupiter-icon-arrow-right"></i></span></a>',
            prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span><i class="mk-jupiter-icon-arrow-left"></i></span></a>'
        },
        overlayShow: true,
        prevEffect: 'none',
        nextEffect: 'none',
        helpers: {
            title: {
                type: 'inside'
            }
        }
    });

});