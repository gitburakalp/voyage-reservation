var btnSubmit = document.querySelector('#btnSubmit');
var reservationForm = document.querySelector('#reservationForm');

document.addEventListener('DOMContentLoaded', function () {
  btnSubmit.addEventListener('click', function (e) {
    alert(reservationForm.checkValidity());
    if (reservationForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();

      reservationForm.classList.add('has-error');
    }
  });
});

var telRegex = /^[0,9]$/;
