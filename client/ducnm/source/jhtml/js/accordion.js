/**
 * @author: Hossein Hashemi
 * @update: April 13th
 **/


$(document).ready(function () {


    $('.accordion__tab').click(function () {

        $this = $(this);
        acordion = $this.parent().parent();
        acordionItem = $this.parent();

        if (acordion.hasClass('accordion-multi')) {

            if (!acordionItem.hasClass('accordion__item--active')) {
                acordionItem.addClass('accordion__item--active');
                $this.next().slideDown(300);
            } else {

                acordionItem.removeClass('accordion__item--active');
                $this.next().slideUp(300);

            }

        }



        if (acordion.hasClass('accordion-one')) {


            if (acordionItem.hasClass('accordion__item--active'))
                return false;
            acordion.each(function () {
//                

                acordion.find('.accordion__item--active').find('.accordion__pane').slideUp(300);
                acordion.find('.accordion__item--active').removeClass("accordion__item--active");

            });



            if (!acordionItem.hasClass('accordion__item--active')) {
                acordionItem.addClass('accordion__item--active');
                $this.next().slideDown(300);
            }

        }



    });

});


