var laddaSubmitForm, laddaSubmitFormChangePassword;

//Init dropify image
Dropzone.autoDiscover = false;
0 < $('[data-plugins="dropify"]').length && $('[data-plugins="dropify"]').dropify({
    messages: {
        default: '<span style="font-size:16px;">Chọn ảnh đại diện</span>',
        replace: "Chọn ảnh",
        remove: "Xóa",
        error: "Ảnh không hợp lệ"
    }, error: { fileSize: "Kích thước tối đa 5MB." }
});

$(document).ready(function () {

    //Set datetimePicker language default
    $.datetimepicker.setLocale('vi');
    jQuery('.form_data [name="birthday"]').datetimepicker({
        ownerDocument: document,
        contentWindow: window,
        value: '',
        rtl: false,
        timepicker: false,
        format: 'd-m-Y' //Y-m-d H:i:s
        //formatTime: 'H:i',
        //formatDate: 'yy-m-dd',
    });

    /*Config gallery image*/
    $(".image-popup").magnificPopup({
        type: "image",
        closeOnContentClick: !1,
        closeBtnInside: !1,
        mainClass: "mfp-with-zoom mfp-img-mobile",
        image: {
            verticalFit: !0,
            titleSrc: function (e) {
                return e.el.attr("title")
            }
        },
        gallery: {
            enabled: !0
        },
        zoom: {
            enabled: !0,
            duration: 300,
            opener: function (e) {
                return e.find("img")
            }
        }
    });

    //Init validation form parsley
    $('.form_data').parsley();

    //Init ladda
    laddaSubmitForm = Ladda.create(document.querySelector('#btn_submit_form'));

    //Submit form
    $('.form_data').on('submit', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        let $formElm = $('.form_data');
        $('.form_data').addClass('was-validated')
        let isvalidate = $formElm[0].checkValidity();
        if (!isvalidate) { ShowToastNoti('warning', '', _resultActionResource.PleaseWrite); return false; }
        let formData = new FormData($formElm[0]);
        let birthday = $('.form_data [name="birthday"]').val();
        formData.set('birthday', DateToYYYYMMDD(birthday));
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
                ShowToastNoti('success', '', 'Cập nhật thông tin thành công!');
                setTimeout(function myfunction() {
                    location.reload();
                },800)
                //RemoveClassValidate('#form_data');
                //$('#form_data #img_avatar_image').attr('src', IsNullOrEmty(response.data.imageObj?.relativeUrl) ? "/assets/images/error/avatar.png" : response.data.imageObj?.relativeUrl);
                //ShowHidePanel('#div_view_image', '#div_upload_image');
                //document.getElementById('imageId').value = response.data.imageId;
                //document.getElementById('imageFile').value = null;
                //$("#form_data .dropify-clear").trigger("click");
            }, error: function (err) {
                laddaSubmitForm.stop();
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    });

});

//Show change pass modal
function ShowChangePassModal(elm) {
    var htmlElm = $(elm).html();
    $(elm).attr('onclick', '');
    $(elm).html(_loadAnimationSmallHtml);
    $.ajax({
        type: 'GET',
        url: '/Account/P_ChangePassword',
        success: function (response) {
            $(elm).html(htmlElm);
            $(elm).attr('onclick', 'ShowChangePassModal(this)');
            if (response.result === -1 || response.result === 0) return CheckResponseIsSuccess(response);
            $('#div_body_modal_change_pw').html(response);
            $('#modal_change_pw').modal('show');
            laddaSubmitFormChangePassword = Ladda.create(document.querySelector('#btn_submit_form_change_password'));

            //Init event submit form
            InitSubmitChangePasswordForm();
        },
        error: function (err) {
            $(elm).html(htmlElm);
            $(elm).attr('onclick', 'ShowChangePassModal(this)');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//Change password form
function InitSubmitChangePasswordForm() {
    $('#form_data_change_password').on('submit', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        let $formElm = $('#form_data_change_password');
        let isvalidate = $formElm[0].checkValidity();
        if (!isvalidate) { ShowToastNoti('warning', '', _resultActionResource.PleaseWrite); return false; }
        var regex = /^([^'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\-\s]+)$/;
        var obj = document.getElementById('form_data_change_password').elements;
        if (obj.password.value === '') {
            ShowToastNoti("warning", "", "Nhập mật khẩu cũ!");
            $('#input_password').focus();
        } else if (!regex.test(obj.password.value)) {
            ShowToastNoti("warning", "", "Mật khẩu không được chứa ký tự dấu và khoảng trắng!");
            $('#input_password').focus();
        } else if (obj.newPassword.value === '') {
            ShowToastNoti("warning", "", "Nhập mật khẩu mới!");
            $('#input_new_password').focus();
        } else if (!regex.test(obj.newPassword.value)) {
            ShowToastNoti("warning", "", "Mật khẩu không được chứa ký tự dấu và khoảng trắng!");
            $('#newpassword').focus();
        } else if (obj.confirmPassword.value === '') {
            ShowToastNoti("warning", "", "Nhập lại mật khẩu!");
            $('#input_confirm_password').focus();
        } else if (obj.confirmPassword.value !== obj.newPassword.value) {
            ShowToastNoti("warning", "", "Nhập lại mật khẩu không khớp!");
            $('#input_confirm_password').focus();
        } else {
            let formData = new FormData($formElm[0]);
            laddaSubmitFormChangePassword.start();
            $.ajax({
                url: $formElm.attr('action'),
                type: $formElm.attr('method'),
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    laddaSubmitFormChangePassword.stop();
                    if (!CheckResponseIsSuccess(response)) return false;
                    $('#modal_change_pw').modal('hide');
                    ShowToastNoti('success', '', 'Đổi mật khẩu thành công');
                }, error: function (err) {
                    laddaSubmitFormChangePassword.stop();
                    CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
                }
            });
        }
    });
}

function RemoveAvatar() {
    swal.fire({
        title: "Xóa ảnh đại diện?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Không",
        confirmButtonClass: "btn btn-danger mt-2",
        cancelButtonClass: "btn btn-light ml-2 mt-2",
        buttonsStyling: false,
        showLoaderOnConfirm: true,
        preConfirm: function () {
            return new Promise(function (resolve, reject) {
                $('#form_data [name="imageId"], [name="imageSerialId"]').val(0);
                $('#img_avatar_image').attr('src', '/img_dev/error/avatar.png');
                resolve();
            });
        }
    });
}


function ShowPassword(elm) {
    var pass = $(elm).attr('data-forcus');
    if ($(pass).attr('type') === "password") {
        $(pass).attr('type', 'text');
        $($(elm).children()[0]).removeClass('fa-eye-slash').addClass('fa-eye');
    } else {
        $(pass).attr('type', 'password');
        $($(elm).children()[0]).removeClass('fa-eye').addClass('fa-eye-slash');
    }
}


