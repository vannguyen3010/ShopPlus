var laddaSubmitForm, laddaVerifiedCode;
var countResend = 0;
var $errorMessageVerified = $('#p_error_input_verified');
var $buttonVerified = $('#btn_verified_code');
var keyVerified = 0;
var telephoneNumberVerified = null;
var passwordVerified = null;
var intervalCountDown = null;

var $inputVerified1 = $('#input_verified_code_1'),
    $inputVerified2 = $('#input_verified_code_2'),
    $inputVerified3 = $('#input_verified_code_3'),
    $inputVerified4 = $('#input_verified_code_4'),
    $inputVerified5 = $('#input_verified_code_5');
//Init ladda
var laddaSubmitForm = Ladda.create(document.querySelector('#btn_submit_form'));
$(document).ready(function () {

  
    laddaSubmitForm = Ladda.create(document.querySelector('#btn_submit_form'));
    laddaVerifiedCode = Ladda.create(document.querySelector('#btn_verified_code'));

    //Submit form
    $('#form_data').on('submit', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        let $formElm = $('#form_data');
        $('#form_data').addClass('was-validated')
       
        let isvalidate = $formElm[0].checkValidity();
        if (!isvalidate) { ShowToastNoti('warning', '', _resultActionResource.PleaseWrite); return false; }
        let formData = new FormData($formElm[0]);
        if (!$('#div_check_input_register').is(":checked")) {
            ShowToastNoti('warning', '', 'Vui lòng đồng ý với chính sách điều khoản của chúng tôi');
            return false;
        }
        
        laddaSubmitForm.start();
        $.ajax({
            url: $formElm.attr('action'),
            type: $formElm.attr('method'),
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                laddaSubmitForm.stop();
                if (!CheckResponseIsSuccess(response)) return false;
                keyVerified = response.data;
                telephoneNumberVerified = $formElm.find('[name="phoneNumber"]').val();
                passwordVerified = $formElm.find('[name="password"]').val();
                document.body.scrollTop = 0;
                document.getElementById('form_data').reset();
                RemoveClassValidate($formElm);
                $('#div_verified_code').fadeIn(100);
                $('#div_register_form').fadeOut(100);
            }, error: function (err) {
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });

    });

    //On keyup input verified code




    $inputVerified5.on('keyup', function (e) {
        if (!IsNullOrEmty($inputVerified1.val()) && !IsNullOrEmty($inputVerified2.val()) && !IsNullOrEmty($inputVerified3.val()) && !IsNullOrEmty($inputVerified4.val()) && !IsNullOrEmty($inputVerified5.val())) {
            if (e.key === 'Enter' || e.keyCode === 13)
                $buttonVerified.click();
            else
                if (IsNullOrEmty($(this).val()))
                    $errorMessageVerified.text('Vui lòng nhập mã xác thực!');
                else
                    $errorMessageVerified.text('');
        }
    });
    //Submit verified code
    $buttonVerified.on('click', function () {
        var value1 = $inputVerified1.val();
        var value2 = $inputVerified2.val();
        var value3 = $inputVerified3.val();
        var value4 = $inputVerified4.val();
        var value5 = $inputVerified5.val();

        var value = '';

        if (IsNullOrEmty(value1) && IsNullOrEmty(value2) && IsNullOrEmty(value3) && IsNullOrEmty(value4) && IsNullOrEmty(value5)) {
            $errorMessageVerified.text('Vui lòng nhập đầy đủ mã xác thực!');
            $inputVerified1.focus();
            $inputVerified2.focus();
            $inputVerified3.focus();
            $inputVerified4.focus();
            $inputVerified5.focus();
            return;
        } else {
            $errorMessageVerified.text('');
        }
        value = value1 + value2 + value3 + value4 + value5;
        laddaVerifiedCode.start();
        console.log(value);
        $inputVerified1.prop('readonly', true);
        $inputVerified2.prop('readonly', true);
        $inputVerified3.prop('readonly', true);
        $inputVerified4.prop('readonly', true);
        $inputVerified5.prop('readonly', true);
        $.ajax({
            url: '/Account/VerifedRegister',
            type: 'POST',
            data: {
                key: keyVerified,
                code: value,
                phoneNumber: telephoneNumberVerified,
                password: passwordVerified,
            },
            dataType: 'json',
            success: function (response) {
                laddaVerifiedCode.stop();
                $inputVerified1.prop('readonly', false);
                $inputVerified2.prop('readonly', false);
                $inputVerified3.prop('readonly', false);
                $inputVerified4.prop('readonly', false);
                $inputVerified5.prop('readonly', false);
                CheckResponseIsSuccess(response);
                if (response.result === 1)
                    AutoRedirectToLoginPage(response);
                else
                    $errorMessageVerified.text(response.error.message);
            }, error: function (err) {
                laddaVerifiedCode.stop();
                $inputVerified1.prop('readonly', false);
                $inputVerified2.prop('readonly', false);
                $inputVerified3.prop('readonly', false);
                $inputVerified4.prop('readonly', false);
                $inputVerified5.prop('readonly', false);
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    });

});

//Resend code
function ResendCode(elm) {
    countResend++;
    $(elm).html('Đang gửi...');
    $.ajax({
        url: '/Account/ResendVerifiedRegister',
        type: 'POST',
        data: {
            key: keyVerified
        },
        dataType: 'json',
        success: function (response) {
            $(elm).html('Gửi lại.');
            if (!CheckResponseIsSuccess(response)) return false;
            ShowToastNoti('success', '', 'Đã gửi!');
            if (countResend >= 2) {
                $(elm).remove();
                return false;
            }
        }, error: function () {
            $(elm).html('Gửi lại.');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//Auto redirect login
function AutoRedirectToLoginPage(res) {
    if (res.data2nd) { //Sign in success
        $('#div_signin_success_auto_redirect').css('display', 'block;');
        $('#div_auto_redirect_signin').css('display', 'none;');
    } else {
        $('#div_auto_redirect_signin').css('display', 'block;');
        $('#div_signin_success_auto_redirect').css('display', 'none;');
    }
    var $timeOutEl = $('.b_time_out_auto_login');
    $timeOutEl.html(5); //Set timeout by seconds
    $('#modal_register_success').modal('show');
    intervalCountDown = setInterval(function () {
        let value = parseInt($timeOutEl.eq(0).text());
        if (value > 0)
            $timeOutEl.html(value - 1);
        else {
            clearInterval(intervalCountDown);
            if (res.data2nd) { //Sign in success
                location.href = IsNullOrEmty(GetParameterByNameInUrl("returnUrl")) ? '/' : GetParameterByNameInUrl("returnUrl");
                return false;
            } else {
                location.href = '/account/signin';
            }
        }
    }, 1000);
}

function ShowPassword(elm) {
    var pass = $(elm).attr('data-forcus');
    if ($(pass).attr('type') === "password") {
        $(pass).attr('type', 'text');
        $(elm).removeClass('fa-eye-slash').addClass('fa-eye');
    } else {
        $(pass).attr('type', 'password');
        $(elm).removeClass('fa-eye').addClass('fa-eye-slash');
    }
}
