;(function ($) {

  $('.account-info-list .btn-acc').on("click", function () {
      $('.account-info-list ').toggleClass('editinfo');
      return false;
  })

  $('.box-credentials .btn-acc').on("click", function () {
      $('.box-credentials').toggleClass('editinfo');
      return false;
  })
  $('.box-credit-card .btn-acc').on("click", function () {
      $('.box-credit-card').toggleClass('editinfo');
      return false;
  })
  $('.header-account-info a.btn-acc.btn-referr').click(function () {
      var widthscr = $('body').innerWidth();

      if (widthscr < 768) {
          $("html, body").animate({scrollTop: 0}, "slow");
          $('body').addClass("top-header");
      }
  })

  function moveBoxAccountInfo() {
      var widthscr = $('body').innerWidth();
      //console.log(widthscr);

      if (widthscr < 1199 && widthscr > 1023) {
          $('.box-referrals').insertAfter('.account-info-list');
          $('.box-credit-card').insertAfter('.box-credentials');
          $('.box-invoice').insertAfter('.box-credit-card');
      }
      else if (widthscr < 1024) {
          $('.box-referrals').insertAfter('.box-credit-card');
      }
      if (widthscr > 1200) {
          $('.box-credit-card').appendTo('.col-acc-info.acc-col-right');
          $('.box-invoice').insertAfter('.box-credit-card');
          $('.box-referrals').insertAfter('.box-credentials');
      }
  }

  moveBoxAccountInfo();

  // Share referrals
  $('.box-promote .fakebook').on("click", function () {
      $('.box-checkout-visible').css("display", "none");
      $('.box-checkout-visible.facebook').toggle();
      return false;
  });
  $('.box-promote .twitter').on("click", function () {
      $('.box-checkout-visible').css("display", "none");
      $('.box-checkout-visible.twitter').toggle();
      return false;
  });

  $('.box-promote .linkedin').on("click", function () {
      $('.box-checkout-visible').css("display", "none");
      $('.box-checkout-visible.linkedin').toggle();
      return false;
  });
  $('.box-promote .googleplus').on("click", function () {
      $('.box-checkout-visible').css("display", "none");
      $('.box-checkout-visible.googleplus').toggle();
      return false;
  });
  $('.box-promote .blogger').on("click", function () {
      $('.box-checkout-visible').css("display", "none");
      $('.box-checkout-visible.blogger').toggle();
      return false;
  });
// same height
  function sameHeightAccountInfoCol(){
      var widthscr = $('body').innerWidth();

      if (widthscr >= 1200) {
          var heightcenter = $('.col-md-4.col-acc-info.acc-col-left').innerHeight();
          //$('.box-credentials').css("min-height",(heightcenter/2) -20);
          $('.box-referrals').css("min-height",heightcenter - 400);
          //$('.box-credit-card').css("min-height",(heightcenter/2) -20);
          $('.box-invoice').css("min-height",heightcenter - 400);
      }

  }
  sameHeightAccountInfoCol();

  $(window).resize(function () {
      moveBoxAccountInfo();
      sameHeightAccountInfoCol();
  });
    
}(jQuery));