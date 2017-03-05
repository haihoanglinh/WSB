(function ($) {
    'use strict';

    MK.component.Masonry = function (el) {
        var $container = $(el);
        var $window = $(window);
        var config = $container.data('masonry-config');
        var $masonryItems = $container.find(config.item);
        var cols = config.cols || 8;
        var $filterItems = null; // assign only when apply filter
        var wall = null;

        var init = function init() {
//        	MK.core.loadDependencies([ MK.core.path.plugins + 'freewall.js' ], onDepLoad);
            onDepLoad();
        };

        var onDepLoad = function onDepLoad() {
            
            masonry();

            // Events
            $window.on('resize', onResize);
            MK.utils.eventManager.subscribe('ajaxLoaded', onPostAddition);
        };

        var masonry = function masonry() {
            var newCols;
            if (window.matchMedia('(max-width:600px)').matches)
                newCols = 2;
            else if (window.matchMedia('(max-width:850px)').matches)
                newCols = 4;
            else
                newCols = cols;

            var colW = $container.width() / newCols;

            wall = new Freewall(config.container);

            // We need to pass settings to a plugin via reset method. Strange but works fine.
            wall.reset({
                selector: config.item + ':not(.is-hidden)',
                gutterX: 0, // set default gutter to 0 and again - apply margins to item holders in css
                gutterY: 0,
                cellW: colW,
                cellH: colW
            });

            wall.fillHoles();
            wall.fitWidth();

            $masonryItems.each(function () {
                $(this).data('loaded', true);
            });
        };


        // Clear attributes after the plugin. It's API method dosn't handle it properly
        var destroyContainer = function destroyContainer() {
            $container.removeAttr('style')
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

        var onResize = function onResize() {
            requestAnimationFrame(resize);
        };

        var refresh = function refresh() {
            if (!wall)
                return;
            setTimeout(wall.fitWidth.bind(wall), 5);
        };

        var resize = function resize() {
            destroyAll();
            masonry();
        };

        var onPostAddition = function onPostAddition() {
            $masonryItems = $container.find(config.item);

            $masonryItems.each(function () {
                var $item = $(this),
                        isLoaded = $item.data('loaded');

                if (!isLoaded)
                    $item.css('visibility', 'hidden');
            });


            $container.imagesLoaded().then(function () {
                destroyAll();
                masonry();
            });
        };

        return {
            init: init
        };
    };

}(jQuery));