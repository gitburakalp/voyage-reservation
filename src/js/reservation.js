var backUrl = 'https://www.google.com';
var btnSubmit = document.querySelector('#btnSubmit');
var reservationForm = document.querySelector('#reservationForm');
var currency = '€';
var lang = $('html').attr('lang');
var reservationIsSuccess = false;
var telRegex = /^[0,9]$/;

var roomVal = {
  tr: 'ODA ',
  en: 'ROOM ',
  de: 'ROOM ',
  ru: 'ROOM ',
};

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

document.addEventListener('DOMContentLoaded', function () {
  checkReservationSuccess(reservationIsSuccess);

  btnSubmit.addEventListener('click', function (e) {
    if (reservationForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();

      reservationForm.classList.add('has-error');

      if ($('#reservationForm').hasClass('has-error')) {
        $('html,body').animate(
          {
            scrollTop: $('#reservationForm input:not(:valid)').eq(0).offset().top - 100,
          },
          750,
        );
      }

      $('#reservationForm')
        .find('[data-target-section]')
        .each(function () {
          $(this).find('input:not(.valid)').length != 0 ? $(this).addClass('has-error') : '';
        });
    }

    $('#reservationForm')
      .find('[data-target-section]')
      .each(function () {
        $(this)
          .find('input')
          .on('change', function () {
            $(this).is(':valid') ? $(this).parent().removeClass('has-error') : $(this).parent().addClass('has-error');
          });
      });
  });

  initModals();
  initHourList();
  plusMinusInit();
  specialDayListInit();
});

function checkReservationSuccess(isSuccess) {
  if (isSuccess) {
    $('#successModal').addClass('is-shown');
    $('html,body').addClass('overflow-hidden');
  }

  $('#successModal .btn--default').on('click', function () {
    $('#successModal').removeClass('is-shown');
    $('html,body').removeClass('overflow-hidden');
  });
}

function initModals() {
  var $htmlBody = $('html,body');
  var $dismiss = $("[data-prop='dismiss']");

  $('[data-toggle=modal]').on('click', function () {
    var target = $(this).data('target');
    var targetSection = $(this).data('target-section');

    $htmlBody.animate(
      {
        scrollTop: 0,
      },
      0,
    );

    $htmlBody.addClass('overflow-hidden');
    $(target).addClass('is-shown');
    $(target).find(targetSection).removeClass('d-none');
  });

  $dismiss.on('click', function () {
    if ($('.offset-modal').hasClass('is-shown')) {
      $('.offset-modal').removeClass('is-shown');
      clearSelectedValues();

      $('.offset-modal .modal-body [class*=-section]').addClass('d-none');
      $htmlBody.removeClass('overflow-hidden');
    } else {
      window.location.href = backUrl;
    }
  });
}

function initHourList() {
  $('.hour-list').each(function () {
    $(this)
      .find('.hour-list-item')
      .on('click', function () {
        if ($(this).hasClass('active')) {
          $(this).toggleClass('active');
          $(this).closest('[class*=-section]').find('.modal-footer').addClass('mode--passive');
        } else {
          $('.hour-list-item').removeClass('active');
          $(this).closest('[class*=-section]').find('.modal-footer').addClass('mode--passive');

          $(this).addClass('active');
          $(this).closest('[class*=-section]').find('.modal-footer').removeClass('mode--passive');
        }
      });
  });
}

function plusMinusInit() {
  $('.minus-plus-block').each(function () {
    var $this = $(this);
    var max = $(this).find('input').data('max');
    var totalPrice = 0;

    $this.find('[id*=AdultCount]').each(function () {
      var thisVal = $(this).val();

      if (thisVal == 0) {
        $(this).parent().closest('.row').nextAll().addClass('mode--passive');
      }
    });

    $this.find('[class*=-icon]').on('click', function () {
      var isMinus = $(this).data('prop') == 'minus';
      var $inp = $(this).parent().find('input');

      var count = $inp.val();
      var thisPrice = $inp.data('price');
      var isAdultSibling = $(this).parent().find('[id*=AdultCount]').length;

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
      }

      var adultCount = $(this).closest('[class*=-section]').find('[id*=AdultCount]').val();

      if (adultCount != 0) {
        isAdultSibling ? $(this).closest('.row').nextAll().removeClass('mode--passive') : '';
        $(this).closest('[class*=-section]').find('.modal-footer').removeClass('mode--passive');
      } else {
        isAdultSibling ? $(this).closest('.row').nextAll().addClass('mode--passive') : '';
        $(this).closest('[class*=-section]').find('.modal-footer').addClass('mode--passive');
      }

      $('#inpTotalPrice').val(totalPrice);
      $('#spanTotalPrice').text(totalPrice + currency);
    });
  });
}

function specialDayListInit() {
  $('.special-day-list').each(function () {
    $(this)
      .find('.special-day-list-item')
      .on('click', function () {
        $('.special-day-list-item').removeClass('active');
        $(this).addClass('active');

        $(this).closest('[class*=-section]').find('.modal-footer').removeClass('mode--passive');
      });
  });
}

function clearSelectedValues() {
  $('.offset-modal')
    .find('.modal-body .container > *:not(.d-none)')
    .each(function () {
      $(this).find('.active').removeClass('active');
      $(this).find('.modal-footer').addClass('mode--passive');

      $(this).find('[id*=Count]').val(0);
      $(this).find('[id*=AdultCount]').closest('.row').nextAll().addClass('mode--passive');

      $(this).find('#inpTotalPrice').val(0);
      $(this)
        .find('#spanTotalPrice')
        .text('0 ' + currency);
      $(this)
        .find('#totalText')
        .text('0 ' + adultValues[lang]);

      $('html,body').removeClass('overflow-hidden');
      $('.offset-modal .modal-body .container > *').addClass('d-none');
    });
}

$('.modal-footer .btn--default').on('click', function () {
  var type = $(this).closest('[class*=-section]').attr('class');
  var selectedVal = '';

  switch (type) {
    case 'hour-select-section':
      selectedVal = $('.hour-list-item.active').find('.hour-list-link').text().trim();

      $('[data-target-section=".' + type + '"]')
        .find('input')
        .val(selectedVal);
      break;
    case 'adult-select-section':
      selectedVal = $('#totalText').text().trim();

      $('[data-target-section=".' + type + '"]')
        .find('input')
        .val(selectedVal);
      break;
    case 'special-day-section':
      selectedVal = $('.special-day-list-item.active').find('.special-day-list-link').text().trim();

      $('[data-target-section=".' + type + '"]')
        .find('label')
        .text(selectedVal);
      break;
    case 'add-room-section':
      selectedVal = $('#inpRoomNo').val().trim();

      $('[data-target-section=".' + type + '"]')
        .find('input')
        .val(selectedVal);

      $('[data-target-section=".' + type + '"]')
        .find('label')
        .text(roomVal[lang] + selectedVal);
      break;
  }

  $('.offset-modal').removeClass('is-shown');
  clearSelectedValues();
});

$('.room-section').each(function () {
  var $this = $(this);

  $(this)
    .find('#inpRoomNo')
    .on('focusout', function () {
      if ($(this).val() != '') {
        $this.addClass('is-valid');
      } else {
        $this.removeClass('is-valid');
      }
    });
});
