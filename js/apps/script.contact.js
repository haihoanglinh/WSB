;(function ($) {

  $('.contact-card .wsb-checkbox, .table-contact .wsb-checkbox').click(function(e){
    e.stopPropagation();
  });

  $('.contact-card .asignee-box').click(function(e){
    e.stopPropagation();
  });

  $('.contact-card .dropdown .dropdown-menu').click(function(e){
    e.stopPropagation();
  });

  $('.table-contact .asignee-box').click(function(e){
    e.stopPropagation();
  });

  $('.contact-card .wsb-checkbox input[type="checkbox"]').on('change',function(){
    var item = $(this).parents('.contact-card');
    if ($(this).prop('checked')){
      item.addClass('active');
    }
    else{
      item.removeClass('active');
    }
  });

  $('.wb-datepicker').datepicker({
      'autoclose': true,
      'format': 'M d, yyyy',
      'weekStart' : 1,
  });

  $('.campaign-accordion a[data-toggle="collapse"]').on('click', function (e) {
    $(this).find('input[type="radio"]').prop('checked', true);
  })

  var categories = ['Jan','Feb','Mar','Apr','May','Jun'];
  var columnChartOptions = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      spacingLeft: 0,
      spacingRight: 0,
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
      categories: categories,
      labels:{
        style: {
          color: '#8d939a',
          'font-family': 'proxima_nova'
        }
      },
      tickInterval: 1,
      tickWidth: 0,
      lineWidth: 0,
      tickColor: '#404040',
      minPadding: 0,
      maxPadding: 0,
      gridLineColor: '#404040',
      gridLineWidth: 1,
      tickmarkPlacement: 'on'
    },
    yAxis: {
      min: 0,
      tickInterval: 10,
      gridLineColor: '#404040',
      labels:{
        align: 'center',
        format: '{value}',
        style: {
          color: '#8d939a',
          'font-family': 'proxima_nova'
        }
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
      column: {
        pointPadding: 0.1,
        borderWidth: 0,
        maxPointWidth: 9,
        borderRadius: 5,
        dataLabels: {
          enabled: true,
          useHTML: true,
          padding: false,
          crop: false,
          overflow: 'none',
          allowOverlap: true,
          formatter: function() {
            return '<span class="chart-column-mark"></span>'; 
          },
          y: 0
        }
      }
    },
    series: [{
      data: [18, 42, 28, 37, 20, 12],
      color: '#eb6b22'
    }]
  };
  $('#columnChart').highcharts(columnChartOptions);
  $('#columnChart2').highcharts(columnChartOptions);
  
  var lineCategories = ['$100K','$200K','$300K','$400K','$500K','$600K'];
  var lineChartOptions = {
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
      spacingLeft: 0,
      spacingRight: 0,
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
        style: {
          color: '#8d939a',
          'font-size': '10px',
          'font-family': 'proxima_nova'
        },
      },
      min: 0.2,
      max: categories.length-1.2,
      tickInterval: 1,
      tickWidth: 0,
      lineWidth: 0,
      tickColor: '#404040',
      minPadding: 0,
      maxPadding: 0,
      gridLineColor: '#404040',
      gridLineWidth: 0,
      tickmarkPlacement: 'on'
    },
    yAxis: {
      min: 0,
      tickInterval: 10,
      gridLineColor: '#404040',
      labels:{
        align: 'center',
        format: '{value}',
        style: {
          color: '#8d939a',
          'font-family': 'proxima_nova'
        }
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
        lineColor: '#5ca8c2',
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts.Color('#5ca8c2').setOpacity(0.2).get('rgba')],
            [1, Highcharts.Color('#5ca8c2').setOpacity(0).get('rgba')]
          ]
        },
        marker: {
          radius: 5,
          symbol: 'circle',
          lineWidth: 2,
          lineColor: '#5ca8c2',
          symbol: 'url(../images/team/chart_marker.png)'
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
      data: [18, 42, 28, 37, 20, 12],
      color: '#5ca8c2',
      maxPointWidth: 8
    }]
  };
  $('#lineChart').highcharts(lineChartOptions);
  $('#lineChart2').highcharts(lineChartOptions);

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
    xAxis: {
      categories: lineCategories,
      labels:{
        style: {
          color: '#8d939a',
          'font-size': '10px',
          'font-family': 'proxima_nova'
        },
      },
      min: 0.2,
      max: categories.length-1.2,
      tickInterval: 1,
      tickWidth: 0,
      lineWidth: 0,
      tickColor: '#404040',
      minPadding: 0,
      maxPadding: 0,
      gridLineColor: '#404040',
      gridLineWidth: 0,
      tickmarkPlacement: 'on'
    },
    yAxis: {
      min: 0,
      tickInterval: 10,
      gridLineColor: '#404040',
      labels:{
        align: 'center',
        format: '{value}',
        style: {
          color: '#8d939a',
          'font-family': 'proxima_nova'
        }
      },
      title: {
        text: ''
      },
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      symbolWidth: 13,
      symbolHeight: 13,
      symbolRadius: 13,
      padding: 10,
      itemStyle: {color: '#fff', 'font-family': 'proxima_nova', 'font-size': '14px', 'font-weight': '300'},
      itemMarginBottom: 12,
      itemHoverStyle: {color: '#919191'}
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
          enabled: false
        },
        showInLegend: true
      }
    },
    series: [{
      data: [{
        y: 20,
        color: '#ebb051',
        name: 'Manhattan'
      },{
        y: 20,
        color: '#de6c6c',
        name: 'Brooklin' 
      },{
        y: 60,
        color: '#6ba9ce',
        name: 'Qeens'
      }],
    }]
  });

  $.sameHeightLayout();

  $('.routing-list').nestable({
    maxDepth: 1,
    dragClass: 'dd-dragel',
    placeClass: 'dd-item dd-placeholder clearfix'
  });


  if($('.summernote').length > 0){
    $('.summernote').summernote({
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

  $('.contact-group').nestable({
    maxDepth: 1,
    dragClass: 'dd-dragel drag-contact',
    placeClass: 'dd-item dd-placeholder clearfix'
  });

}(jQuery));