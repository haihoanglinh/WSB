;(function ($) {
  var makeChart = function(){
    var lineCategories = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
    var lineChartOptions = {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        spacing: [0,0,0,0]
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: lineCategories,
        labels:{
          autoRotation: false,
          style: {
            color: '#272727',
            'font-size': '10px',
            'font-family': 'proxima_nova'
          },
        },
        tickInterval: 1,
        tickWidth: 0,
        lineWidth: 0,
        minPadding: 0,
        maxPadding: 0,
        gridLineWidth: 0,
        tickmarkPlacement: 'on'
      },
      yAxis: {
        min: 0,
        tickInterval: 10,
        gridLineWidth: 0,
        labels:{
          enabled: false,
        },
        title: {
          text: ''
        },
      },
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        area: {
          groupPadding: 0,
          lineColor: '#f16a1e',
          marker: {
            radius: 5,
            symbol: 'circle',
            lineWidth: 2,
            lineColor: '#f16a1e',
          },
          lineWidth: 1,
          states: {
              hover: {
                  lineWidth: 1
              }
          },
          threshold: null
        }
      },
      series: [{
        borderRadius: 4,
        data: [2, 10, 6, 20, 3, null, null],
        color: '#f16a1e',
        maxPointWidth: 8
      }]
    };
    $('#lineChart1').highcharts(lineChartOptions);
    $('#lineChart2').highcharts(lineChartOptions);
    $('#lineChart3').highcharts(lineChartOptions);
  };
  makeChart();

  $('.icon-notify-ipad a').on('click', function(){
    makeChart();
  });
  //scroll function

  $(window).scroll(function(){
    if ($(this).width() >= 1200){
        var scrollTop = $(this).scrollTop();
        var timelineWidth = $('.timeline-holder').width();

        if (scrollTop > 0){
            $('.timeline-item.actionable').addClass('sticky');
            $('.timeline-item.actionable').css('width', timelineWidth);
        }
        else{
            $('.timeline-item.actionable').removeClass('sticky');
        }

        var pos = $('.timeline-item.actionable').offset();
        $('.timeline-item:not(.actionable)').each(function () {
            if (pos.top >= $(this).offset().top && pos.top <= $(this).next().offset().top) {

                if($(this).attr('data-date')){
                    $('.timeline-item.actionable .time-day .number').text($(this).attr('data-date'));
                };
                if($(this).attr('data-month')){
                    $('.timeline-item.actionable .time-day .mon').text($(this).attr('data-month'));
                };
                return;
            }
        });
    }
  });



  $('.action-setting,.setting-box .action-inner .header button.btn-close').on("click", function () {
      $('.setting-box.box1').toggleClass('active');
      $('.sheet-bottom-ctrpanel').toggleClass('active');
      $('.timeline-item.actionable').attr('style', '');
      return false;
  });

  $('.timeline-item .insight-time').on('click', function(e){
      e.preventDefault();
      $(this).parents('.timeline-item').find('.time-modal').addClass('show');
  });

  $('.timeline-item .time-modal .insight-hide').on('click', function(e){
      e.preventDefault();
      $(this).parents('.timeline-item').find('.time-modal').removeClass('show');
  });

  $('.insight-item .btn-share').on('click', function(e){
      e.preventDefault();
      $(this).parents('.insight-item').find('.share-modal').addClass('show');
  });

  $('.insight-item .share-modal .insight-hide').on('click', function(e){
      e.preventDefault();
      $(this).parents('.insight-item').find('.share-modal').removeClass('show');
  });

  $('.timeline-item .insight-hide').not('.insight-hide-modal').on('click', function(e){
    //only apply action on screen < 512px
    e.preventDefault();
    var windowWidth = $(window).innerWidth();
    if (windowWidth < 512){
      var parentItem = $(this).parents('.timeline-item');
      if (parentItem.find('.share-modal').hasClass('show')){
        parentItem.find('.share-modal').removeClass('show');
      }
      if (parentItem.find('.time-modal').hasClass('show')){
        parentItem.find('.time-modal').removeClass('show');
      }
    }
  });

}(jQuery));