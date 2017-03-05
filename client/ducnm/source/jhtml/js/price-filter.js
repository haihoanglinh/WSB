jQuery( window ).on( 'load', function() {

    "use strict";

    $('.widget-price-filter__slider').each( function() {

        var price_filter = $(this)[0];
        var $to = $(this).parent().find('.widget-price-filter__from');
        var $from = $(this).parent().find('.widget-price-filter__to');
        var $vals = $(this).parent().find('.widget-price-filter__vals');
        var options = $.parseJSON( $(this).attr('data-options') );
        var initial_start = parseInt(options.initial_start, 10);
        var initial_end = parseInt(options.initial_end, 10);
        var range_start = parseInt(options.range_start, 10);
        var range_end = parseInt(options.range_end, 10);

        noUiSlider.create(price_filter, {
            start: [initial_start, initial_end],
            connect: true,
            range: {
                'min': range_start,
                'max': range_end
            }
        });

        price_filter.noUiSlider.on('update', function(values, handle){
            var end_val = parseInt( values[Object.keys(values)[0]], 10);  // Get start value from "values" object
            var start_val = parseInt(  values[Object.keys(values)[1]], 10);  // Get end value from "values" object
            $from.text(start_val);
            $to.text(end_val);
            $vals.val( JSON.stringify(values) );
        });


    });
    
    

});