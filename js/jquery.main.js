// page init
jQuery(function () {
    initOpenClose();
    initPopups();
    initMobileNav();
    initSameHeight();

});

// open-close init
function initOpenClose() {
    jQuery('div.open-close').openClose({
        activeClass: 'active',
        opener: '.opener',
        slider: '.slide',
        animSpeed: 400,
        effect: 'slide'
    });
}

// popups init
function initPopups() {
    jQuery('.popup-container').contentPopup({
        mode: 'click',
        btnOpen: '.opener-popup',
        btnClose: '.close-popup'
    });
    jQuery('.popup-hover-container').contentPopup({
        mode: 'hover',
        btnOpen: '.opener-popup',
        btnClose: '.close-popup'
    });
}

// mobile menu init
function initMobileNav() {
    jQuery('body').mobileNav({
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-opener'
    });
}

// align blocks height
function initSameHeight() {
    jQuery('.same-height-xy-view').sameHeight({
        elements: '.same-height',
        useMinHeight: true,
        flexible: true
    });
}

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

/*
 * jQuery Open/Close plugin
 */
;
(function ($) {
    function OpenClose(options) {
        this.options = $.extend({
            addClassBeforeAnimation: true,
            hideOnClickOutside: false,
            activeClass: 'active',
            opener: '.opener',
            slider: '.slide',
            animSpeed: 400,
            effect: 'fade',
            event: 'click'
        }, options);
        this.init();
    }

    OpenClose.prototype = {
        init: function () {
            if (this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.makeCallback('onInit', this);
            }
        },
        findElements: function () {
            this.holder = $(this.options.holder);
            this.opener = this.holder.find(this.options.opener);
            this.slider = this.holder.find(this.options.slider);
        },
        attachEvents: function () {
            // add handler
            var self = this;
            this.eventHandler = function (e) {
                e.preventDefault();
                if (self.slider.hasClass(slideHiddenClass)) {
                    self.showSlide();
                } else {
                    self.hideSlide();
                }
            };
            self.opener.bind(self.options.event, this.eventHandler);

            // hover mode handler
            if (self.options.event === 'over') {
                self.opener.bind('mouseenter', function () {
                    if (!self.holder.hasClass(self.options.activeClass)) {
                        self.showSlide();
                    }
                });
                self.holder.bind('mouseleave', function () {
                    self.hideSlide();
                });
            }

            // outside click handler
            self.outsideClickHandler = function (e) {
                if (self.options.hideOnClickOutside) {
                    var target = $(e.target);
                    if (!target.is(self.holder) && !target.closest(self.holder).length) {
                        self.hideSlide();
                    }
                }
            };

            // set initial styles
            if (this.holder.hasClass(this.options.activeClass)) {
                $(document).bind('click touchstart', self.outsideClickHandler);
            } else {
                this.slider.addClass(slideHiddenClass);
            }
        },
        showSlide: function () {
            var self = this;
            if (self.options.addClassBeforeAnimation) {
                self.holder.addClass(self.options.activeClass);
            }
            self.slider.removeClass(slideHiddenClass);
            $(document).bind('click touchstart', self.outsideClickHandler);

            self.makeCallback('animStart', true);
            toggleEffects[self.options.effect].show({
                box: self.slider,
                speed: self.options.animSpeed,
                complete: function () {
                    if (!self.options.addClassBeforeAnimation) {
                        self.holder.addClass(self.options.activeClass);
                    }
                    self.makeCallback('animEnd', true);
                }
            });
        },
        hideSlide: function () {
            var self = this;
            if (self.options.addClassBeforeAnimation) {
                self.holder.removeClass(self.options.activeClass);
            }
            $(document).unbind('click touchstart', self.outsideClickHandler);

            self.makeCallback('animStart', false);
            toggleEffects[self.options.effect].hide({
                box: self.slider,
                speed: self.options.animSpeed,
                complete: function () {
                    if (!self.options.addClassBeforeAnimation) {
                        self.holder.removeClass(self.options.activeClass);
                    }
                    self.slider.addClass(slideHiddenClass);
                    self.makeCallback('animEnd', false);
                }
            });
        },
        destroy: function () {
            this.slider.removeClass(slideHiddenClass).css({display: ''});
            this.opener.unbind(this.options.event, this.eventHandler);
            this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
            $(document).unbind('click touchstart', this.outsideClickHandler);
        },
        makeCallback: function (name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        }
    };

    // add stylesheet for slide on DOMReady
    var slideHiddenClass = 'js-slide-hidden';
    (function () {
        var tabStyleSheet = $('<style type="text/css">')[0];
        var tabStyleRule = '.' + slideHiddenClass;
        tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
        if (tabStyleSheet.styleSheet) {
            tabStyleSheet.styleSheet.cssText = tabStyleRule;
        } else {
            tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
        }
        $('head').append(tabStyleSheet);
    }());

    // animation effects
    var toggleEffects = {
        slide: {
            show: function (o) {
                o.box.stop(true).hide().slideDown(o.speed, o.complete);
            },
            hide: function (o) {
                o.box.stop(true).slideUp(o.speed, o.complete);
            }
        },
        fade: {
            show: function (o) {
                o.box.stop(true).hide().fadeIn(o.speed, o.complete);
            },
            hide: function (o) {
                o.box.stop(true).fadeOut(o.speed, o.complete);
            }
        },
        none: {
            show: function (o) {
                o.box.hide().show(0, o.complete);
            },
            hide: function (o) {
                o.box.hide(0, o.complete);
            }
        }
    };

    // jQuery plugin interface
    $.fn.openClose = function (opt) {
        return this.each(function () {
            jQuery(this).data('OpenClose', new OpenClose($.extend(opt, {holder: this})));
        });
    };
}(jQuery));

/*
 * Popups plugin
 */
;
(function ($) {
    function ContentPopup(opt) {
        this.options = $.extend({
            holder: null,
            popup: '.popup',
            btnOpen: '.open',
            btnClose: '.close',
            openClass: 'popup-active',
            clickEvent: 'click',
            mode: 'click',
            hideOnClickLink: true,
            hideOnClickOutside: true,
            delay: 50
        }, opt);
        if (this.options.holder) {
            this.holder = $(this.options.holder);
            this.init();
        }
    }

    ContentPopup.prototype = {
        init: function () {
            this.findElements();
            this.attachEvents();
        },
        findElements: function () {
            this.popup = this.holder.find(this.options.popup);
            this.btnOpen = this.holder.find(this.options.btnOpen);
            this.btnClose = this.holder.find(this.options.btnClose);
        },
        attachEvents: function () {
            // handle popup openers
            var self = this;
            this.clickMode = isTouchDevice || (self.options.mode === self.options.clickEvent);

            if (this.clickMode) {
                // handle click mode
                this.btnOpen.bind(self.options.clickEvent, function (e) {
                    if (self.holder.hasClass(self.options.openClass)) {
                        if (self.options.hideOnClickLink) {
                            self.hidePopup();
                        }
                    } else {
                        self.showPopup();
                    }
                    e.preventDefault();
                });

                // prepare outside click handler
                this.outsideClickHandler = this.bind(this.outsideClickHandler, this);
            } else {
                // handle hover mode
                var timer, delayedFunc = function (func) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        func.call(self);
                    }, self.options.delay);
                };
                this.btnOpen.bind('mouseover', function () {
                    delayedFunc(self.showPopup);
                }).bind('mouseout', function () {
                    delayedFunc(self.hidePopup);
                });
                this.popup.bind('mouseover', function () {
                    delayedFunc(self.showPopup);
                }).bind('mouseout', function () {
                    delayedFunc(self.hidePopup);
                });
            }

            // handle close buttons
            this.btnClose.bind(self.options.clickEvent, function (e) {
                self.hidePopup();
                e.preventDefault();
            });
        },
        outsideClickHandler: function (e) {
            // hide popup if clicked outside
            var targetNode = $((e.changedTouches ? e.changedTouches[0] : e).target);
            if (!targetNode.closest(this.popup).length && !targetNode.closest(this.btnOpen).length) {
                this.hidePopup();
            }
        },
        showPopup: function () {
            // reveal popup
            this.holder.addClass(this.options.openClass);
            this.popup.css({display: 'block'});

            // outside click handler
            if (this.clickMode && this.options.hideOnClickOutside && !this.outsideHandlerActive) {
                this.outsideHandlerActive = true;
                $(document).bind('click touchstart', this.outsideClickHandler);
            }
        },
        hidePopup: function () {
            // hide popup
            this.holder.removeClass(this.options.openClass);
            this.popup.css({display: 'none'});

            // outside click handler
            if (this.clickMode && this.options.hideOnClickOutside && this.outsideHandlerActive) {
                this.outsideHandlerActive = false;
                $(document).unbind('click touchstart', this.outsideClickHandler);
            }
        },
        bind: function (f, scope, forceArgs) {
            return function () {
                return f.apply(scope, forceArgs ? [forceArgs] : arguments);
            };
        }
    };

    // detect touch devices
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    // jQuery plugin interface
    $.fn.contentPopup = function (opt) {
        return this.each(function () {
            new ContentPopup($.extend(opt, {holder: this}));
        });
    };
}(jQuery));

/*
 * Simple Mobile Navigation
 */
;
(function ($) {
    function MobileNav(options) {
        this.options = $.extend({
            container: null,
            hideOnClickOutside: false,
            menuActiveClass: 'nav-active',
            menuOpener: '.nav-opener',
            menuDrop: '.nav-drop',
            toggleEvent: 'click',
            outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
        }, options);
        this.initStructure();
        this.attachEvents();
    }

    MobileNav.prototype = {
        initStructure: function () {
            this.page = $('html');
            this.container = $(this.options.container);
            this.opener = this.container.find(this.options.menuOpener);
            this.drop = this.container.find(this.options.menuDrop);
        },
        attachEvents: function () {
            var self = this;

            if (activateResizeHandler) {
                activateResizeHandler();
                activateResizeHandler = null;
            }

            this.outsideClickHandler = function (e) {
                if (self.isOpened()) {
                    var target = $(e.target);
                    if (!target.closest(self.opener).length && !target.closest(self.drop).length) {
                        self.hide();
                    }
                }
            };

            this.openerClickHandler = function (e) {
                e.preventDefault();
                self.toggle();
            };

            this.opener.on(this.options.toggleEvent, this.openerClickHandler);
        },
        isOpened: function () {
            return this.container.hasClass(this.options.menuActiveClass);
        },
        show: function () {
            this.container.addClass(this.options.menuActiveClass);
            if (this.options.hideOnClickOutside) {
                this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        hide: function () {
            this.container.removeClass(this.options.menuActiveClass);
            if (this.options.hideOnClickOutside) {
                this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        toggle: function () {
            if (this.isOpened()) {
                this.hide();
            } else {
                this.show();
            }
        },
        destroy: function () {
            this.container.removeClass(this.options.menuActiveClass);
            this.opener.off(this.options.toggleEvent, this.clickHandler);
            this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        }
    };

    var activateResizeHandler = function () {
        var win = $(window),
            doc = $('html'),
            resizeClass = 'resize-active',
            flag, timer;
        var removeClassHandler = function () {
            flag = false;
            doc.removeClass(resizeClass);
        };
        var resizeHandler = function () {
            if (!flag) {
                flag = true;
                doc.addClass(resizeClass);
            }
            clearTimeout(timer);
            timer = setTimeout(removeClassHandler, 500);
        };
        win.on('resize orientationchange', resizeHandler);
    };

    $.fn.mobileNav = function (options) {
        return this.each(function () {
            var params = $.extend({}, options, {container: this}),
                instance = new MobileNav(params);
            $.data(this, 'MobileNav', instance);
        });
    };
}(jQuery));

/*
 * jQuery SameHeight plugin
 */
;
(function ($) {
    $.fn.sameHeight = function (opt) {
        var options = $.extend({
            skipClass: 'same-height-ignore',
            leftEdgeClass: 'same-height-left',
            rightEdgeClass: 'same-height-right',
            elements: '>*',
            flexible: false,
            multiLine: false,
            useMinHeight: false,
            biggestHeight: false
        }, opt);
        return this.each(function () {
            var holder = $(this), postResizeTimer, ignoreResize;
            var elements = holder.find(options.elements).not('.' + options.skipClass);
            if (!elements.length) return;

            // resize handler
            function doResize() {
                elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
                if (options.multiLine) {
                    // resize elements row by row
                    resizeElementsByRows(elements, options);
                } else {
                    // resize elements by holder
                    resizeElements(elements, holder, options);
                }
            }

            doResize();

            // handle flexible layout / font resize
            var delayedResizeHandler = function () {
                if (!ignoreResize) {
                    ignoreResize = true;
                    doResize();
                    clearTimeout(postResizeTimer);
                    postResizeTimer = setTimeout(function () {
                        doResize();
                        setTimeout(function () {
                            ignoreResize = false;
                        }, 10);
                    }, 100);
                }
            };

            // handle flexible/responsive layout
            if (options.flexible) {
                $(window).bind('resize orientationchange fontresize', delayedResizeHandler);
            }

            // handle complete page load including images and fonts
            $(window).bind('load', delayedResizeHandler);
        });
    };

    // detect css min-height support
    var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';

    // get elements by rows
    function resizeElementsByRows(boxes, options) {
        var currentRow = $(), maxHeight, maxCalcHeight = 0, firstOffset = boxes.eq(0).offset().top;
        boxes.each(function (ind) {
            var curItem = $(this);
            if (curItem.offset().top === firstOffset) {
                currentRow = currentRow.add(this);
            } else {
                maxHeight = getMaxHeight(currentRow);
                maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
                currentRow = curItem;
                firstOffset = curItem.offset().top;
            }
        });
        if (currentRow.length) {
            maxHeight = getMaxHeight(currentRow);
            maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
        }
        if (options.biggestHeight) {
            boxes.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', maxCalcHeight);
        }
    }

    // calculate max element height
    function getMaxHeight(boxes) {
        var maxHeight = 0;
        boxes.each(function () {
            maxHeight = Math.max(maxHeight, $(this).outerHeight());
        });
        return maxHeight;
    }

    // resize helper function
    function resizeElements(boxes, parent, options) {
        var calcHeight;
        var parentHeight = typeof parent === 'number' ? parent : parent.height();
        boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function (i) {
            var element = $(this);
            var depthDiffHeight = 0;
            var isBorderBox = element.css('boxSizing') === 'border-box' || element.css('-moz-box-sizing') === 'border-box' || element.css('-webkit-box-sizing') === 'border-box';

            if (typeof parent !== 'number') {
                element.parents().each(function () {
                    var tmpParent = $(this);
                    if (parent.is(this)) {
                        return false;
                    } else {
                        depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
                    }
                });
            }
            calcHeight = parentHeight - depthDiffHeight;
            calcHeight -= isBorderBox ? 0 : element.outerHeight() - element.height();

            if (calcHeight > 0) {
                element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
            }
        });
        boxes.filter(':first').addClass(options.leftEdgeClass);
        boxes.filter(':last').addClass(options.rightEdgeClass);
        return calcHeight;
    }
}(jQuery));

/*
 * jQuery FontResize Event
 */
jQuery.onFontResize = (function ($) {
    $(function () {
        var randomID = 'font-resize-frame-' + Math.floor(Math.random() * 1000);
        var resizeFrame = $('<iframe>').attr('id', randomID).addClass('font-resize-helper');

        // required styles
        resizeFrame.css({
            width: '100em',
            height: '10px',
            position: 'absolute',
            borderWidth: 0,
            top: '-9999px',
            left: '-9999px'
        }).appendTo('body');

        // use native IE resize event if possible
        if (window.attachEvent && !window.addEventListener) {
            resizeFrame.bind('resize', function () {
                $.onFontResize.trigger(resizeFrame[0].offsetWidth / 100);
            });
        }
        // use script inside the iframe to detect resize for other browsers
        else {
            var doc = resizeFrame[0].contentWindow.document;
            doc.open();
            doc.write('<scri' + 'pt>window.onload = function(){var em = parent.jQuery("#' + randomID + '")[0];window.onresize = function(){if(parent.jQuery.onFontResize){parent.jQuery.onFontResize.trigger(em.offsetWidth / 100);}}};</scri' + 'pt>');
            doc.close();
        }
        jQuery.onFontResize.initialSize = resizeFrame[0].offsetWidth / 100;
    });
    return {
        // public method, so it can be called from within the iframe
        trigger: function (em) {
            $(window).trigger("fontresize", [em]);
        }
    };
}(jQuery));
/*
Jquery add tag
*/
;(function ($) {
function removeTag(){
    $('.tag-content-inner .tag > a').click(function () {
        $(this).parent().addClass('remove');
        return false;
    });
};
removeTag();
$('.content-add-tag').each(function (index) {
        $(this).find('.add-tag .btn').on("click", function () {
            if($(this).parent().find('input').val()==null){
                alert();
            }
            var getval = ($(this).parent().find('input').val()?$(this).parent().find('input').val():alert('please fill the text field'))
            var temp = "<span class=\'tag\'><span>"+getval+"</span><a href=\'#\' title=\'Removing tag\'>x</a></span>";
            $(this).parent().next().find('.tag-content-inner').append(temp);
            $(this).parent().find('input').val("");
            removeTag();
        });
    //add tag 2
        $('.sheet-tag-list .tag-list li .add-new-tag').on("click", function () {
            $(this).next().toggleClass('active');;

        })

})
}(jQuery));


/*
 Jquery search box
 */
;(function ($) {
    $('.search-row .form-control.input-search').focus(function () {
        $(this).css({
            'background': '#fff',
            'position': 'relative',
            'z-index': '3'
        });
        $('.box-search-details').css("display", "block");

    });
    $('.search-row .form-control.input-search').blur(function () {
        $(this).css("background", "transparent");
        $('.box-search-details').css("display", "none");
    });
}(jQuery));

/*
 Scroll bar
 */
;
(function ($) {

    $('.col-md-7.col-left .panel-body').slimScroll({
        allowPageScroll: true,
        height: "96%",
        size: "3px"
    });
    //var heightright=$(".col-md-7.col-left.step01").height();
    //$('.scroll-right-panel').slimScroll({
    //    allowPageScroll: true,
    //    height: heightright,
    //    size: "3px",
    //    disableFadeOut: !1,
    //    distance: "-13px"
    //});
    //$(".col-md-5.col-right > .popup-help-container").css("height", cptemp);
}(jQuery));

/*
 Adjust Task app
 */
;
(function ($) {
    // function sameHeightTaskAgile() {
    //     var hi = 0;
    //     $(".custom-form .panel-body .column-holder.same-height-holder > .column").each(function () {
    //         var h = $(this).height();
    //         if (h > hi) {
    //             hi = h;
    //         }
    //     });
    //     //$(".custom-form .panel-body .column-holder.same-height-holder > .column .panel-body.height-full").css("height", hi);
    // }

    // sameHeightTaskAgile();
    // /* Same height col task app*/
    // var temp = 0;
    // $(".col-agl-app").each(function () {
    //     var h = $(this).height();
    //     if (h > temp) {
    //         temp = h;
    //     }
    // });

    // $(".col-agl-app > .panel").css("min-height", temp);

    $('.col-right-task-agile .buttons-holder .btn-default.btn-add').click(function () {
        $('.table-tasks tbody tr.add-row').css("display", "table-row");
    });
    $('.btn-add-agile').click(function () {
        $('.task-box.add-row-box').toggleClass('add-active');
        sameHeightTaskAgile();
    })
    /* Same height Control panel*/
    var cptemp = 0;
    $(".col-md-7.col-left.step01").each(function () {
        var temh = $(this).height();
        if (temh > cptemp) {
            cptemp = temh;
        }
    });

//Control pagen view notifice 1024
    $('.dropdown.icon-notify-ipad a,.close.close-notify-right').on("click", function () {
        $('.col-md-5.col-right').toggleClass('active');
        $('.modal-backdrop-2').toggleClass('active');
        $('body').toggleClass('no-scroll');
        return false;
    })
}(jQuery));



$.setAppModalHeight = function () {
    $('.multi-section-modal .main-section, .multi-section-modal .secondary-section, .secondary-section-inner').css('height', 'auto');
    var appDetailsHeight = ( $('.secondary-section-inner:visible').height() > $('.multi-section-modal .main-section:visible').height() ) ? $('.secondary-section-inner:visible').height() : $('.multi-section-modal .main-section:visible').height();
    if (appDetailsHeight > 0) {
        $('.multi-section-modal .main-section, .multi-section-modal .secondary-section, .secondary-section-inner').css('height', appDetailsHeight);
    }
}

/*
 App Details popup
 */
;
(function ($) {

    $('.multi-section-modal:not(.only-secondary)').on('hidden.bs.modal', function () {
        $(this).removeClass('extended');
        $.setAppModalHeight();
    });

    $('.multi-section-modal:not(.only-secondary) .secondary-section .btn-close').on('click', function () {
        $(this).parents('.multi-section-modal').removeClass('extended');
        $('.multi-section-modal .sub-modal-opener').addClass('btn-default').removeClass('btn-orange');
    });

    $('.multi-section-modal .sub-modal-opener').on('click', function(){
        $(this).parents('.multi-section-modal').addClass('extended');
        $('.secondary-section-inner .sub-section').hide();
        $('.multi-section-modal .sub-modal-opener').addClass('btn-default').removeClass('btn-orange');
        $(this).removeClass('btn-default').addClass('btn-orange');
        $.setAppModalHeight();
    });

    $('.btn-add-to-cart').on('click', function () {
        $(this).parents('.popup-app-details').addClass('extended');
        $.setAppModalHeight();
    });

    $('.btn-integration').on('click', function () {
        $(this).parents('.multi-section-modal').addClass('extended');
        $.setAppModalHeight();
    });

    $('.offer-block .btn-cart').on('click', function () {
        $('.shopping-cart-block').removeClass('hide');
        $.setAppModalHeight();
    });

    $('.shopping-cart-block .btn-cart').on('click', function () {
        $('.enter-card-block').removeClass('hide');
        $.setAppModalHeight();
    });

    $('.enter-card-block .btn-enter-card').on('click', function () {
        $('.offer-block, .payment-block').addClass('hide');
        $('.setup-block').removeClass('hide');
        $('.app-extended .heading-block h1').html('Let\'s setup your App!');
        $('.app-extended .heading-block p').html('Custom Header Settings');
        $.setAppModalHeight();
    });

    $(window).resize($.setAppModalHeight);

}(jQuery));

;
(function ($) {
    $('.btn-open-modal').on('click', function(){
        $('.btn-open-modal').removeClass('btn-orange');
        $(this).addClass('btn-orange');
        $('.secondary-section-inner').hide();
        var target = $(this).attr('data-modal-target');
        $(target).show();
        $(this).parents('.multi-section-modal').addClass('extended'); 
        $.setAppModalHeight();
    });

    $('.multi-section-modal:not(.only-secondary) .secondary-section .btn-close').on('click', function () {
        $('.secondary-section-inner').hide();
        $('.btn-open-modal').removeClass('btn-orange');
    });

}(jQuery));
/*
 Team Details popup
 */
;
(function ($) {
    $('.profile-modal .btn-edit').on('click', function(){
        $(this).parents('.main-section').addClass('editinfo');
    });
    $('.profile-modal .btn-save').on('click', function(){
        $(this).parents('.main-section').removeClass('editinfo');
    });

    $('.member-type-list input[type="radio"]').on('change', function () {
        $('.member-type-icon').removeClass('active');
        if ($(this).prop('checked')) {
            $(this).parents('label').find('.member-type-icon').addClass('active');
        }
    });

    $('.carousel-edit .image-gallery li').on('click', function(){
        $(this).toggleClass('active');
    });

    $('.profile-modal .btn-permission').on('click', function(){
        $('.btn-open-modal').removeClass('btn-orange');
        $(this).addClass('btn-orange');
        $('.secondary-section-inner').hide();
        $('.permission-section').show();
        $(this).parents('.multi-section-modal').addClass('extended'); 
        $.setAppModalHeight();
    });

    $('.profile-modal .btn-stat').on('click', function(){
        $('.btn-open-modal').removeClass('btn-orange');
        $(this).addClass('btn-orange');
        $('.secondary-section-inner').hide();
        $('.stat-section').show();
        $(this).parents('.multi-section-modal').addClass('extended');
        $.setAppModalHeight();
    });

    $('.multi-section-modal .secondary-section .btn-close').on('click', function () {
        $('.stat-section').hide();
        $('.permission-section').hide();
        $('.btn-open-modal').removeClass('btn-orange');
    });

     $('.adv-section .nav-tabs li a').on('shown.bs.tab', function (e) {
       $.setAppModalHeight();
     });
}(jQuery));

/*
 QR Code popup
 */
;
(function ($) {
    $('.qr-modal .btn-edit').on('click', function(){
        $(this).parents('.modal-content').addClass('editinfo');
    });
    $('.qr-modal .btn-save').on('click', function(){
        $(this).parents('.modal-content').removeClass('editinfo');
    });
}(jQuery));


//Switch view type

$.sameHeightLayout = function(){
    var hi = 0;
    $(".row.same-height-holder .same-height-column").css("height", 'auto');
    setTimeout(function(){
        $(".row.same-height-holder .same-height-column:visible").each(function () {
            var h = $(this).height();
            if (h > hi) {
                hi = h;
            }
        });
        $(".row.same-height-holder .same-height-column:visible").css("height", hi);

    });
};

//switching list view and grid view
;
(function ($) {

    $('body').attr('data-view-type', $('.switchers-list .switcher.active').attr('data-view-type'));

    $('.switchers-list .switcher').click(function () {
        $('.switchers-list .switcher').removeClass('active');
        $(this).addClass('active');
        var elmToShow = $(this).attr('data-view-type');
        $('body').attr('data-view-type', $(this).attr('data-view-type'));
        $('.view-type').hide();
        $('.' + elmToShow).show(0, afterShow);
    });

    var afterShow = function () {
        $.sameHeightLayout();
        if ($('.map-view').is(':visible')) {
            if ($('#team-map').length){
                var map = new GMaps({
                    el: '#team-map',
                    lat: -12.043333,
                    lng: -77.028333,
                    zoom: 16
                });
                var overlay1 = map.drawOverlay({
                    lat: -12.043333,
                    lng: -77.028333,
                    layer: 'overlayMouseTarget',
                    click: function () {
                        $("#plumbingModal").modal("show");
                    },
                    content: '<div class="team-people-marker">Daniel Tierney</div>'
                });
                var overlay2 = map.drawOverlay({
                    lat: -12.047433,
                    lng: -77.029533,
                    click: function () {
                        $("#realtorModal").modal("show");
                    },
                    layer: 'overlayMouseTarget',
                    content: '<div class="team-people-marker">Mariah Shanu</div>'
                });
            }
            if ($('#contact-map').length){
                var map = new GMaps({
                    el: '#contact-map',
                    lat: -12.043333,
                    lng: -77.028333,
                    zoom: 16
                });
                var overlay1 = map.drawOverlay({
                    lat: -12.043333,
                    lng: -77.028333,
                    layer: 'overlayMouseTarget',
                    click: function () {
                        $("#detailsModal").modal("show");
                    },
                    content: '<div class="contact-marker clients">Gloria Taylor</div>'
                });
                var overlay2 = map.drawOverlay({
                    lat: -12.047433,
                    lng: -77.029533,
                    click: function () {
                        $("#groupModal").modal("show");
                    },
                    layer: 'overlayMouseTarget',
                    content: '<div class="contact-marker group">Aditya Suyadarma</div>'
                });
                var overlay3 = map.drawOverlay({
                    lat: -12.041433,
                    lng: -77.030533,
                    click: function () {
                        $("#colleaguesModal").modal("show");
                    },
                    layer: 'overlayMouseTarget',
                    content: '<div class="contact-marker colleagues">Dan Lehman</div>'
                });
            }
            if ($('#listing-map').length){

                var popupTpl = '<div class="listing-popup">';
                popupTpl +=       '<div class="listing-image" style="background-image:url(../images/contact/listing-1.jpg)"></div>';
                popupTpl +=         '<div class="listing-info">';
                popupTpl +=           '<span class="price">$320,500</span>';
                popupTpl +=           '<span class="address-line">157 WELDRICK ROAD, W.</span>';
                popupTpl +=           '<span class="address-line">TORONTO, ON 90210</span>';
                popupTpl +=           '<span class="listing-type">Residential</span>';
                popupTpl +=       '</div>';
                popupTpl +=     '</div>'; 
                var map = new GMaps({
                    el: '#listing-map',
                    lat: -12.043333,
                    lng: -77.028333,
                    zoom: 16
                });
                var overlay1 = map.drawOverlay({
                    lat: -12.043333,
                    lng: -77.028333,
                    layer: 'overlayMouseTarget',
                    click: function () {
                        $("#listingModal").modal("show");
                    },
                    content: popupTpl
                });
                var overlay2 = map.drawOverlay({
                    lat: -12.047433,
                    lng: -77.029533,
                    layer: 'overlayMouseTarget',
                    content: '<div class="listing-marker">2.5M</div>'
                });
                var overlay3 = map.drawOverlay({
                    lat: -12.041433,
                    lng: -77.030533,
                    layer: 'overlayMouseTarget',
                    content: '<div class="listing-marker">8.5M</div>'
                });

                var overlay4 = map.drawOverlay({
                    lat: -12.042433,
                    lng: -77.025233,
                    layer: 'overlayMouseTarget',
                    content: '<div class="listing-marker">2.5M</div>'
                });
                var overlay5 = map.drawOverlay({
                    lat: -12.045433,
                    lng: -77.031533,
                    layer: 'overlayMouseTarget',
                    content: '<div class="listing-marker">8.5M</div>'
                });
            }
        }
    }

    $(window).resize(function(){
        var currentViewType = $('body').attr('data-view-type');
        if (currentViewType == 'list-view'){
            var windowWidth = $(this).innerWidth();
            if (windowWidth < 1024){
                $('.view-type').hide();
                $('.grid-view').show();
            }
            else{
                $('.view-type').hide();
                $('.list-view').show();
            }
        }
    });

}(jQuery));

// Team View
;
(function ($) {
    $('.hobbies-list input[type="checkbox"]').on('change', function () {
        if ($(this).prop('checked')) {
            $(this).parents('label').find('.hobby-icon').addClass('active');
        }
        else {
            $(this).parents('label').find('.hobby-icon').removeClass('active');
        }
    });

    $('.checklist-item.checkbox input[type="radio"]').on('change', function () {
        $(this).parents('.checklist').find('.checklist-item').removeClass('checked');
        if ($(this).prop('checked')) {
            $(this).parents('.checklist-item').addClass('checked');
        }
    });

    $('.has-dropdown .dropdown .dropdown-opener').on('click', function (event) {
        $('.has-dropdown .dropdown').not($(this).parent()).removeClass("open");
        $(this).parent().toggleClass("open");
        var dropdownMenu = $(this).parent().find('.dropdown-menu');
        if ($(this).offset().left < dropdownMenu.width()) {
            dropdownMenu.addClass('shift-left');
        }
        else {
            dropdownMenu.removeClass('shift-left');
        }
    });

    $('.has-dropdown .dropdown-dialog .btn-close-dialog').on('click', function (event) {
        $(this).parents('.dropdown').removeClass("open");
    });

    $('body').on('click', function (e) {
        if (!$('.has-dropdown .dropdown').is(e.target) && $('.has-dropdown .dropdown').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
            $('.has-dropdown .dropdown').removeClass('open');
        }
    });

}(jQuery));

;(function ($) {
    if ($("#slider-range-min").length){
        $("#slider-range-min").slider({
            range: "min",
            value: 30,
            min: 0,
            max: 100,
            slide: function (event, ui) {
                $("#amount").val(ui.value + "%");
            }
        });
        $("#amount").val($("#slider-range-min").slider("value") + "%");
    }

     if ($(".slider-insight").length){
        $(".slider-insight").slider({
            range: "min",
            value: 2,
            min: 1,
            max: 9,
            slide: function (event, ui) {
                $(this).parents('.insight-item').find('.insight-time-value').removeClass('active');
                $(this).parents('.insight-item').find('.insight-time-value[data-slider-value='+ui.value+']').addClass('active');
            }
        });
    }

    $('.button-wrap.on-off').on("click", function () {
        $(this).toggleClass('button-active');
    });

}(jQuery));
//Blog app
;
(function ($) {
    $('.detailBlogModal .btn-edit').on("click", function () {
        $('.detailBlogModal').toggleClass('editinfo');

    });
    $('.wb-datepicker').datepicker({
        'autoclose': true,
        'format': 'M d, yyyy',

    });


    function moveBoxImg() {
        var widthscrx = $('body').innerWidth();
        
        if (widthscrx < 767) {
            $('.img-blog-details').insertBefore('.title-blog');
        }
        else {
            $('.img-blog-details').appendTo('.details-blog-container .col-lg-4.col-sm-4');
        }
    };

    moveBoxImg();
    $(window).resize(function () {
        moveBoxImg();
    });

}(jQuery));
//Calendar app
;
(function ($) {
    if ($('#calendarAppDetails .btn-edit').length > 0) {
        $('#calendarAppDetails .btn-edit').on("click", function () {
            $('#calendarAppDetails').toggleClass('editinfo');
            return false;
        });
    }
    $('.daily-view-details').on("click", function () {
        $('html, body').animate({scrollTop: 0}, 300);
    });
    // Add colorpicker
    $('.add-color .btn').on('click', function () {
        var getcolor=$(this).parent().find('#inputcolor').val();
        //$('#color-view-1').css("background",getcolor);
    })
}(jQuery));
// Domains App
;(function ($) {
    $('.domains-modal-first .btn-edit').on('click', function(){
        $('.domains-modal-first').toggleClass('editinfo');
        $('.selectpicker').selectpicker();
        $.setAppModalHeight();

    });
    $('.dm-right-content .domain-btn-contact').on("click", function () {
        $('.domains-contact').css("display","block");
        $.setAppModalHeight();
    });

    $('.dm-right-content .domain-btn-send').on("click", function () {
        $('.push-domains').css("display","block");
        $.setAppModalHeight();
    });

    $('.dm-right-content .btn-add-year').on("click", function () {
        $('.shopping-cart').css("display","block");
        $.setAppModalHeight();
    });

    $('.list-sub-modal .btn-close').on("click", function () {
        $('.list-sub-modal').removeClass('active-modal1');
    });

}(jQuery));
//WYSIWYG
;
(function ($) {
    if($('#summernote').length > 0){
    $('#summernote').summernote({
        toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['fullscreen', ['fullscreen']]
        ],
        height: 150,   //set editable area's height
        codemirror: { // codemirror options
            theme: 'monokai'
        },
        popover: {
            image: [],
            link: [],
            air: []
        }
    });
    }
    $("#bars li .bar").each( function( key, bar ) {
                    var percentage = $(this).data('percentage');

                        $(this).animate({
                            'height' : percentage + '%'
                    }, 1000);
           });

}(jQuery));
// Common
;
(function ($) {

    if ($('.custom-select').length){
        $('.custom-select').customSelectMenu();
    }

    var isIE = detectIE();
    if (isIE) {
        $('body').addClass('ie');
    }

    if ($('.selectpicker').length){
        $('.selectpicker').selectpicker();
    }

    //share widget
    $('body').on('click', '.share-block .share-vendors li a', function(e){
        e.preventDefault();
        $('.share-block .share-vendors li a').removeClass('active');
        $(this).addClass('active');
        $(this).parents('.share-block').find('.share-action').text($(this).attr('data-btn-txt'));
    });

    //upload image widget
    var imgData = '';
    var showEditImageStep = function(imgData){
        $('.upload-step').hide();
        $('.upload-step3').show();
        $('.image-canvas-inner').html('');
        $('.image-zoom input[type="range"]').val(0);
        var cropObj = new CROP();
        var cropConfig = {
            //element to load into
            container: '.image-canvas-inner',
            //image src
            image: imgData,
            //aspect radio
            width: 185,
            height: 185,
            mask: false,
            zoom: {
                steps: 0.01,
                min: 1,
                max: 5
            }
        };
        cropObj.init(cropConfig);
        $('.tool-min').click(function(e){
            e.preventDefault();
            cropObj.zoom('min');
        });
        $('.tool-max').click(function(e){
            e.preventDefault();
            cropObj.zoom('max');
        });
        $('.tool-rotate').click(function(e){
            e.preventDefault();
            cropObj.rotate();
        });
        $('.tool-flip').click(function(e){
            e.preventDefault();
            cropObj.flip();
        });

        $('.wsb-slider').rangeslider({ 
            polyfill: false,
            onSlide: function(position, value) {
                $('.image-canvas input[type="range"]').val(value).change();
            },
        });
    };

    $('body').on('click', '.dropdown-upload-image .btn-upload', function(e){
        e.preventDefault();
        $('#imageUpload').trigger('click');
    });
    $('body').on('change', '.dropdown-upload-image #imageUpload', function(e){
        var file = $(this)[0].files[0];
        var reader  = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.onload = function (fileLoadedEvent) {
                imgData = fileLoadedEvent.target.result;
                $('.upload-step').hide();
                $('.upload-step2-upload').show();
                $('.dropdown-upload-image .image-preview .progress-bar').css('width','0%');
                $('.dropdown-upload-image .image-preview .progress-per').text(0);

                $('.dropdown-upload-image .image-preview').css('background-image', 'url('+imgData+')');

                var progress = 0;
                var progressInterval = setInterval(function(){
                    progress++;
                    $('.dropdown-upload-image .image-preview .progress-bar').css('width', progress+'%');
                    $('.dropdown-upload-image .image-preview .progress-per').text(progress);
                    if (progress == 100){
                        clearInterval(progressInterval);
                        showEditImageStep(imgData);
                    }
                }, 100);
            };
        }
    });

    $('.btn-library').on('click', function(e){
        e.preventDefault();
        $('.upload-step').hide();
        $('.upload-step2-library').show();
        $('.upload-step2-library .upload-content-section').slimScroll({
            height: '230px',
            alwaysVisible: true
        });
        $('.library-gallery').isotope({
            itemSelector: '.library-item',
            layoutMode: 'masonry',
            masonry: {
                gutter: 8
            }
        });
    });

    $('.btn-basket').on('click', function(e){
        e.preventDefault();
        $('.upload-step').hide();
        $('.upload-step2-purchase').show();
        $('.upload-step2-purchase .upload-content-section').slimScroll({
            height: '230px',
            alwaysVisible: true
        });
        $('.library-gallery').isotope({
            itemSelector: '.library-item',
            layoutMode: 'masonry',
            masonry: {
                gutter: 8
            }
        });
    });

    $('.library-item').on('click', function(){
        $('.library-gallery .library-item').removeClass('selected');
        $(this).addClass('selected');
    });

    $('.upload-step2-library .btn-action').on('click', function(e){
        e.preventDefault();
        if ($('.upload-step2-library .library-item.selected').length){
            var imgData = $('.upload-step2-library .library-item.selected img').attr('src');
            showEditImageStep(imgData);
        }
    });

    //account menu
    $(document).on('click', '.user-dropdown .dropdown-menu', function (e) {
        e.stopPropagation();
    });

    // hold onto the drop down menu                                             
    var dropdownMenu;

    // and when you show it, move it to the body                                     
    $('#imageUploadDropdown .dropdown-opener').on('click', function (e) {

        $('.upload-step').hide();
        $('.upload-step1').show();

        // grab the menu        
        dropdownMenu = $(e.target).parents('.dropdown').find('.dropdown-menu');

        // detach it and append it to the body
        $('body').append(dropdownMenu.detach());

        // grab the new offset position
        var eOffset = $(e.target).offset();

        // make sure to place it where it would normally go (this could be improved)
        dropdownMenu.css({
            'display': 'block',
                'top': eOffset.top + $(e.target).outerHeight(),
                'left': eOffset.left
        });
    });

    // and when you hide it, reattach the drop down, and hide it normally                                                   
    $('.dropdown-upload-image .btn-close-dialog').on('click', function (e) {
        $('#imageUploadDropdown').append(dropdownMenu.detach());
        dropdownMenu.hide();
    });

    $('.dialog-select-styles .row').slimScroll({
        height: '250px'
    });

//Js website app
    $('.sheet-website-app-grid input[type="checkbox"]').on('change', function () {
        if ($(this).prop('checked')) {
            $(this).parents('.item-inner').addClass('active');
        }
        else {
            $(this).parents('.item-inner').removeClass('active');
        }
    });
    $('table.table-list-website input[type="checkbox"]').on('change', function () {
        if ($(this).prop('checked')) {
            $(this).parents('tr').addClass('active');
        }
        else {
            $(this).parents('tr').removeClass('active');
        }
    });

// Js website app design
    var wsb_windowWidth = $(window).width();
    if(wsb_windowWidth <= 767){
        $('.nav-devices .item-nav-device').removeClass('active');
        $('.nav-devices .device-sp').addClass('active');
    }
    if(wsb_windowWidth >= 768 && wsb_windowWidth <= 1024){
        $('.nav-devices .item-nav-device').removeClass('active');
        $('.nav-devices .device-tablet').addClass('active');
    }
    $('[data-toggle="tooltip"]').tooltip();
    
    $('.control-nav .item-control-nav').on('click', function(){
        $(this).tooltip('hide');
    });
    
    $('.close-left-content').on('click', function(){
        $(this).parents('.left-content').addClass('hideeee');
    });
    
    // website app design navigation
    $(document).on('click', function() {
        //$(".wad-nav .control-nav .item-control-nav").removeClass('active');
        //$(".wad-nav .item-content-nav").removeClass('active');
        $('.hd-val').removeClass('active');
        //$('.wad-tab .item-tab-content').removeClass('active');
        $('.editable').removeClass('hover');
        //$('.popup-color-picker').css('display','block');
    });

    $(".wad-nav .content-nav .item-content-nav").on('click', function(e) {
        //e.stopPropagation();
    });
    
    $(".wad-nav .content-nav .item-content-nav .item-tab-content").on('click', function(e) {
        //e.stopPropagation();
    });
    
    $(".wad-nav .control-nav .item-control-nav").on('click', function(e) {
        
        var selected_nav = $(this).attr("href");
        $('.item-tab-content').removeClass('active');
        
        $('.left-content').removeClass('active');
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $(selected_nav).removeClass('active');
            $('body').removeClass('active');
            $('.content-nav').removeClass('active');
        }
        else{
            $('body').addClass('active');
            $('.content-nav').addClass('active');
            $(".wad-nav .control-nav .item-control-nav").removeClass('active');
            $(this).addClass("active");
            $(".wad-nav .content-nav .item-content-nav").removeClass('active');
            $(selected_nav).addClass('active');
        }
        
        return false;
    });
    
    // website app design tab
    var flag_tab = false;
    
    $('.wad-tab .tab-control .item-tab-control').on('click', function(){
        var selected_tab = $(this).attr("href");
        var flag_tab = !flag_tab;
        
        
        if(flag_tab){
            $('.tab-content').addClass('active');
        }
        else{
            $('.tab-content').removeClass('active');
        }
        
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $(selected_tab).removeClass('active');
            $('.disclose').removeClass('active');
        }
        else{
            $(".wad-tab .tab-control .item-tab-control").removeClass('active');
            $(this).addClass("active");
            $(this).siblings('.disclose').addClass('active');
            $(".wad-tab .tab-content .item-tab-content").removeClass('active');
            $(selected_tab).addClass('active');
        }
        
        return false;
    });
    
    $('.btn-close-wad').on('click', function(){
        $(this).closest('.item-tab-content').removeClass('active');
        $(this).closest('.tab-content').removeClass('active');
        $(this).closest('.tab-content').removeClass('active');
        var href = $(this).closest('.item-tab-content').attr('id');
        $(document).find('a[href$="' + href + '"]').removeClass('active');
    });
    $('.wsm-popup-2 .btn-close-wad').on('click', function(){
        $(this).closest('.item-content-nav').removeClass('active');
        $('.option-edit').removeClass('active');
    });
    
    $('.btn-close-wad-right').on('click', function(){
        $(this).closest('.item-content-nav').removeClass('active');
        $('body').removeClass('active');
        $('.content-nav').removeClass('active');
        $('.left-content').removeClass('active');
        $('.item-tab-content').removeClass('active');
        
        var this_id = $(this).closest('.item-content-nav').attr('id');
        $(document).find('a[href$="' + this_id + '"]').removeClass('active');
    });
    
    $('.border').each(function(){
        var flag_border = false;
        
        $(this).on('click', function(){
            flag_border = !flag_border;

            if(flag_border) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    });
   
    // website app design accordion
    $('.accordion-design .accordion-content > .accordion-item:has(ol)').addClass("has-child");
    $('.accordion-design > .accordion-content > .accordion-item > .accordion-control').addClass("root-control");

    $('.accordion-design .accordion-item .accordion-control').click(function() {
        
        $('.accordion-design > .accordion-content > .accordion-item > .accordion-control').addClass("root-control");
    });
    
    // sortable
    $( ".sortable-2" ).sortable({
        revert: true,
        items: ".ui-state-default:not(.disable-sort)"
    });
    
    // add new page
    $('.btn-add-new-page').on('click', function(){
        var obj = $('.accordion-item').html();
        $('.accordion-design >.accordion-content').append('<li class="mjs-nestedSortable-leaf new-page-item accordion-item nav-z-index" id=""> <div class="menuDiv new-page-control accordion-control root-control dropdown ui-sortable-handle"> <span title="Click to show/hide children" class="disclose ui-icon ui-icon-minusthick"> <i class="icon-drop-down-design"></i> </span> <a href="javaScript:void(0)" class="item-tab-control"> <span class="icon-drag"> <span class="st1 st-icon"> <span></span> <span></span> </span> <span class="st2 st-icon"> <span></span> <span></span> </span> <span class="st3 st-icon"> <span></span> <span></span> </span> <span class="st4 st-icon"> <span></span> <span></span> </span> </span> <span>page</span> </a> <span href="javaScript: void(0);" class="delete-page dropdown-opener" data-id="6"></span> <div class="dropdown-menu dropdown-dialog ui-sortable-handle" style="right:0"> <div class="dialog-header ui-sortable-handle"> <h2 class="dialog-title">Are you sure?</h2> <button type="button" class="btn btn-default btn-close-dialog"><span aria-hidden="true">×</span></button> </div><div class="dialog-content ui-sortable-handle"> <div class="content-inner ui-sortable-handle"> <div class="action-buttons ui-sortable-handle"> <button class="btn btn-default pull-left">Cancel</button> <button class="btn btn-red pull-right delete-page-item" data-dismiss="modal">Delete</button> </div></div></div></div></div></li>');
    });
    
    // enable editing
    $(".editable").on('click', function(e) {
        e.stopPropagation();
    });

    /*$('.settingable').on('click', function(){
        $('.option-edit').css('display','block');
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });*/

    $('.img-settingable').on('click', function(){
        $('.option-edit-btn').css('display','none');
        $('.option-edit-img').css('display','block');
        //$('.option-edit-btn').removeClass('active');
        //$('.option-edit-img').addClass('active');
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });

    $('.btn-settingable').on('click', function(){
        $('.option-edit-btn').css('display','block');
        $('.option-edit-img').css('display','none');
        //$('.option-edit-img').removeClass('active');
        //$('.option-edit-btn').addClass('active');
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });
    
    $('.wrap-wad').on('mouseenter', function(){
        $('.editable').addClass('hover').delay(300).queue(function(){
            $('.editable').removeClass('hover');
            $(this).dequeue();
        });
    });
    
    $(document).on('keydown',function(e) {
        shifted = e.shiftKey;
        $('.editable').addClass('hover');
    });
    
    $(document).on('keyup',function(e) {
        shifted = e.shiftKey;
        $('.editable').removeClass('hover');
    });
    
    // color picker
    $('#inputcolor').val('#ccc');
    $('#cp7').colorpicker({
        customClass: 'colorpicker-2x',
        sliders: {
            saturation: {
                maxLeft: 220,
                maxTop: 220
            },
            hue: {
                maxTop: 220
            },
            alpha: {
                maxTop: 220
            }
        },
        color: '#ffaa00',
        container: true,
        inline: true
    });
    
    $('.custom-color .lv').each(function(){
        $(this).on('click', function(){
            $('.custom-color .lv').removeClass('active');
            $(this).addClass('active');
            $('.btn-add-color').on('click', function(){
                var color_val = $('#inputcolor').val();
                $('.custom-color .lv.active').css('background', color_val);
                $('.custom-color .lv.active .icon-colorpicker').remove();
            });
        });
    });
    
    $('.color-wad .list-color-fixed a').on('click', function(){
        console.log($(this).attr('value'));
        $('.custom-color .lv.active').css('background', $(this).attr('value'));
        $('.custom-color .lv.active .icon-colorpicker').remove();
    });
    
    // font setting
    $('.wsb-font-setting .font-family-value').on('change', function(){
        console.log($(this).find('option:selected').val());
        $(this).closest('.wsb-font-setting').find('.wsb-font-result').css('font-family',$(this).find('option:selected').val());
    });
    $('.wsb-font-setting .font-size-value').on('change', function(){
        console.log($(this).find('option:selected').val());
        $(this).closest('.wsb-font-setting').find('.wsb-font-result').css('font-size',$(this).find('option:selected').val());
    });
    
    // Website app design Publish - view site info tabs
    $('.view-site-info-tab .item-view-site-info-tab-control').on('click', function(){
        var selected_tab = $(this).attr("href");
        
        $('.view-site-info-tab .item-view-site-info-tab-content').removeClass('active');
        $(selected_tab).addClass('active');
        $('.view-site-info-tab .item-view-site-info-tab-control').removeClass('active');
        $(this).addClass('active');
        
        return false;
    });

    // nestedSortable
    $().ready(function(){
        var ns = $('ol.sortable').nestedSortable({
            forcePlaceholderSize: true,
            handle: 'div',
            helper:	'clone',
            items: 'li',
            opacity: .6,
            placeholder: 'placeholder',
            revert: 250,
            tabSize: 25,
            tolerance: 'pointer',
            toleranceElement: '> div',
            maxLevels: 3,
            isTree: true,
            expandOnHover: 700,
            startCollapsed: false,
            change: function(){
                console.log('Relocated item');
                $('.new-page-item .new-page-item .new-page-control').removeClass('root-control');
            }
        });
        
        $('.expandEditor').attr('title','Click to show/hide item editor');
        $('.disclose').attr('title','Click to show/hide children');
        $('.deleteMenu').attr('title', 'Click to delete item.');
    
        $('.disclose').on('click', function() {
            $(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass('mjs-nestedSortable-expanded');
            $(this).toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
            $('.accordion-design .accordion-content .accordion-item').removeClass('has-child');
                $('.accordion-design .accordion-content .accordion-item:has(ol)').addClass('has-child');
        });
        
        $('.expandEditor, .itemTitle').click(function(){
            var id = $(this).attr('data-id');
            $('#menuEdit'+id).toggle();
            $(this).toggleClass('ui-icon-triangle-1-n').toggleClass('ui-icon-triangle-1-s');
        });

        $('.delete-page').on('click', function(){
            var that = $(this);
            $('.new-page-item').removeClass('active');
            $(this).closest('.new-page-item').addClass('active');
            $(this).closest('.new-page-item').siblings().addClass('nav-z-index');
            $('.delete-page-item').on('click', function(){
                var id = that.attr('data-id');
                $('#menuItem_'+id).remove();
            });
        });
            
        $('#serialize').click(function(){
            serialized = $('ol.sortable').nestedSortable('serialize');
            $('#serializeOutput').text(serialized+'\n\n');
        })

        $('#toHierarchy').click(function(e){
            hiered = $('ol.sortable').nestedSortable('toHierarchy', {startDepthCount: 0});
            hiered = dump(hiered);
            (typeof($('#toHierarchyOutput')[0].textContent) != 'undefined') ?
            $('#toHierarchyOutput')[0].textContent = hiered : $('#toHierarchyOutput')[0].innerText = hiered;
        })

        $('#toArray').click(function(e){
            arraied = $('ol.sortable').nestedSortable('toArray', {startDepthCount: 0});
            arraied = dump(arraied);
            (typeof($('#toArrayOutput')[0].textContent) != 'undefined') ?
            $('#toArrayOutput')[0].textContent = arraied : $('#toArrayOutput')[0].innerText = arraied;
        });
    });

    function dump(arr,level) {
        var dumped_text = "";
        if(!level) level = 0;

        //The padding given at the beginning of the line.
        var level_padding = "";
        for(var j=0;j<level+1;j++) level_padding += "    ";

        if(typeof(arr) == 'object') { //Array/Hashes/Objects
            for(var item in arr) {
                var value = arr[item];

                if(typeof(value) == 'object') { //If it is an array,
                    dumped_text += level_padding + "'" + item + "' ...\n";
                    dumped_text += dump(value,level+1);
                } else {
                    dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                }
            }
        } else { //Strings/Chars/Numbers etc.
            dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
        }
        return dumped_text;
    }
    
    $('.accordion-content').on('mouseup', function(){
        $('.new-page-item .new-page-item .new-page-control').removeClass('root-control');
    });
    
    // publish site version
    $('.older-versions > p').on('click', function(){
        $('.older-versions > p').removeClass('currently');
        $('.older-versions > p > .status').empty().text('RESTORE');
        $(this).addClass('currently');
        $(this).find('.status').empty().text('CURRENT');
    });
    
}(jQuery));