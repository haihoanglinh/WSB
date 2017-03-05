jQuery(function($){

    "use strict";

    $('.js-event-countdown').each(function () {

        var $this = $(this),
            $date = $this.attr('data-date'),
            $offset = $this.attr('data-offset');

        $this.downCount({
            date: $date,
            offset: $offset
        });

  });
    

});