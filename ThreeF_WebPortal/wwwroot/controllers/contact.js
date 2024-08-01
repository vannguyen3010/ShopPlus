//Init ladda
var laddaSubmitForm = Ladda.create(document.querySelector('#btn_submit_form'));

$(document).ready(function () {
    //Init bootstrap max length
    $('#form_data input[type="text"],input[type="email"],textarea').maxlength({
        alwaysShow: !0,
        warningClass: "text-danger",
        limitReachedClass: "text-danger"
    });

    //Init validation form parsley
  /*  $('#form_data').parsley();*/

    InitValidation();
    //Submit form
    $('#form_data').on('submit', function (e) {
        e.preventDefault();
        let $formElm = $('#form_data');
        let isvalidate = CheckValidationUnobtrusive($formElm);
        if (!isvalidate) { ShowToastNoti('warning', '', _resultActionResource.PleaseWrite); return false; }
        let formData = new FormData($formElm[0]);
        laddaSubmitForm.start();
        $.ajax({
            url: '/Contact/SubmitContact',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                laddaSubmitForm.stop();
                if (!CheckResponseIsSuccess(response)) return false;
                ResetForm("#form_data")
                $('#modal_send_success').modal('show');
            }, error: function (err) {
                laddaSubmitForm.stop();
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    });

});

function InitMap() {
    var marker, i, infowindow;

    var locations = [
        ['', LATITUDE, LONGITUDE, 1],
        //['<b>OFFICE <span style="color:#f2c21a">H2A</span></b>', 10.959761222941351, 106.81142493967435, 2]
    ];
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: new google.maps.LatLng(LATITUDE, LONGITUDE),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            animation: google.maps.Animation.BOUNCE,
            //icon: '~/images/icon/map-marker2.png',
            map: map
        });

        if (!IsNullOrEmty(locations[i][0])) {
            google.maps.event.addListener(marker, 'onload', (function (marker, i) {
                infowindow = new google.maps.InfoWindow();
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            })(marker, i));
        }
    }
}


function InitValidation() {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
}

function ResetForm(formElm) {
    $(formElm).trigger('reset');
    RemoveClassValidate(formElm);
}