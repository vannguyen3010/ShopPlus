var laddaSubmitForm, laddaVerifiedCode;
var countResend = 0;
var $errorMessageVerified = $('#p_error_input_verified');
var $inputVerified = $('#input_verifed_code');
var $buttonVerified = $('#btn_verified_code');
var $buttonSubmitForm = $('#btn_submit_form');
var $inputPhonenumberReset = $('#input_phone_number_reset');
var $inputNewPassword = $('#input_new_password');
var keyVerified = 0;
var telephoneNumberVerified = null;

$(document).ready(function () {

    //Init ladda
    laddaSubmitForm = Ladda.create(document.querySelector('#btn_submit_form'));
    laddaVerifiedCode = Ladda.create(document.querySelector('#btn_verified_code'));

    //Check phone
    $buttonSubmitForm.on('click', function (event) {
        var value = $inputPhonenumberReset.val();
        if (IsNullOrEmty(value)) {
            ShowToastNoti('warning', '', 'Vui lòng nhập số điện thoại!');
            $inputPhonenumberReset.focus();
            return;
        }
        laddaSubmitForm.start();
        $.ajax({
            url: '/Account/CheckPhoneForgotPw',
            type: 'POST',
            data: {
                phoneNumber: value
            },
            success: function (response) {
                laddaSubmitForm.stop();
                if (!CheckResponseIsSuccess(response)) return false;
                keyVerified = response.data;
                telephoneNumberVerified = value;
                document.body.scrollTop = 0;
                $inputNewPassword.focus();
                $('#div_verified_code').fadeIn(100);
                $('#div_check_user').fadeOut(100);
            }, error: function (err) {
                laddaSubmitForm.stop();
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    });

    //On keyup input verified code
    $inputVerified.on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13)
            $buttonVerified.click();
        else
            if (IsNullOrEmty($(this).val()))
                $errorMessageVerified.text('Vui lòng nhập mã xác thực!');
            else
                $errorMessageVerified.text('');
    });

    //On keyup input phone_number_reset
    $inputPhonenumberReset.on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13)
            $buttonSubmitForm.click();
    });

    //On keyup input password
    $inputNewPassword.on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13)
            $buttonVerified.click();
    });

    //Submit verified code
    $buttonVerified.on('click', function () {
        var password = $inputNewPassword.val();
        var value = $inputVerified.val();
        if (IsNullOrEmty(password)) {
            ShowToastNoti('warning', '', 'Vui lòng nhập số mật khẩu mới!');
            return;
        }
        var regex = /^([^'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\-\s]+)$/;
        if (!regex.test(password)) {
            ShowToastNoti('warning', '', "Mật khẩu không được chứa ký tự dấu và khoảng trắng!");
            $inputNewPassword.focus();
            return;
        }
        if (IsNullOrEmty(value)) {
            $errorMessageVerified.text('Vui lòng nhập mã xác thực!');
            $inputVerified.focus();
            return;
        } else {
            $errorMessageVerified.text('');
        }

        laddaVerifiedCode.start();
        $inputVerified.prop('readonly', true);
        $.ajax({
            url: '/Account/ResetPassword',
            type: 'POST',
            data: {
                key: keyVerified,
                code: value,
                password: password,
                phoneNumber: telephoneNumberVerified
            },
            dataType: 'json',
            success: function (response) {
                laddaVerifiedCode.stop();
                $inputVerified.prop('readonly', false);
                CheckResponseIsSuccess(response);
                if (response.result === 1) {
                    ShowToastNoti('success', '', "Đổi mật khẩu thành công. Đang chuyển hướng...", 3000, 'topCenter');
                    setTimeout(function () {
                        location.href = '/account/signin';
                    }, 3000);
                    return;
                } else
                    $errorMessageVerified.text(response.error.message);
            }, error: function (err) {
                laddaVerifiedCode.stop();
                $inputVerified.prop('readonly', false);
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
        url: '/Account/ResendForgotPw',
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
        }, error: function (err) {
            $(elm).html('Gửi lại.');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//ShowPassword
function ShowPassword(elm) {
    var $pwd = $($($($(elm).parent()).parent()).children()[0]);
    if ($pwd.attr('type') === 'password') {
        $pwd.attr('type', 'text');
        $(elm).html('<i class="fa fa-eye-slash"></i>');
    } else {
        $pwd.attr('type', 'password');
        $(elm).html('<i class="fa fa-eye"></i>');
    }
}
