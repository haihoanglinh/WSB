/*

@author: Hossein Hashemi

*/


function progressButton(state) {
    var $this = $('.js-widget-contact-form-submit');
    var stateIcon;
    
     
    
    if (state){
        stateIcon = $this.find('.widget-contact-form__state-success');
    }else{
        stateIcon = $this.find('.widget-contact-form__state-error');
    }
    
    
    var stateError = $this.find('.widget-contact-form__state-error');
    var progressBtn = new TimelineLite({
        onComplete: hideSuccessMessage
    });

    progressBtn.to($this, 0.1, {
        paddingRight: '55px',
        ease: Expo.easeOut
    }, 0.5).to(stateIcon, 1, {
                opacity: '1'
            },2);

    function hideSuccessMessage() {
        progressBtn.reverse();
    }

}


//this script just for demo Animation progress button
$('.js-widget-contact-form-submit').click(function(){
    
    progressButton();
    
    
});