var backUrl = 'https://www.google.com';
var btnSubmit = document.querySelector('#btnSubmit');
var reservationForm = document.querySelector('#reservationForm');
var currency = '€';
var lang = $('html').attr('lang');
var reservationIsSuccess = false;
var telRegex = /^[0,9]$/;

var isBookable = false;

var roomVal = {
  tr: 'Oda ',
  en: 'Room ',
  de: 'Zimmer ',
  ru: 'Комната ',
};

var adultValues = {
  tr: ' Yetişkin',
  en: ' Adults',
  de: ' Erwachsene',
  ru: ' Взрослые',
};

var childValues = {
  tr: ' Çocuk',
  en: ' Child',
  de: ' Kinder',
  ru: ' Дети',
};

function setLayout() {
  //checkReservationSuccess(reservationIsSuccess);

  //isBookable ? $('.hidden-area').addClass('is-shown') : $('.hidden-area').removeClass('is-shown');

  //btnSubmit.addEventListener('click', function (e) {
  //    e.preventDefault();
  //    e.stopPropagation();

  //    if (isBookable) {
  //        $('.error-message').hide(200);
  //        $('.hidden-area').addClass('is-shown');

  //        if (reservationForm.checkValidity() === false) {
  //            reservationForm.classList.add('has-error');

  //            if ($('#reservationForm').hasClass('has-error')) {
  //                $('html,body').animate(
  //                    {
  //                        scrollTop: $('#reservationForm input:not(:valid)').eq(0).offset().top - 100,
  //                    },
  //                    750,
  //                );
  //            }

  //            $('#reservationForm')
  //                .find('[data-target-section]')
  //                .each(function () {
  //                    $(this).find('input:not(.valid)').length != 0 ? $(this).addClass('has-error') : '';
  //                });
  //        } else {
  //            $(reservationForm).submit();
  //        }
  //    } else {
  //        $('.error-message').show(200);
  //    }

  //    isBookable ? $('.hidden-area').addClass('is-shown') : $('.hidden-area').removeClass('is-shown');

  //    $('#reservationForm')
  //        .find('[data-target-section]')
  //        .each(function () {
  //            $(this)
  //                .find('input')
  //                .on('change', function () {
  //                    $(this).is(':valid') ? $(this).parent().removeClass('has-error') : $(this).parent().addClass('has-error');
  //                });
  //        });
  //});

  initModals();
  //initHourList();
  plusMinusInit();
  specialDayListInit();
}

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
    var title = $(this).find('label').text().trim();

    $('.header-title').text(title);

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
      $('.header-title').text('REZERVASYON YAP');
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
    // var max = $(this).find('input').data('max');
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
      var max = $this.find('input').data('max');

      //totalPrice = $('#inpTotalPrice').val() == '' ? 0 : parseInt($('#inpTotalPrice').val());

      if (isMinus && count >= 1) {
        count--;
        //totalPrice = totalPrice - thisPrice;
      } else if (!isMinus && count < max) {
        count++;
        //totalPrice = totalPrice + thisPrice;
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

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

$('.modal-footer .continue .btn--default').on('click', function () {
  var type = $(this).closest('[class*=-section]').attr('class');
  var selectedVal = '';

  switch (type) {
    case 'hour-select-section':
      selectedVal = $('.hour-list-item.active').find('.hour-list-link').text().trim();

      $('[data-target-section=".' + type + '"]')
        .find('input')
        .val(selectedVal);
      SetSession();

      break;
    case 'adult-select-section':
      selectedVal = $('#totalText').text().trim();

      $('[data-target-section=".' + type + '"]')
        .find('input')
        .val(selectedVal);
      SetGuestCounts();

      break;
    case 'special-day-section':
      selectedVal = $('.special-day-list-item.active').find('.special-day-list-link').text().trim();
      if (selectedVal) {
        $('[data-target-section=".' + type + '"]')
          .find('label')
          .text(selectedVal);

        SetSpecialDay();
      }

      break;
    case 'add-room-section':
      selectedVal = $('#inpRoomNo').val().trim();
      if (selectedVal) {
        $('[data-target-section=".' + type + '"]')
          .find('input')
          .val(selectedVal);

        $('[data-target-section=".' + type + '"]')
          .find('label')
          .text(roomVal[lang] + selectedVal);

        AddNewRoom();
      }
      $('#hdnReadyForBooking').val('true');
      $('#submitButtonRow').show();

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

$('[data-readonly="true"]').on('focus', function () {
  $(this).blur();
});

$('[data-readonly="true"]').on('keypress', function () {
  return false;
});

$('.dateRow').each(function () {
  var $birthdateDays = $('#selectBirthdateDay');
  var $birthdateMonth = $('#selectBirthdateMonth');
  var $birthdateYear = $('#selectBirthdateYear');

  var thisMonth = new Date().getMonth() + 1;
  var thisYear = new Date().getFullYear() - 18;

  $birthdateMonth.val(thisMonth);
  $birthdateYear.val(thisYear);

  function fillDays(month, year) {
    var thisDays = daysInMonth(month, year);

    for (let i = 1; i < thisDays + 1; i++) {
      $birthdateDays.append(`<option value="${i}">${i}</option>`);
    }
  }

  fillDays(thisMonth, thisYear);

  $birthdateMonth.change(function () {
    selectedMonth = $(this).val();
    selectedYear = $birthdateYear.val();

    $birthdateDays.empty();

    fillDays(selectedMonth, selectedYear);
  });

  $birthdateYear.change(function () {
    selectedMonth = $birthdateMonth.val();
    selectedYear = $(this).val();

    $birthdateDays.empty();

    fillDays(selectedMonth, selectedYear);
  });
});

function SelectSession(obj) {
  var id = $(obj).data('id');
  $('#hdnSessionId').val(id);
  initHourList();
}

function SetSession() {
  var id = $('#hdnSessionId').val();

  $.ajax({
    url: '/alacarte/selectsession/' + id,
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result === true) {
        console.log('Session Selected correctly');
      } else {
        console.log('Error occurred on session selection');
      }
    },
  });
}

function SetGuestCounts() {
  var guestCountsModel = {
    AdultCount: $('#inpAdultCountValue').val(),
    ChildCount: $('#inpChildCountValue').val(),
    InfCount: $('#inpBabyCountValue').val(),
  };

  $.ajax({
    url: '/alacarte/setguestcounts',
    type: 'POST',
    data: guestCountsModel,
    dataType: 'json',
    success: function (result) {
      if (result.succeed === true) {
        $('.error-message').hide();
      } else {
        $('.error-message').show(200);
        $('#spnErrorMsg').text(result.WarningMessage);
        $('.hidden-area').removeClass('is-shown');
      }
    },
  });
}

function AddNewRoom() {
  var newRoomModel = {
    Guests: {
      AdultCount: $('#inpAdultCountReservation').val(),
      ChildCount: $('#inpChildCountReservation').val(),
      InfCount: $('#inpBabyCountReservation').val(),
    },
    RoomNo: $('#inpRoomNo').val(),
  };

  $.ajax({
    url: '/alacarte/addnewroom',
    type: 'POST',
    data: newRoomModel,
    dataType: 'json',
    success: function (result) {
      if (result.succeed === true) {
        $('.error-message').hide();
      } else {
        $('.error-message').show(200);
        $('#spnErrorMsg').text(result.WarningMessage);
        $('.hidden-area').removeClass('is-shown');
      }
    },
  });
}

$('.special-day-list-link').on('click', function () {
  var id = $(this).data('id');
  $('#hdnSpecialDayId').val(id);
});

function SetSpecialDay() {
  var id = $('#hdnSpecialDayId').val();

  if (id) {
    $.ajax({
      url: '/alacarte/setspecialday/' + id,
      type: 'POST',
      dataType: 'json',
      success: function (result) {
        if (result === true) {
          $('.error-message').hide();
        } else {
          $('.error-message').show(200);
          $('#spnErrorMsg').text('Hata oluştu');
          $('.hidden-area').removeClass('is-shown');
        }
      },
    });
  }
}

$('#btnSubmit').on('click', function (e) {
  e.stopPropagation();
  e.preventDefault();

  var readyForReservation = $('#hdnReadyForBooking').val();

  if (readyForReservation === 'true') {
    $.ajax({
      url: '/alacarte/makereservation',
      type: 'POST',
      dataType: 'json',
      success: function (result) {
        if (result.succeed === true) {
          $('#successModal').addClass('is-shown');
          $('html,body').addClass('overflow-hidden');
          $('.error-message').hide();

          $('#spnResHour').text(result.reservationHour);
          $('#spnResCapacity').text(result.capacity);
          if (result.isFree !== true) {
            $('#spnResPrice').text(result.price + ' ' + result.currency);
          }
        } else {
          $('.error-message').show(200);
          $('#spnErrorMsg').text('Hata oluştu');
          $('.hidden-area').removeClass('is-shown');
        }
      },
    });
  } else {
    var alacarteModel = {
      TenantCode: $('#hdnTenantCode').val(),
      ServiceId: $('#hdnServiceId').val(),
      RoomNo: $('#inpRoomNumber').val(),
      Name: $('#inpName').val(),
      LastName: $('#inpLastName').val(),
      BirthDateYear: $('#selectBirthdateYear').val(),
      BirthDateMonth: $('#selectBirthdateMonth').val(),
      BirthDateDay: $('#selectBirthdateDay').val(),
    };
    var formAction = $(reservationForm).attr('action');
    $.ajax({
      url: formAction,
      type: 'POST',
      dataType: 'json',
      data: alacarteModel,
      success: function (result) {
        if (result.suitable === true) {
          $('.error-message').hide();
          $('.hidden-area').addClass('is-shown');
          setLayout();
          $.each(result.sessions, function (i, item) {
            $('.hour-list').append("<li class='hour-list-item'><a onclick='SelectSession(this)' class='hour-list-link' data-id=" + item.conditionId + '>' + item.formattedValue + '</a></li>');
          });

          var maxAdultCount = result.guest.adultCount + result.guest.unknownAgeCount;
          var maxChildCount = result.guest.childCount + result.guest.unknownAgeCount;
          var maxInfCount = result.guest.infCount + result.guest.unknownAgeCount;

          $('#inpAdultCountValue').attr('data-max', maxAdultCount);
          $('#inpChildCountValue').attr('data-max', maxChildCount);
          $('#inpBabyCountValue').attr('data-max', maxInfCount);

          $('.spanChildAgeRange').text(Math.ceil(result.guest.maxInfAge) + '-' + Math.ceil(result.guest.maxChildAge));
          $('.spanInfMaxAge').text(Math.ceil(result.guest.maxInfAge));

          $('#submitButtonRow').hide();
        } else {
          console.log(result.warningMessage);
          $('.error-message').show(200);
          $('#spnErrorMsg').text(result.warningMessage);
          $('#submitButtonRow').show();
        }
      },
      error: function (request, status, error) {
        $(reservationForm).addClass('has-error');

        $('.error-message').show(200);
        $('#spnErrorMsg').text('Lütfen gerekli alanları doldurunuz.');
        $('#submitButtonRow').show();
      },
    });
  }
});

$('#successModal').on('click', function () {
  $('body,html').removeClass('overflow-hidden');
  $(this).removeClass('is-shown');
});

$('.btn--close').on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  $('body,html').removeClass('overflow-hidden');
  $('.offset-modal').removeClass('is-shown');
  clearSelectedValues();
});
