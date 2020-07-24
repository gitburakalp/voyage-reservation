var btnSubmit = document.querySelector('#btnSubmit');
var reservationForm = document.querySelector('#reservationForm');
var currency = '€';
var lang = $('html').attr('lang');

document.addEventListener('DOMContentLoaded', function () {
  btnSubmit.addEventListener('click', function (e) {
    alert(reservationForm.checkValidity());
    if (reservationForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();

      reservationForm.classList.add('has-error');
    }
  });

  initModals();
  initHourList();
  plusMinusInit();
});

var telRegex = /^[0,9]$/;

function initHourList() {
  $('.hour-list').each(function () {
    $(this)
      .find('.hour-list-item')
      .on('click', function () {
        if ($(this).hasClass('active')) {
          $(this).toggleClass('active');
          $(this).closest('.offset-modal').find('.modal-footer').addClass('mode--passive');
        } else {
          $('.hour-list-item').removeClass('active');
          $(this).closest('.offset-modal').find('.modal-footer').addClass('mode--passive');

          $(this).addClass('active');
          $(this).closest('.offset-modal').find('.modal-footer').removeClass('mode--passive');
        }
      });
  });
}

function initModals() {
  $('[data-toggle="modal"]').each(function () {
    var target = $(this).data('target');
    var targetSection = $(this).data('target-section');
    var $dismiss = $("[data-prop='dismiss']");
    var $htmlBody = $('html,body');

    $(this).on('click', function () {
      $htmlBody.addClass('overflow-hidden');
      $htmlBody.animate(
        {
          scrollTop: 0,
        },
        0,
      );

      $(target).addClass('is-shown');
      $(target).find(targetSection).removeClass('d-none');
    });

    $dismiss.on('click', function () {
      if ($('.offset-modal').hasClass('is-shown')) {
        $('.offset-modal').removeClass('is-shown');
        $('.offset-modal .modal-body [class*=-section]').addClass('d-none');
        $htmlBody.removeClass('overflow-hidden');
      }
    });
  });
}

function plusMinusInit() {
  $('.minus-plus-block').each(function () {
    var $this = $(this);
    var max = $(this).find('input').data('max');
    var totalPrice = 0;
    var adultValues = {
      tr: ' Yetişkin',
      en: ' Adult',
      de: ' Adult',
      ru: ' Adult',
    };

    var childValues = {
      tr: ' Çocuk',
      en: ' Child',
      de: ' Child',
      ru: ' Child',
    };

    $this.find('[class*=-icon]').on('click', function () {
      var isMinus = $(this).data('prop') == 'minus';
      var $inp = $(this).parent().find('input');

      var count = $inp.val();
      var thisPrice = $inp.data('price');

      totalPrice = $('#inpTotalPrice').val() == '' ? 0 : parseInt($('#inpTotalPrice').val());

      if (isMinus && count >= 1) {
        count--;
        totalPrice = totalPrice - thisPrice;
      } else if (!isMinus && count < max) {
        count++;
        totalPrice = totalPrice + thisPrice;
      }

      $inp.val(count);

      var adultCountVal = $('#inpAdultCountValue').val();
      var childCountVal = $('#inpChildCountValue').val();
      var babyCountVal = $('#inpBabyCountValue').val();

      if (adultCountVal != 0) {
        var childCount = parseInt(childCountVal) + parseInt(babyCountVal);
        var childText = childCount != 0 ? ' + ' + childCount + childValues[lang] : '';

        $('#totalText').text(adultCountVal + adultValues[lang] + childText);
        $(this).closest('.offset-modal').find('.modal-footer').removeClass('mode--passive');
      } else {
        $(this).closest('.offset-modal').find('.modal-footer').addClass('mode--passive');
      }

      $('#inpTotalPrice').val(totalPrice);
      $('#spanTotalPrice').text(totalPrice + currency);
    });
  });
}
