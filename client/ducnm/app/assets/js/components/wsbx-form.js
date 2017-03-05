$(document).ready(function(){
	$(function () {
        moment.locale('en',{
            weekdaysMin : "SUN_MON_TUE_WED_THU_FRI_SAT".split("_"),
            week: { dow: 1 }
        });
        $('#datetimepicker1').datetimepicker();
        $('#datetimepicker2').datetimepicker();
        $('#datetimepicker3').datetimepicker();
        $('#datetimepicker4').datetimepicker();
        $('#datetimepicker5').datetimepicker();
        $('#datetimepicker6').datetimepicker();
    });
})