(function ($) {
    
    /* website modal items setting */
    $('.wsm-setting').each(function(){
        $('.wsm-setting-item').on('click', function(){
            $(this).closest('.wsm-setting').find('.wsm-setting-item').removeClass('active');
            $(this).addClass('active');
        });
    });
    
    // website model tab
    $('.wsm-tab .tab-control .item-tab-control').on('click', function(){
        var selected_tab = $(this).attr("href");
        
        $(".wsm-tab .tab-control .item-tab-control").removeClass('active');
        $(this).addClass("active");
        $(".wsm-tab .tab-content .item-tab-content").removeClass('active');
        $(selected_tab).addClass('active');
        
        return false;
    });
    
    // Image Settings tabs
    $('.image-setting-tab .item-image-setting-tab-control').on('click', function(){
        var tab_active = $(this).attr('href');
        
        $('.image-setting-tab .item-image-setting-tab-control').removeClass('active');
        $(this).addClass('active');
        $('.image-setting-tab .item-image-setting-tab-content').removeClass('active');
        $(tab_active).addClass('active');
        
        return false;
    });
    $('.image-setting-tab #imageUpload').on('change', function(){
        console.log('dsvds');
        //$(this).closest('.upload-step1').css('display','none !important');
    });
    
    // Countdown
    $('.num .augment').each(function(index){
        var val = parseInt($(this).siblings('.val').text());
        $(this).on('click', function(){
            console.log(val);
            val = val + 1;
            $(this).siblings('.val').text(val);
            return false;
        });
    });
    
    $('.num .reduce').each(function(index){
        var val = parseInt($(this).siblings('.val').text());
        $(this).on('click', function(){
            console.log(val);
            val = val - 1;
            $(this).siblings('.val').text(val);
            return false;
        });
    });
    
    // Scroll
    $('.wsm-scroll-wrap').slimScroll({
        height: 'auto'
    });
    
    // Table setting
    var so_row = parseInt($('.so-row').text());
    var so_col = parseInt($('.so-col').text());
    
    $.each(new Array(so_row), function(){
        $('.result').find('tbody').append($('<tr>')
        );
    });
    
    $('.result tr').each(function(){
        var that = $(this);
        
        $.each(new Array(so_col), function(){
            $(that).append($('<td>'))
        });
    });
    
    $('.cong-row').on('click', function(){
    
        $('.result tr').remove();
    
        $('.so-row').html(function(i, val) { return val*1+1 });
        
        var so_row = parseInt($('.so-row').text());
        var so_col = parseInt($('.so-col').text());
        
        $.each(new Array(so_row), function(){
            $('.result').find('tbody').append($('<tr>')
            );
        });
        
        $('.result tr').each(function(){
            var that = $(this);
            
            $.each(new Array(so_col), function(){
                $(that).append($('<td>'))
            });
        });
    });
    
    $('.tru-row').on('click', function(){
    
        $('.result tr').remove();
    
        $('.so-row').html(function(i, val) {
            if(val*1-1 < 1){
                return val = 0;
            }
            else{
                return val*1-1
            }
        });
        
        var so_row = parseInt($('.so-row').text());
        var so_col = parseInt($('.so-col').text());
        
        $.each(new Array(so_row), function(){
            $('.result').find('tbody').append($('<tr>')
            );
        });
        
        $('.result tr').each(function(){
            var that = $(this);
            
            $.each(new Array(so_col), function(){
                $(that).append($('<td>'))
            });
        });
    });
    
    $('.cong-col').on('click', function(){
    
        $('.result tr').remove();
    
        $('.so-col').html(function(i, val) { return val*1+1 });
        
        var so_row = parseInt($('.so-row').text());
        var so_col = parseInt($('.so-col').text());
        
        $.each(new Array(so_row), function(){
            $('.result').find('tbody').append($('<tr>')
            );
        });
        
        $('.result tr').each(function(){
            var that = $(this);
            
            $.each(new Array(so_col), function(){
                $(that).append($('<td>'))
            });
        });
    });
    
    $('.tru-col').on('click', function(){
    
        $('.result tr').remove();
    
        $('.so-col').html(function(i, val) {
            if(val*1-1 < 1){
                return val = 0;
            }
            else{
                return val*1-1
            }
        });
        
        var so_row = parseInt($('.so-row').text());
        var so_col = parseInt($('.so-col').text());
        
        $.each(new Array(so_row), function(){
            $('.result').find('tbody').append($('<tr>')
            );
        });
        
        $('.result tr').each(function(){
            var that = $(this);
            
            $.each(new Array(so_col), function(){
                $(that).append($('<td>'))
            });
        });
    });
    
    // Countdown Settings
    $('.count-up').each(function(){
        var number = $(this).next();
        
        $(this).on('click', function(){

            if($(this).closest('.count-day').length){
                $(number).html(function(i, val) {
                    if(val*1+1 > 30){
                        return val = 30;
                    }
                    else{
                        return val*1+1
                    }
                });
            }
            if($(this).closest('.count-month').length){
                $(number).html(function(i, val) {
                    if(val*1+1 >= 12){
                        return val = 12;
                    }
                    else{
                        return val*1+1
                    }
                });
            }
            if($(this).closest('.count-seconds').length){
                $(number).html(function(i, val) {
                    if(val*1+1 > 59){
                        return val = 59;
                    }
                    else{
                        return val*1+1
                    }
                });
            }
            else{
                $(number).html(function(i, val) { return val*1+1 });
            }
        });
    });
    
    $('.count-down').each(function(){
        var number = $(this).prev();
        
        $(this).on('click', function(){
            $(number).html(function(i, val) {
                if(val*1-1 < 1){
                    return val = 0;
                }
                else{
                    return val*1-1
                }
            });
        });
    });
    
    var month_array = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    $('.month-up').on('click', function(){
        for(i = 0; i <= month_array.length; i++){
            month_text = $(this).next().text();
            
            if(month_text == month_array[i]){
                $(this).next().text(month_array[i+1]);
            }
        }
    });
    $('.month-down').on('click', function(){
        for(var i in month_array){
            month_item = month_array[i--]
        }
    });
    
    // Tabs & FAQ Settings popup 2 add Tab
    var $row_tab_faq = $('.wsm-tab-faq-popup-2 .table-row.ui-state-default').last().clone();
    
    $('.wsm-tab-faq-popup-2 .btn-plus-wad').each(function(){
        $(this).on('click', function(){
            //console.log($('.wsm-tab-faq-popup-2 .table-row.ui-state-default').last().html());
            $row_tab_faq.insertBefore($('.wsm-tab-faq-popup-2 .table-row').last()).html();
            console.log('count');
        });
    });
    
    // website modal payment details
    $('.wsm-payment-details-control').on('click', function(){
        $('.wsm-payment-details').addClass('active');
    });
    $('.btn-close-payment').on('click', function(){
        $(this).closest('.wsm-payment-details').removeClass('active');
    });
    
    // Agent ID close dialog
    $('.wsm-agent-profile-settings-2 .btn-close-dialog').on('click', function(){
        //$(this).closest('.dropdown-dialog').css('display','none');
    });
    $('.wsm-office-settings-2 .btn-close-dialog').on('click', function(){
        //$(this).closest('.dropdown-dialog').css('display','none');
    });
    
    // Pricing Settings add item
    $('.wsm-pricing-settings-2 .btn-plus-wad').each(function(index){
        i = 3;
        $(this).on('click', function(){
            i++;
            $('<div class="table-row"> <div class="table-cell"> <h5>Line '+i+': <span class="label popup-container popup-tooltip hidden-xs"> <a class="opener-popup" href="#"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span></a> </span> </h5> </div><div class="table-cell"> <div class="form-group"> <input type="text" class="form-control"> </div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow user-del-btn dropdown-opener"> <i class="fa fa-trash"></i> </button> </div></div>').insertBefore('.wsm-pricing-settings-2 .table-wad.lines .table-row:last-child');
        });
    });
    $('.wsm-pricing-settings-2 .user-del-btn').on('click', function(){
        $(this).closest('.table-row').remove();
    });
    
    // ranger slider
    $( ".number-tw .wsm-range" ).slider({
        value: 15,
        min: 0,
        max: 100,
        step: 1,
        slide: function( event, ui ) {
            $( ".number-tw .wsm-range-value" ).text(ui.value );
        }
    });
    $( ".number-tw .wsm-range-value" ).text($( ".number-tw .wsm-range" ).slider("value" ) );
    $( ".progress-ranger-1 .wsm-range" ).slider({
        value: 30,
        min: 0,
        max: 100,
        step: 1,
        slide: function( event, ui ) {
            $( ".progress-ranger-1 .wsm-range-value" ).text("%" + ui.value );
        }
    });
    $( ".progress-ranger-1 .wsm-range-value" ).text( "%" + $( ".progress-ranger-1 .wsm-range" ).slider("value" ) );
    $( ".progress-ranger-2 .wsm-range" ).slider({
        value: 50,
        min: 0,
        max: 100,
        step: 1,
        slide: function( event, ui ) {
            $( ".progress-ranger-2 .wsm-range-value" ).text("%" + ui.value );
        }
    });
    $( ".progress-ranger-2 .wsm-range-value" ).text( "%" + $( ".progress-ranger-2 .wsm-range" ).slider("value" ) );
    
    // Website modal
    $('.ws-modal .ws-modal-opener').on('click', function(){
        $(this).closest('.ws-modal').find('.wsm-popup-2').addClass('active');
        
        return false;
    });
    $('.ws-modal .btn-close-wad').on('click', function(){
        $(this).closest('.wsm-popup-2').removeClass('active');
    });
    $('.wsm-popup-2 .btn-close-wad').on('click', function(){
        $(this).closest('.wsm-popup-2').removeClass('active');
    });
    
    // Image Setting 2
    $('.wsm-image-settings-2 .btn-wsm-image-settings-step1').on('click', function(){
        $('.wsm-image-settings-2 .upload-step').css('display','none');
        $('.wsm-image-settings-2 .upload-step.upload-step1').css('display','block');
    });
    $('.wsm-image-settings-2 .btn-wsm-image-settings-step2').on('click', function(){
        $('.wsm-image-settings-2 .upload-step').css('display','none');
        $('.wsm-image-settings-2 .upload-step.upload-step2-library').css('display','block');
    });
    $('.wsm-image-settings-2 .btn-wsm-image-settings-step3').on('click', function(){
        $('.wsm-image-settings-2 .upload-step').css('display','none');
        $('.wsm-image-settings-2 .upload-step.upload-step2-purchase').css('display','block');
    });
    $('.wsm-image-settings-2 .btn-close').on('click', function(){
        $('.item-image-setting-tab-control').removeClass('active');
        $('.btn-wsm-image-settings-step1').addClass('active');
    });
    $('.wsm-image-settings-2 .library-item').on('click', function(){
        $(this).closest('.wsm-image-settings-2').find('.secondary-section-inner').addClass('active');
        //$('.wsm-image-settings-2 .secondary-section-inner').addClass('active');
    });
    $('.wsm-image-settings-2 .secondary-section-inner .btn-close').on('click', function(){
        $(this).closest('.secondary-section-inner').removeClass('active');
    });
    
    // Progress Setting add item
    $('.wsm-progress-settings-2 .btn-plus-wad').each(function(index){
        $(this).on('click', function(){
            $('<div class="ui-state-default ui-sortable-handle"> <div class="table-row"> <div class="table-cell"> <span class="icon-drag"> <span class="st1 st-icon"> <span></span> <span></span> </span> <span class="st2 st-icon"> <span></span> <span></span> </span> <span class="st3 st-icon"> <span></span> <span></span> </span> <span class="st4 st-icon"> <span></span> <span></span> </span> </span> <div class="form-group"> <input type="text" class="form-control" value="Title 1"> </div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow user-del-btn dropdown-opener"> <i class="fa fa-trash"></i> </button> </div></div><div class="table-row"> <div class="table-cell"> <div class="wsm-slider-range-item progress-ranger-2"> <div class="wsm-range ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content"><span tabindex="0" class="ui-slider-handle ui-corner-all ui-state-default" style="left: 50%;"></span></div><div class="wsm-range-value">%50</div></div></div><div class="table-cell"></div></div></div>').insertBefore('.wsm-progress-settings-2 .table-wad >.table-row');
        });
    });
    $('.wsm-progress-settings-2 .user-del-btn').on('click', function(){
        $(this).closest('.ui-state-default').remove();
    });
    
    // Social Network Setting add item
    $('.wsm-social-network-settings-2 .btn-plus-wad').each(function(index){
        $(this).on('click', function(){
            $('<div class="table-row ui-state-default ui-sortable-handle"> <div class="table-cell"> <span class="icon-drag"> <span class="st1 st-icon"> <span></span> <span></span> </span> <span class="st2 st-icon"> <span></span> <span></span> </span> <span class="st3 st-icon"> <span></span> <span></span> </span> <span class="st4 st-icon"> <span></span> <span></span> </span> </span> <div class="input-group"> <div class="btn-group bootstrap-select input-group-btn"><button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" title=""><span class="filter-option pull-left"><i class="glyphicon wsm-icon-tw"></i> </span>&nbsp;<span class="bs-caret"><span class="caret"></span></span></button><div class="dropdown-menu open"><ul class="dropdown-menu inner" role="menu"><li data-original-index="0"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-fb"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li><li data-original-index="1" class="selected"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-tw"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li></ul></div><select class="selectpicker" tabindex="-98"> <option data-icon="wsm-icon-fb"></option> <option data-icon="wsm-icon-tw" selected=""></option> </select></div><input type="text" class="form-control" aria-label="..." value="http://nyti.ms/1T9Lm19 "> </div></div><div class="table-cell text-right"> <button type="button" class="btn btn-default btn-shadow user-del-btn dropdown-opener"> <i class="fa fa-trash"></i> </button> </div></div>').insertBefore('.wsm-social-network-settings-2 .table-wad .table-row:last-child');
        });
    });
    $('.wsm-social-network-settings-2 .user-del-btn').on('click', function(){
        $(this).closest('.table-row').remove();
    });
    
    // Tabs & FAQ Settings add item
    $('.wsm-tab-faq-popup-2 .btn-plus-wad').each(function(index){
        i = 3;
        $(this).on('click', function(){
            i++;
            $('<div class="table-row ui-state-default ui-sortable-handle"> <div class="table-cell"> <span class="icon-drag"> <span class="st1 st-icon"> <span></span> <span></span> </span> <span class="st2 st-icon"> <span></span> <span></span> </span> <span class="st3 st-icon"> <span></span> <span></span> </span> <span class="st4 st-icon"> <span></span> <span></span> </span> </span> Tab '+i+' </div><div class="table-cell"> <div class="input-group"> <input type="text" class="form-control" placeholder="" aria-describedby="basic-addon1" value="Title for tab"> </div></div><div class="table-cell"> <span class="select-holder"> <span class="fake-select"> <select class="form-control"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> <option selected="selected">5</option> </select> </span> </span> </div><div class="table-cell text-right"> <button type="button" class="btn btn-default btn-shadow user-del-btn dropdown-opener"> <i class="fa fa-trash"></i> </button> </div></div>').insertBefore('.wsm-tab-faq-popup-2 .table-wad .table-row:last-child');
        });
    });
    $('.wsm-tab-faq-popup-2 .user-del-btn').on('click', function(){
        $(this).closest('.table-row').remove();
    });
    
    // Agent Profile add item
    $('.wsm-agent-profile-settings-2 .panel-heading .btn-plus').on('click', function(){
        var this_table = $(this).closest('.table-wad');
        var this_row = $(this).closest('.table-row');
        $('<div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <div class="input-group"> <div class="btn-group bootstrap-select input-group-btn"><button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" title=""><span class="filter-option pull-left"><i class="glyphicon wsm-icon-tw"></i> </span>&nbsp;<span class="bs-caret"><span class="caret"></span></span></button><div class="dropdown-menu open"><ul class="dropdown-menu inner" role="menu"><li data-original-index="0"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-fb"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li><li data-original-index="1" class="selected"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-tw"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li></ul></div><select class="selectpicker" tabindex="-98"> <option data-icon="wsm-icon-fb"></option> <option data-icon="wsm-icon-tw" selected=""></option> </select></div><input type="text" class="form-control" value="http://nyti.ms/1T9Lm19 "> </div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div>').insertBefore(this_row);
    });
    $('.wsm-agent-profile-settings-2 .panel-body .btn-plus').on('click', function(){
        var this_panel = $(this).closest('.panel-body');
        $('<div class="panel-heading ui-state-default ui-sortable-handle" style="position: relative; left: 0px; top: 0px;"> <div class="row"> <div class="col-sm-12 col-xs-12"> <div class="table-wad"> <div class="table-row has-dropdown"> <div class="table-cell dropdown" id="imageUploadDropdown"> <span class="icon-drag"> <span class="st1 st-icon"> <span></span> <span></span> </span> <span class="st2 st-icon"> <span></span> <span></span> </span> <span class="st3 st-icon"> <span></span> <span></span> </span> <span class="st4 st-icon"> <span></span> <span></span> </span> </span> <i class="wsm-icon-person dropdown-opener"></i> <div class="dropdown-menu dropdown-upload-image dropdown-dialog arrow-left"> <div class="dialog-header"> <h2 class="dialog-title">Select on Image</h2> <button type="button" class="btn btn-default btn-close-dialog"><span aria-hidden="true">×</span></button> </div><div class="dialog-content"> <div class="content-inner"> <div class="upload-step upload-step1"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Drag &amp; drop or click a button below to start.</p></div></div><div class="upload-content-section"> <div class="row select-image-source"> <div class="col-xs-4"> <input type="file" id="imageUpload" style="display:none"> <a href="#" class="btn btn-orange btn-upload btn-with-icon"> <i class="material-icons">computer</i><span>Upload</span> </a> </div><div class="col-xs-4"> <a href="#" class="btn btn-orange btn-library btn-with-icon"> <i class="material-icons">view_module</i><span>Library</span> </a> </div><div class="col-xs-4"> <a href="#" class="btn btn-orange btn-basket btn-with-icon"> <i class="material-icons">shopping_basket</i><span>Purchase</span> </a> </div></div></div></div><div class="upload-step upload-step2-upload" style="display:none"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Upload in progress. <br>Next you can adjust your photo</p></div><div class="col-xs-6 text-right"> <a href="#" class="btn btn-orange btn-action">Cancel</a> </div></div><div class="upload-content-section has-photo"> <div class="image-preview"> <span class="progress-text"><span class="progress-per">60</span>% Complete</span> <div class="progress"> <div class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar"> </div></div></div></div></div><div class="upload-step upload-step2-library" style="display:none"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Select an image from your <br>library of images</p></div><div class="col-xs-6 text-right"> <a href="#" class="btn btn-orange btn-action">Select</a> </div></div><div class="upload-content-section library"> <div class="library-gallery"> <div class="library-item"> <img src="../images/upload-tool/img1.jpg" id="image01"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img2.jpg" id="image02"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg" id="image03"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img4.jpg" id="image04"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img1.jpg" id="image05"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg" id="image06"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div></div></div><div class="upload-step upload-step2-purchase" style="display:none"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Select an image from your <br>library of images</p></div><div class="col-xs-6 text-right search-image-form"> <input type="text" class="form-control search-image-text"> <a href="#" class="btn btn-orange btn-action">Search</a> </div></div><div class="upload-content-section library"> <div class="library-gallery"> <div class="library-item"> <img src="../images/upload-tool/img1.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img2.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img4.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img1.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg"> <span class="price-tag">$5</span> </div></div></div></div><div class="upload-step upload-step3" style="display:none"> <div class="row section-header"> <div class="col-xs-9"> <div class="image-tools"> <a href="#" class="image-tool tool-min"><i class="tool-icon icon-min"></i></a> <a href="#" class="image-tool tool-max"><i class="tool-icon icon-max"></i></a> <a href="#" class="image-tool tool-rotate"><i class="tool-icon icon-rotate"></i></a> <a href="#" class="image-tool tool-flip"><i class="tool-icon icon-flip"></i></a> </div><p class="help-text">Zoom in and out <br>Click crop when done</p></div><div class="col-xs-3 text-right"> <a href="#" class="btn btn-orange btn-action">Crop</a> </div></div><div class="upload-content-section has-photo"> <div class="image-canvas"> <div class="image-canvas-inner"></div></div><div class="image-zoom"> <input type="range" class="wsb-slider" min="1" step="0.01" max="5" value="0" data-orientation="vertical"> </div></div></div></div></div></div></div><div class="table-cell"> <div class="form-group input-name clearfix"> <input type="text" class="form-control" placeholder="First Name"> <input type="text" class="form-control" placeholder="Last Name"> </div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <div class="form-group input-title"> <input type="text" class="form-control" placeholder="Title"> </div></div><div class="table-cell"></div></div></div><div id="optionsDetails2" class="collapse in" aria-expanded="true"> <div class="table-wad"> <div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <div class="input-group fb"> <div class="btn-group bootstrap-select input-group-btn"><button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" title=""><span class="filter-option pull-left"><i class="glyphicon wsm-icon-fb"></i> </span>&nbsp;<span class="bs-caret"><span class="caret"></span></span></button><div class="dropdown-menu open"><ul class="dropdown-menu inner" role="menu"><li data-original-index="0" class="selected"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-fb"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li><li data-original-index="1"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-tw"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li></ul></div><select class="selectpicker" tabindex="-98"> <option data-icon="wsm-icon-fb" selected=""></option> <option data-icon="wsm-icon-tw"></option> </select></div><input type="text" class="form-control" value="https://fb.com/34890"> </div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <div class="input-group"> <div class="btn-group bootstrap-select input-group-btn"><button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" title=""><span class="filter-option pull-left"><i class="glyphicon wsm-icon-tw"></i> </span>&nbsp;<span class="bs-caret"><span class="caret"></span></span></button><div class="dropdown-menu open"><ul class="dropdown-menu inner" role="menu"><li data-original-index="0"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-fb"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li><li data-original-index="1" class="selected"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-tw"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li></ul></div><select class="selectpicker" tabindex="-98"> <option data-icon="wsm-icon-fb"></option> <option data-icon="wsm-icon-tw" selected=""></option> </select></div><input type="text" class="form-control" value="http://nyti.ms/1T9Lm19 "> </div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <div class="input-group"> <div class="btn-group bootstrap-select input-group-btn"><button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" title=""><span class="filter-option pull-left"><i class="glyphicon wsm-icon-tw"></i> </span>&nbsp;<span class="bs-caret"><span class="caret"></span></span></button><div class="dropdown-menu open"><ul class="dropdown-menu inner" role="menu"><li data-original-index="0"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-fb"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li><li data-original-index="1" class="selected"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-tw"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li></ul></div><select class="selectpicker" tabindex="-98"> <option data-icon="wsm-icon-fb"></option> <option data-icon="wsm-icon-tw" selected=""></option> </select></div><input type="text" class="form-control" value="http://nyti.ms/1T9Lm19 "> </div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <div class="input-group"> <div class="btn-group bootstrap-select input-group-btn"><button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" title=""><span class="filter-option pull-left"><i class="glyphicon wsm-icon-tw"></i> </span>&nbsp;<span class="bs-caret"><span class="caret"></span></span></button><div class="dropdown-menu open"><ul class="dropdown-menu inner" role="menu"><li data-original-index="0"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-fb"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li><li data-original-index="1" class="selected"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-tw"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li></ul></div><select class="selectpicker" tabindex="-98"> <option data-icon="wsm-icon-fb"></option> <option data-icon="wsm-icon-tw" selected=""></option> </select></div><input type="text" class="form-control" value="http://nyti.ms/1T9Lm19 "> </div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <div class="input-group"> <div class="btn-group bootstrap-select input-group-btn"><button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" title=""><span class="filter-option pull-left"><i class="glyphicon wsm-icon-tw"></i> </span>&nbsp;<span class="bs-caret"><span class="caret"></span></span></button><div class="dropdown-menu open"><ul class="dropdown-menu inner" role="menu"><li data-original-index="0"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-fb"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li><li data-original-index="1" class="selected"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-tw"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li></ul></div><select class="selectpicker" tabindex="-98"> <option data-icon="wsm-icon-fb"></option> <option data-icon="wsm-icon-tw" selected=""></option> </select></div><input type="text" class="form-control" value="http://nyti.ms/1T9Lm19 "> </div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <div class="input-group"> <div class="btn-group bootstrap-select input-group-btn"><button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" title=""><span class="filter-option pull-left"><i class="glyphicon wsm-icon-tw"></i> </span>&nbsp;<span class="bs-caret"><span class="caret"></span></span></button><div class="dropdown-menu open"><ul class="dropdown-menu inner" role="menu"><li data-original-index="0"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-fb"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li><li data-original-index="1" class="selected"><a tabindex="0" class="" style="" data-tokens="null"><span class="glyphicon wsm-icon-tw"></span> <span class="text"></span><span class="glyphicon glyphicon-ok check-mark"></span></a></li></ul></div><select class="selectpicker" tabindex="-98"> <option data-icon="wsm-icon-fb"></option> <option data-icon="wsm-icon-tw" selected=""></option> </select></div><input type="text" class="form-control" value="http://nyti.ms/1T9Lm19 "> </div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell"></div><div class="table-cell"> <button type="button" class="btn btn-default btn-plus"> <span class="x1"></span> <span class="x2"></span> </button> </div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <textarea class="form-control input-biography" placeholder="Biography"></textarea> </div><div class="table-cell"></div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell has-dropdown"> <div class="btn-group agent dropdown" role="group" aria-label="..."> <button type="button" class="btn btn-default agent-id">Agent ID</button> <span class="input-group-addon dropdown-opener"> <i class="fa fa-circle"></i> <i class="fa fa-circle"></i> <i class="fa fa-circle"></i> </span> <div class="dropdown-menu dropdown-dialog"> <div class="dialog-header"> <h2 class="dialog-title">Search Agent IDs</h2> <button type="button" class="btn btn-default btn-close-dialog"><span aria-hidden="true">×</span></button> </div><div class="dialog-content"> <div class="form-group clearfix"> <input class="form-control" type="text" placeholder="Search ID"> </div><div class="checklist"> <div class="result-item checklist-item checkbox checked"> <label> <input type="radio" name="agent_id" checked=""> <span class="fake-input btn btn-success btn-circle btn-checked"> <i class="fa fa-check"></i> </span> <span class="result-name">Benjamin Watson</span> <span class="result-id">Agent ID 4589</span> </label> </div><div class="result-item checklist-item checkbox"> <label> <input type="radio" name="agent_id"> <span class="fake-input btn btn-success btn-circle btn-checked"> <i class="fa fa-check"></i> </span> <span class="result-name">Ryan Bennet</span> <span class="result-id">Agent ID 4555</span> </label> </div><div class="result-item checklist-item checkbox"> <label> <input type="radio" name="agent_id"> <span class="fake-input btn btn-success btn-circle btn-checked"> <i class="fa fa-check"></i> </span> <span class="result-name">Paul Campbell</span> <span class="result-id">Agent ID 4589</span> </label> </div><div class="result-item checklist-item checkbox"> <label> <input type="radio" name="agent_id"> <span class="fake-input btn btn-success btn-circle btn-checked"> <i class="fa fa-check"></i> </span> <span class="result-name">Gloria Taylor</span> <span class="result-id">Agent ID 4589</span> </label> </div></div></div></div></div><div class="btn-group office dropdown" role="group" aria-label="..."> <button type="button" class="btn btn-default office-id">Office ID</button> <span class="input-group-addon dropdown-opener"> <i class="fa fa-circle"></i> <i class="fa fa-circle"></i> <i class="fa fa-circle"></i> </span> <div class="dropdown-menu dropdown-dialog"> <div class="dialog-header"> <h2 class="dialog-title">Search Agent IDs</h2> <button type="button" class="btn btn-default btn-close-dialog"><span aria-hidden="true">×</span></button> </div><div class="dialog-content"> <div class="form-group clearfix"> <input class="form-control" type="text" placeholder="Search ID"> </div><div class="checklist"> <div class="result-item checklist-item checkbox checked"> <label> <input type="radio" name="agent_id" checked=""> <span class="fake-input btn btn-success btn-circle btn-checked"> <i class="fa fa-check"></i> </span> <span class="result-name">Benjamin Watson</span> <span class="result-id">Agent ID 4589</span> </label> </div><div class="result-item checklist-item checkbox"> <label> <input type="radio" name="agent_id"> <span class="fake-input btn btn-success btn-circle btn-checked"> <i class="fa fa-check"></i> </span> <span class="result-name">Ryan Bennet</span> <span class="result-id">Agent ID 4555</span> </label> </div><div class="result-item checklist-item checkbox"> <label> <input type="radio" name="agent_id"> <span class="fake-input btn btn-success btn-circle btn-checked"> <i class="fa fa-check"></i> </span> <span class="result-name">Paul Campbell</span> <span class="result-id">Agent ID 4589</span> </label> </div><div class="result-item checklist-item checkbox"> <label> <input type="radio" name="agent_id"> <span class="fake-input btn btn-success btn-circle btn-checked"> <i class="fa fa-check"></i> </span> <span class="result-name">Gloria Taylor</span> <span class="result-id">Agent ID 4589</span> </label> </div></div></div></div></div></div><div class="table-cell"></div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <div class="form-group input-phone"> <i class="wsm-icon-phone"></i><input type="text" class="form-control" placeholder="Phone"> </div></div><div class="table-cell"></div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <div class="form-group input-fax"> <i class="wsm-icon-fax "></i><input type="text" class="form-control" placeholder="Fax"> </div></div><div class="table-cell"></div></div><div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <div class="form-group input-email"> <i class="wsm-icon-email"></i><input type="text" class="form-control" placeholder="Email"> </div></div><div class="table-cell"></div></div></div></div><div class="table-wad"> <div class="table-row"> <div class="table-cell"></div><div class="table-cell"> <span class="show-more-toggle text-orange" data-toggle="collapse" data-target="#optionsDetails2" aria-expanded="true"> <span class="text-collapsed"><i class="fa fa-chevron-down" aria-hidden="true"></i> More Options</span> <span class="text-opened"><i class="fa fa-chevron-up" aria-hidden="true"></i> Hide Options</span> </span> </div><div class="table-cell"></div></div></div></div></div></div>').insertBefore(this_panel);
    });
    
    // Gallery Setting add item
    $('.wsm-gallery-settings-2 .btn-plus').on('click', function(){
        $('<div class="table-row ui-state-default has-dropdown ui-sortable-handle"> <div class="table-cell dropdown" id="imageUploadDropdown"> <span class="icon-drag"> <span class="st1 st-icon"> <span></span> <span></span> </span> <span class="st2 st-icon"> <span></span> <span></span> </span> <span class="st3 st-icon"> <span></span> <span></span> </span> <span class="st4 st-icon"> <span></span> <span></span> </span> </span> <i class="wsm-icon-blank dropdown-opener"></i> <div class="dropdown-menu dropdown-upload-image dropdown-dialog arrow-left"> <div class="dialog-header"> <h2 class="dialog-title">Select on Image</h2> <button type="button" class="btn btn-default btn-close-dialog"><span aria-hidden="true">×</span></button> </div><div class="dialog-content"> <div class="content-inner"> <div class="upload-step upload-step1"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Drag &amp; drop or click a button below to start.</p></div></div><div class="upload-content-section"> <div class="row select-image-source"> <div class="col-xs-4"> <input type="file" id="imageUpload" style="display:none"> <a href="#" class="btn btn-orange btn-upload btn-with-icon"> <i class="material-icons">computer</i><span>Upload</span> </a> </div><div class="col-xs-4"> <a href="#" class="btn btn-orange btn-library btn-with-icon"> <i class="material-icons">view_module</i><span>Library</span> </a> </div><div class="col-xs-4"> <a href="#" class="btn btn-orange btn-basket btn-with-icon"> <i class="material-icons">shopping_basket</i><span>Purchase</span> </a> </div></div></div></div><div class="upload-step upload-step2-upload" style="display:none"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Upload in progress. <br>Next you can adjust your photo</p></div><div class="col-xs-6 text-right"> <a href="#" class="btn btn-orange btn-action">Cancel</a> </div></div><div class="upload-content-section has-photo"> <div class="image-preview"> <span class="progress-text"><span class="progress-per">60</span>% Complete</span> <div class="progress"> <div class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar"> </div></div></div></div></div><div class="upload-step upload-step2-library" style="display:none"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Select an image from your <br>library of images</p></div><div class="col-xs-6 text-right"> <a href="#" class="btn btn-orange btn-action">Select</a> </div></div><div class="upload-content-section library"> <div class="library-gallery"> <div class="library-item"> <img src="../images/upload-tool/img1.jpg" id="image01"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img2.jpg" id="image02"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg" id="image03"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img4.jpg" id="image04"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img1.jpg" id="image05"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg" id="image06"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div></div></div><div class="upload-step upload-step2-purchase" style="display:none"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Select an image from your <br>library of images</p></div><div class="col-xs-6 text-right search-image-form"> <input type="text" class="form-control search-image-text"> <a href="#" class="btn btn-orange btn-action">Search</a> </div></div><div class="upload-content-section library"> <div class="library-gallery"> <div class="library-item"> <img src="../images/upload-tool/img1.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img2.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img4.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img1.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg"> <span class="price-tag">$5</span> </div></div></div></div><div class="upload-step upload-step3" style="display:none"> <div class="row section-header"> <div class="col-xs-9"> <div class="image-tools"> <a href="#" class="image-tool tool-min"><i class="tool-icon icon-min"></i></a> <a href="#" class="image-tool tool-max"><i class="tool-icon icon-max"></i></a> <a href="#" class="image-tool tool-rotate"><i class="tool-icon icon-rotate"></i></a> <a href="#" class="image-tool tool-flip"><i class="tool-icon icon-flip"></i></a> </div><p class="help-text">Zoom in and out <br>Click crop when done</p></div><div class="col-xs-3 text-right"> <a href="#" class="btn btn-orange btn-action">Crop</a> </div></div><div class="upload-content-section has-photo"> <div class="image-canvas"> <div class="image-canvas-inner"></div></div><div class="image-zoom"> <input type="range" class="wsb-slider" min="1" step="0.01" max="5" value="0" data-orientation="vertical"> </div></div></div></div></div></div></div><div class="table-cell"> <div class="form-group"> <input type="text" class="form-control" value="Samanta"> </div><div class="input-group"> <div class="btn-group bootstrap-select input-group-btn wsb-select one-arrow page-link"><button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" title="Page"><span class="filter-option pull-left">Page</span>&nbsp;<span class="bs-caret"><span class="caret"></span></span></button><div class="dropdown-menu open"><ul class="dropdown-menu inner" role="menu"><li data-original-index="0"><a tabindex="0" class="" style="" data-tokens="null"><span class="text">Link</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li><li data-original-index="1" class="selected"><a tabindex="0" class="" style="" data-tokens="null"><span class="text">Page</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li></ul></div><select class="selectpicker wsb-select one-arrow page-link" tabindex="-98"> <option>Link</option> <option selected="">Page</option> </select></div><div class="btn-group bootstrap-select input-group-btn wsb-select one-arrow village"><button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" title="Samanta Village"><span class="filter-option pull-left">Samanta Village</span>&nbsp;<span class="bs-caret"><span class="caret"></span></span></button><div class="dropdown-menu open"><ul class="dropdown-menu inner" role="menu"><li data-original-index="0" class="selected"><a tabindex="0" class="" style="" data-tokens="null"><span class="text">Samanta Village</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li><li data-original-index="1"><a tabindex="0" class="" style="" data-tokens="null"><span class="text">Another</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li></ul></div><select class="selectpicker wsb-select one-arrow village" tabindex="-98"> <option>Samanta Village</option> <option>Another</option> </select></div></div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div>').insertBefore($(this).closest('.table-row'));
    });
    
    // Testimonial Setting add item
    $('.wsm-testimonials-settings-2 .btn-plus').on('click', function(){
        var this_row = $(this).closest('.table-row');
        $('<div class="table-row ui-state-default has-dropdown ui-sortable-handle"> <div class="table-cell dropdown" id="imageUploadDropdown"> <span class="icon-drag"> <span class="st1 st-icon"> <span></span> <span></span> </span> <span class="st2 st-icon"> <span></span> <span></span> </span> <span class="st3 st-icon"> <span></span> <span></span> </span> <span class="st4 st-icon"> <span></span> <span></span> </span> </span> <i class="wsm-icon-person dropdown-opener"></i> <div class="dropdown-menu dropdown-upload-image dropdown-dialog arrow-left"> <div class="dialog-header"> <h2 class="dialog-title">Select on Image</h2> <button type="button" class="btn btn-default btn-close-dialog"><span aria-hidden="true">×</span></button> </div><div class="dialog-content"> <div class="content-inner"> <div class="upload-step upload-step1"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Drag &amp; drop or click a button below to start.</p></div></div><div class="upload-content-section"> <div class="row select-image-source"> <div class="col-xs-4"> <input type="file" id="imageUpload" style="display:none"> <a href="#" class="btn btn-orange btn-upload btn-with-icon"> <i class="material-icons">computer</i><span>Upload</span> </a> </div><div class="col-xs-4"> <a href="#" class="btn btn-orange btn-library btn-with-icon"> <i class="material-icons">view_module</i><span>Library</span> </a> </div><div class="col-xs-4"> <a href="#" class="btn btn-orange btn-basket btn-with-icon"> <i class="material-icons">shopping_basket</i><span>Purchase</span> </a> </div></div></div></div><div class="upload-step upload-step2-upload" style="display:none"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Upload in progress. <br>Next you can adjust your photo</p></div><div class="col-xs-6 text-right"> <a href="#" class="btn btn-orange btn-action">Cancel</a> </div></div><div class="upload-content-section has-photo"> <div class="image-preview"> <span class="progress-text"><span class="progress-per">60</span>% Complete</span> <div class="progress"> <div class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar"> </div></div></div></div></div><div class="upload-step upload-step2-library" style="display:none"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Select an image from your <br>library of images</p></div><div class="col-xs-6 text-right"> <a href="#" class="btn btn-orange btn-action">Select</a> </div></div><div class="upload-content-section library"> <div class="library-gallery"> <div class="library-item"> <img src="../images/upload-tool/img1.jpg" id="image01"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img2.jpg" id="image02"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg" id="image03"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img4.jpg" id="image04"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img1.jpg" id="image05"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg" id="image06"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div></div></div><div class="upload-step upload-step2-purchase" style="display:none"> <div class="row section-header"> <div class="col-xs-6"> <p class="help-text">Select an image from your <br>library of images</p></div><div class="col-xs-6 text-right search-image-form"> <input type="text" class="form-control search-image-text"> <a href="#" class="btn btn-orange btn-action">Search</a> </div></div><div class="upload-content-section library"> <div class="library-gallery"> <div class="library-item"> <img src="../images/upload-tool/img1.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img2.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img4.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img1.jpg"> <span class="price-tag">$5</span> </div><div class="library-item"> <img src="../images/upload-tool/img3.jpg"> <span class="price-tag">$5</span> </div></div></div></div><div class="upload-step upload-step3" style="display:none"> <div class="row section-header"> <div class="col-xs-9"> <div class="image-tools"> <a href="#" class="image-tool tool-min"><i class="tool-icon icon-min"></i></a> <a href="#" class="image-tool tool-max"><i class="tool-icon icon-max"></i></a> <a href="#" class="image-tool tool-rotate"><i class="tool-icon icon-rotate"></i></a> <a href="#" class="image-tool tool-flip"><i class="tool-icon icon-flip"></i></a> </div><p class="help-text">Zoom in and out <br>Click crop when done</p></div><div class="col-xs-3 text-right"> <a href="#" class="btn btn-orange btn-action">Crop</a> </div></div><div class="upload-content-section has-photo"> <div class="image-canvas"> <div class="image-canvas-inner"></div></div><div class="image-zoom"> <input type="range" class="wsb-slider" min="1" step="0.01" max="5" value="0" data-orientation="vertical"> </div></div></div></div></div></div></div><div class="table-cell"> <div class="form-group clearfix"> <input type="text" class="form-control" value="First Name"> <input type="text" class="form-control" value="Last Name"> </div><div class="form-group clearfix"> <input type="text" class="form-control title-testimonial" value="Title"> </div><div class="form-group mb0"> <textarea name="" id="" cols="30" rows="10"></textarea> </div></div><div class="table-cell"> <button type="button" class="btn btn-default btn-shadow del-btn"> <i class="fa fa-trash"></i> </button> </div></div>').insertBefore(this_row);
    });
    
}(jQuery));