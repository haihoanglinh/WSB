(function($) {
	'use strict';

	MK.utils = window.MK.utils || {};

    /**
     * Enables to evaluate common methods through DOM JSON references by invoking from object with bracket notation MK.utils[var][var]
     * @type {Object}
     */
    MK.utils.actions = {};

    MK.utils.actions.activate = function (el) {
        $(el).addClass('is-active');
    };
        
    MK.utils.actions.deactivate = function (el) {
        $(el).removeClass('is-active');
    };

}(jQuery));