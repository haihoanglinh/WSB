;(function ($) {

  $('.listing-item .wsb-checkbox, .table-listing .wsb-checkbox').click(function(e){
    e.stopPropagation();
  });

  $('.asignee-box').click(function(e){
    e.stopPropagation();
  });

  $('.listings-row .dropdown .dropdown-menu, .table-listing .dropdown .dropdown-menu').click(function(e){
    e.stopPropagation();
  });

  $('.listing-item .wsb-checkbox input[type="checkbox"]').on('change',function(){
    var item = $(this).parents('.listing-item');
    if ($(this).prop('checked')){
      item.addClass('active');
    }
    else{
      item.removeClass('active');
    }
  });

  $('.remove-filter').click(function(){
    $(this).parents('.filtered-item').remove();
  });

  $( ".slider-range" ).each(function(){
    var min = parseInt($(this).attr('data-start'));
    var max = parseInt($(this).attr('data-end'));
    var prefix = $(this).attr('data-prefix');
    var valueDiv = $(this).parents('.slider-item').find('.slider-value');
    var minValue = min > 999 ? ((min/1000).toFixed(0)+'K') : min;
    var maxValue = max > 999 ? ((max/1000).toFixed(0)+'K') : max;
    $(valueDiv).html( prefix + minValue + ' - ' + prefix + maxValue);
    $(this).slider({
        range: true,
        min: min,
        max: max,
        values: [min, max],
        slide: function( event, ui ) {
          var start = ui.values[ 0 ] > 999 ? ((ui.values[ 0 ]/1000).toFixed(0)+'K') : ui.values[ 0 ];
          var end = ui.values[ 1 ] > 999 ? ((ui.values[ 1 ]/1000).toFixed(0)+'K') : ui.values[ 1 ];
          $(valueDiv).html( prefix + start + ' - ' + prefix + end );
        }
    });

  });

  var calcListingCardHeight = function(){
    $('.listing-item').each(function(){
      $(this).show();
      var width = $(this).width();
      var height = width/4*3;
      $(this).css('min-height', '0');
      $(this).css('height', height);
    });
  };

  $(window).resize(function(){
    calcListingCardHeight();
  });
  calcListingCardHeight();


  $('#mlsModal').on('show.bs.modal', function(){
    $('#mlsModal').addClass('extended');
    $('.check-coverage').removeClass('hide');
    $('.mls-search-result').addClass('hide');
    setTimeout(function(){
      var map = new GMaps({
          el: '#mls-map',
          lat: -12.043333,
          lng: -77.028333,
          zoom: 12
      });

      map.addMarker({
          lat: -12.043333,
          lng: -77.028333,
          icon: "../images/listings/icon_map_pin.png"
      });

      map.addMarker({
          lat: -12.053333,
          lng: -77.058333,
          icon: "../images/listings/icon_map_pin.png"
      });

      map.addMarker({
          lat: -12.013333,
          lng: -77.018333,
          icon: "../images/listings/icon_map_pin.png"
      });

      $.setAppModalHeight();
    },500);
  });

  $('.btn-edit').on('click', function(){
    
    setTimeout(function(){
      $('.features-group').each(function(){
        $(this).nestable({
          maxDepth: 1,
          dragClass: 'dd-dragel drag-feature',
          placeClass: 'dd-item dd-placeholder clearfix'
        });
      });

      $('.rooms-group').each(function(){
        $(this).nestable({
          maxDepth: 1,
          dragClass: 'dd-dragel drag-room',
          placeClass: 'dd-item dd-placeholder clearfix'
        });
      });

    },100);
  });

  $('#settingModal').on('show.bs.modal', function(){
    $(this).find('.secondary-section-inner').show();
  });

  $('#pieChart').highcharts({
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      spacingLeft: 0,
      spacingRight: 0,
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
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
    legend: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        innerSize: '80%',
        borderWidth: 0,
        dataLabels: {
            enabled: true,
            connectorWidth: 0,
            connectorPadding: 1,
            distance: 5,
            format: '{point.percentage:.0f} %',
            style: {
                color: '#919191'
            }
        },
        showInLegend: true
      }
    },
    series: [{
      data: [{
        y: 18,
        color: '#ebb051',
        name: 'Divorced-Female'
      },{
        y: 12,
        color: '#de6c6c',
        name: 'Divorced-Male'
      },{
        y: 8,
        color: '#50a9df',
        name: 'Married-Female'
      },{
        y: 28,
        color: '#92c277',
        name: 'Married-Male'
      },{
        y: 16,
        color: '#745fdf',
        name: 'Single-Female'
      },{
        y: 10,
        color: '#dc7cd4',
        name: 'Single-Male'
      },{
        y: 8,
        color: '#80d9d0',
        name: 'Widowed-Female'
      }]
    }]
  });

  $('#pieChart2').highcharts({
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      spacingLeft: 0,
      spacingRight: 0,
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
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
    legend: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        innerSize: '80%',
        borderWidth: 0,
        dataLabels: {
            enabled: true,
            connectorWidth: 0,
            connectorPadding: 1,
            distance: 5,
            format: '{point.percentage:.0f} %',
            style: {
                color: '#919191'
            }
        },
        showInLegend: true
      }
    },
    series: [{
      data: [{
        y: 18,
        color: '#de6c6c',
        name: 'No Kids'
      },{
        y: 12,
        color: '#92c277',
        name: 'With Kids'
      }]
    }]
  });

  $('#pieChart3').highcharts({
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      spacingLeft: 0,
      spacingRight: 0,
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
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
    legend: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        innerSize: '80%',
        borderWidth: 0,
        dataLabels: {
            enabled: true,
            connectorWidth: 0,
            connectorPadding: 1,
            distance: 5,
            format: '{point.percentage:.0f} %',
            style: {
                color: '#919191'
            }
        },
        showInLegend: true
      }
    },
    series: [{
      data: [{
        y: 18,
        color: '#ebb051',
        name: '0s'
      },{
        y: 12,
        color: '#de6c6c',
        name: '10s'
      },{
        y: 8,
        color: '#50a9df',
        name: '20s'
      },{
        y: 28,
        color: '#92c277',
        name: '30s'
      },{
        y: 16,
        color: '#745fdf',
        name: '40s'
      },{
        y: 10,
        color: '#dc7cd4',
        name: '50s'
      },{
        y: 8,
        color: '#80d9d0',
        name: '60s'
      },{
        y: 8,
        color: '#fbf292',
        name: '70s+'
      }]
    }]
  });

  $('#pieChart4').highcharts({
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      spacingLeft: 0,
      spacingRight: 0,
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
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
    legend: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        innerSize: '80%',
        borderWidth: 0,
        dataLabels: {
            enabled: true,
            connectorWidth: 0,
            connectorPadding: 1,
            distance: 5,
            format: '{point.percentage:.0f} %',
            style: {
                color: '#919191'
            }
        },
        showInLegend: true
      }
    },
    series: [{
      data: [{
        y: 18,
        color: '#ebb051',
        name: 'under 10min'
      },{
        y: 12,
        color: '#de6c6c',
        name: '10-20min'
      },{
        y: 8,
        color: '#50a9df',
        name: '20-30min'
      },{
        y: 28,
        color: '#92c277',
        name: '30-45min'
      },{
        y: 16,
        color: '#745fdf',
        name: '45-60min'
      },{
        y: 10,
        color: '#dc7cd4',
        name: '60+ min'
      }]
    }]
  });

  $('.btn-enter-card-mls').on('click', function(e){
    e.preventDefault();
    $('.secondary-section-inner').hide();
    $('.step2-section').show();
    $.setAppModalHeight();
  });

  $('.sign-idx').on('click', function(e){
    e.preventDefault();
    $('.secondary-section-inner').hide();
    $('.step3-section').show();
    $.setAppModalHeight();
  });

  $('.btn-search-mls').on('click', function(){
    $('.check-coverage').addClass('hide');
    if( $('#mlsName').val() == 1 ){
      $('.mls-search-result.error').removeClass('hide');
    }
    else{
      $('.mls-search-result.success').removeClass('hide');
    }
    $.setAppModalHeight();
  });

  $('.nav-listings a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href") // activated tab
    if (target == '#tab-map'){
      setTimeout(function(){
        var map2 = new GMaps({
            el: '#listing-detail-map',
            lat: -12.043333,
            lng: -77.028333,
            zoom: 16
        });
        map2.addMarker({
            lat: -12.043333,
            lng: -77.028333,
            icon: "../images/listings/icon_map_pin.png"
        });
      }, 100);
    }
  });

  $.sameHeightLayout();

  $('.show-more-toggle').on('click', function(){
    setTimeout(function(){
      $.sameHeightLayout();
    }, 200);
  });

  var drawingManager;
  $('.map-draw-btn').on('click', '.btn', function(e){
    e.preventDefault();
    $('.map-draw-btn .btn').removeClass('active');
    $(this).addClass('active');
    var mode = $(this).attr('data-mode');
    if (mode == 'RECTANGLE'){
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
    }
    if (mode == 'CIRCLE'){
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
    }
    if (mode == 'POLYLINE'){
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
    }
  });

  // var showHideProperty = function(){
  //   var property = $('#res-property').val();
  //   $('.key-facts > li').each(function(){
  //     var isShow = false;
  //     var propertiesList = $(this).attr('data-show-for').split(',');
  //     for (var i=0; i<propertiesList.length; i++){
  //       if (propertiesList[i] == property){
  //         isShow = true;
  //       }
  //     }
  //     if (isShow){ $(this).show(); }
  //     else { $(this).hide(); }
  //   });
  // };

  // $('#res-property').on('change', function(){
  //   console.log($(this).val());
  //   showHideProperty();
  // });

  $('.map-icon.dropdown-opener').on('click', function(){
    var map = new GMaps({
      div: '#search-listing-map',
      lat: -12.043333,
      lng: -77.028333
    });

    drawingManager = new google.maps.drawing.DrawingManager({

      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      }
    });
    drawingManager.setMap(map.map);
  });

  $('.wb-timepicker').timepicker({
    icons: {
      up: 'fa fa-angle-up',
      down: 'fa fa-angle-down'
    }
  });

  $('.add-agent').on('click', function(){
    var agentRow = $('.agent-info .agent-row').first().clone();
    agentRow.find('input').val('');
    agentRow.appendTo('.agent-info');
  });

  $('.add-school').on('click', function(){
    var schoolRow = $('.school-rows .school-row').first().clone();
    schoolRow.find('input').val('');
    schoolRow.appendTo('.school-rows');
  });

}(jQuery));
