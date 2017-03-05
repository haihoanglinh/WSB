$(document).ready(function () {

    $(".js-tabs__tab-item").on("click" ,function (e) {
        e.preventDefault();
        var $this = $(this);
        var cuurentTab = $this.index();
        var tabParent = $this.parent();
        var tabsContainer = tabParent.parent();
        var tabPanes;
        
        if(!$this.hasClass("tabs__tab-item--active")){
            
            tabParent.each(function(){
                
                tabParent.find('.tabs__tab-item--active').removeClass('tabs__tab-item--active');
                
                
            });
            
            tabPanes = tabsContainer.find('.tabs__panes');
           
            
            
            tabPanes.each(function(){
                
                tabPanes.find('.tabs__pane--active').removeClass("tabs__pane--active");
                
            });
            
            
            $this.addClass("tabs__tab-item--active");
            tabPanes.children().eq(cuurentTab).addClass("tabs__pane--active");
            
            
        }

    });


});