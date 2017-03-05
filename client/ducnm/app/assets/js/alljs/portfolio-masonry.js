jQuery(window).on('load', function () {

'use strict';

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

    $('.js-portfolio-masonry').each(function () {

        var $this = $(this);
        var $masonryItem = $this.find('.portfolio-item');
        var wall = null;
        var colCount = 0;
        var colDefine = 0;
        var colWidth = 0;

        var masonry = function () {
            colDefine = $this.data('colum') || 8;
            if (window.matchMedia('(max-width:600px)').matches) {
                colCount = 2;
                
            } else if (window.matchMedia('(max-width:850px)').matches) {
                colCount = 4;
                
            } else {
                colCount = colDefine;
            }

            colWidth = $this.width() / colCount;
            wall = new Freewall($this);
            wall.reset({
                selector: '> .portfolio-item',
                gutterX: 0,
                gutterY: 0,
                cellW: colWidth,
                cellH: colWidth
            });
            wall.fillHoles();
            wall.fitWidth();
        }
        var destroyContainer = function destroyContainer() {
            $this.removeAttr('style')
                    .removeData('wall-height')
                    .removeData('wall-width')
                    .removeData('min-width')
                    .removeData('total-col')
                    .removeData('total-row')
                    .removeAttr('data-wall-height')
                    .removeAttr('data-wall-width')
                    .removeAttr('data-min-width')
                    .removeAttr('data-total-col')
                    .removeAttr('data-total-row');
        };
        var destroyItem = function destroyItem() {
            var $item = $(this);
            $item.removeAttr('style')
                    .removeData('delay')
                    .removeData('height')
                    .removeData('width')
                    .removeData('state')
                    .removeAttr('data-delay')
                    .removeAttr('data-height')
                    .removeAttr('data-width')
                    .removeAttr('data-state');
        };
        var destroyAll = function destroyAll() {
            if (!wall)
                return;
            wall.destroy(); // API destroy
            destroyContainer();
            $masonryItem.each(destroyItem); // run our deeper destroy
        };
        masonry();
        window.onresize =  function (){
            destroyAll();
            masonry();
        }
    });

    function masonry() {
        $('.js-portfolio-masonry').each(function () {
            $this = $(this);
            $item = $this.find('.portfolio-item');
            console.log($item);
            var colCount;
            var colDefine = $this.data('colum') || 8;
            if (window.matchMedia('(max-width:600px)').matches) {
                colCount = 2;
                console.log(2);
            } else if (window.matchMedia('(max-width:850px)').matches) {
                colCount = 4;
                console.log(4);
            } else {
                colCount = colDefine;
            }

            var colWidth = $this.width() / colCount;
            var wall = new Freewall($this);
            wall.reset({
                selector: '> .portfolio-item',
                gutterX: 0,
                gutterY: 0,
                cellW: colWidth,
                cellH: colWidth
            });
            wall.fillHoles();
            wall.fitWidth();
            window.onresize = function () {
                wall.destroyAll();
                masonry();
            }

            var destroyContainer = function destroyContainer() {
                $this.removeAttr('style')
                        .removeData('wall-height')
                        .removeData('wall-width')
                        .removeData('min-width')
                        .removeData('total-col')
                        .removeData('total-row')
                        .removeAttr('data-wall-height')
                        .removeAttr('data-wall-width')
                        .removeAttr('data-min-width')
                        .removeAttr('data-total-col')
                        .removeAttr('data-total-row');
            };
            var destroyItem = function destroyItem() {
                var $item = $(this);
                $item.removeAttr('style')
                        .removeData('delay')
                        .removeData('height')
                        .removeData('width')
                        .removeData('state')
                        .removeAttr('data-delay')
                        .removeAttr('data-height')
                        .removeAttr('data-width')
                        .removeAttr('data-state');
            };
            var destroyAll = function destroyAll() {
                if (!wall)
                    return;
                wall.destroy(); // API destroy
                destroyContainer();
                $masonryItems.each(destroyItem); // run our deeper destroy
            };
        });
    }
});