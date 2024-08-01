var laddaSubmitForm;
/*tableDataHtml*/
const generateTableDataHtml = function (data) {
    var itemHtml = '';
    let addressTmp = '';
    let typeTmp = '';
    $.each(data, function (key, value) {
        switch (value.typeId) {
            case 0: typeTmp = '<span class="badge badge-warning">Khác</span>'; break;
            case 1: typeTmp = '<span class="badge badge-danger">Nhà riêng</span>'; break;
            case 2: typeTmp = '<span class="badge badge-primary">Văn phòng</span>'; break;
            default: break;
        }
        addressTmp = `${value.addressText}, ${value.wardObj ? value.wardObj.name : ''}, ${value.districtObj ? value.districtObj.name : ''}, ${value.provinceObj ? value.provinceObj.name : ''}`;
        itemHtml +=
            ` <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6" id="tr_address_item_${value.id}">
                     <div class="address-box">
                         <div>
                             <div class="label">
                                 <label style="padding: 6px; font-size: 12px;">${typeTmp}</label>
                             </div>

                             <div class="table-responsive address-table">
                                 <table class="table">
                                     <tbody>
                                         <tr>
                                             <td style="font-size: 15px" colspan="2">${IsNullOrEmty(value.name) ? "" : value.name}</td>
                                         </tr>

                                         <tr>
                                             <td class="fw-bolder">Địa chỉ :</td>
                                             <td>
                                                 <p data-bs-toggle="tooltip" data-bs-placement="right" title="${addressTmp}">${value.isDefault === 1 ? ' ' : ''}${addressTmp}
                                                 </p>
                                             </td>
                                         </tr>

                                         <tr>
                                             <td class="fw-bolder">Điện thoại:</td>
                                             <td>${value.phoneNumber}</td>
                                         </tr>
                                     </tbody>
                                 </table>
                             </div>
                         </div>

                         <div class="button-group">
                             <a class="btn btn-sm snip15823 add-button w-100" onclick="ShowEditModal(this,'${value.id}')" <i data-feather="edit"></i>
                                 Sửa</a>
                             <a class="btn btn-sm snip15824 add-button w-100" onclick="Delete('${value.id}')"><i data-feather="trash-2"></i>
                                 Xóa</a>
                         </div>
                     </div>
            </div>`;
    });
    return itemHtml;
}

$(document).ready(function () {

    LoadListData();
    /*    InitValidation();*/

});

//Load list data
function LoadListData() {
    try {
        ShowLoadingBody("#tbody_main_table");
        $.ajax({
            type: 'GET',
            url: '/Address/GetListDeliveryAddress',
            dataType: "json",
            success: function (response) {
                HideLoadingBody("#tbody_main_table");
                //Check Error code
                if (!CheckResponseIsSuccess(response)) {
                    document.getElementById("tbody_main_table").innerHTML =
                        `<tr>
                            <td colspan="5" class="text-center p-2">
                                <h4>Kết nối không ổn định</h4>
                                <button type="button" class="btn btn-sm btn-primary" 
                                    style="width:150px;border-radius:4px;" 
                                    onclick="LoadListData();$(this).parent().remove();">Tải lại
                                </button>
                            </td>
                        </tr>`;
                    return false;
                }

                var listData = response.data;
                if (listData != null && listData.length > 0) {
                    document.getElementById("tbody_main_table").innerHTML = generateTableDataHtml(listData);
                } else {
                    document.getElementById("tbody_main_table").innerHTML =
                        `<tr>
                            <td colspan="5" class="text-center p-2">
                                Sổ địa chỉ của bạn chưa có dữ liệu. Hãy thêm mới đia chỉ mặt định.
                            </td>
                        </tr>`;
                }
            },
            error: function (err) {
                HideLoadingBody("#tbody_main_table");
                document.getElementById("tbody_main_table").innerHTML =
                    `<tr>
                        <td colspan="5" class="text-center p-2">
                            <h4>Kết nối không ổn định</h4>
                            <button type="button" class="btn btn-sm btn-primary"
                                style="width:150px;border-radius:4px;"
                                onclick="LoadListData();$(this).parent().remove();">Tải lại
                                    </button>
                        </td>
                     </tr >`;
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    } catch (e) {
        document.getElementById("tbody_main_table").innerHTML =
            `<tr>
                <td colspan="5" class="text-center p-2">
                    <h4>Kết nối không ổn định</h4>
                    <button type="button" class="btn btn-sm btn-primary" 
                        style="width:150px;border-radius:4px;" 
                        onclick="LoadListData();$(this).parent().remove();">Tải lại
                    </button>
                </td>
            </tr>`;
        console.log("Error when load data!");
    }
}

function ShowAddModal(elm) {
    let text = $(elm).html();
    $(elm).attr('onclick', ''); $(elm).html(_loadAnimationSmallHtml);
    $.get(`/Address/P_Add`).done(function (response) {
        $(elm).html(text); $(elm).attr('onclick', `ShowAddModal(this)`);
        if (response.result === -1 || response.result === 0) {
            CheckResponseIsSuccess(response); return false;
        }
        $('#div_view_panel').html(response);
        //$('.selectpicker').selectpicker();

        $('.select2').select2({ language: "vi" });

        $('#div_main_table').fadeOut(200);
        $('#div_view_panel').fadeIn(200);
        InitSubmitEditForm();
        let latitude = 0;
        let longitude = 0;
        initialize('#form_data_add', latitude, longitude, 17);
        listenOnchangeAddress('#form_data_add');
        $('#form_data_add').on('submit', function (e) {

            e.preventDefault();
            e.stopImmediatePropagation();
            let $formElm = $('#form_data_add');
            $('#form_data_add').addClass('was-validated')
            var validateDropdown = ValidateDropDownAddress(document.getElementById('form_data_add').elements, '#form_data_add');
            if (!validateDropdown) { ShowToastNoti('warning', '', _resultActionResource.PleaseWrite); return false; }
            let formData = new FormData($formElm[0]);
            laddaSubmitForm = Ladda.create(document.querySelector('#btn_submit_form_add'));
            laddaSubmitForm.start();
            $.ajax({
                url: '/Address/P_Add',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    laddaSubmitForm.stop();
                    if (!CheckResponseIsSuccess(response)) return false;
                    ShowToastNoti('success', '', _resultActionResource.AddSuccess);
                    CloseModal();
                    LoadListData();
                }, error: function (err) {
                    laddaSubmitForm.stop();
                    CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
                }
            });
        });

        //Init bootstrap max length
        $('form input[type="text"]').maxlength({
            alwaysShow: !0,
            warningClass: "badge badge-success",
            limitReachedClass: "badge badge-danger"
        });
    }).fail(function (err) {
        $(elm).html(text); $(elm).attr('onclick', `ShowAddModal(this)`);
        CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
    });
}


//Show edit address modal
function ShowEditModal(elm, id) {
    let text = $(elm).html();
    $(elm).attr('onclick', ''); $(elm).html(_loadAnimationSmallHtml);
    $.get(`/Address/P_Edit/${id}`).done(function (response) {
        $(elm).html(text); $(elm).attr('onclick', `ShowEditModal(this, '${id}')`);
        if (response.result === -1 || response.result === 0) {
            CheckResponseIsSuccess(response); return false;
        }
        $('#div_view_panel').html(response);
        //$('.selectpicker').selectpicker();
        $('.select2').select2({ language: "vi" });

        $('#div_main_table').fadeOut(200);
        $('#div_view_panel').fadeIn(200);
        InitSubmitEditForm();
        let latitude = parseFloat($('#form_data_edit [name="latitude"]').val());
        let longitude = parseFloat($('#form_data_edit [name="longitude"]').val());
        initialize('#form_data_edit', latitude, longitude, 17);
        listenOnchangeAddress('#form_data_edit');

        //Init bootstrap max length
        $('form input[type="text"]').maxlength({
            alwaysShow: !0,
            warningClass: "badge badge-success",
            limitReachedClass: "badge badge-danger"
        });
    }).fail(function (err) {
        $(elm).html(text); $(elm).attr('onclick', `ShowEditModal(this, '${id}')`);
        CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
    });
}


//Init submit edit form
function InitSubmitEditForm() {
    $('#form_data_edit').on('submit', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        let $formElm = $('#form_data_edit');
        var validateDropdown = ValidateDropDownAddress(document.getElementById('form_data_edit').elements, '#form_data_edit');
        if (!validateDropdown) { ShowToastNoti('warning', '', _resultActionResource.PleaseWrite); return false; }
        let formData = new FormData($formElm[0]);
        laddaSubmitForm = Ladda.create(document.querySelector('#btn_submit_form_edit'));
        laddaSubmitForm.start();
        $.ajax({
            url: '/Address/P_Edit',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                laddaSubmitForm.stop();
                if (!CheckResponseIsSuccess(response)) return false;
                ShowToastNoti('success', '', _resultActionResource.UpdateSuccess);
                CloseModal();
                LoadListData();
            }, error: function (err) {
                laddaSubmitForm.stop();
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    });
}

//Delete
function Delete(id) {
    swal.fire({
        title: "Bạn có muốn xóa địa chỉ này?",
        text: "",
        type: "warning",
        showCancelButton: !0,
        confirmButtonText: "Xóa",
        cancelButtonText: "Không",
        confirmButtonClass: "btn btn-danger mx-1 mt-2",
        cancelButtonClass: "btn btn-outline-secondary mx-1 mt-2",
        reverseButtons: true,
        buttonsStyling: !1,
        showLoaderOnConfirm: true,
        preConfirm: function () {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: 'POST',
                    url: '/Address/Delete',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    success: function (response) {
                        if (!CheckResponseIsSuccess(response)) {
                            resolve();
                            return false;
                        }
                        RemoveRowUI(id);
                        resolve();
                    },
                    error: function (err) {
                        CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
                        resolve();
                    }
                });
            });
        }
    });
}

//Check validate dropdown
function ValidateDropDownAddress(elmForm, form) {
    var isValid = true;
    var $name = $(form + ' #ul_parsley_name');
    var $phonenumber = $(form + ' #ul_parsley_phonenumber');
    var $addresstext = $(form + ' #ul_parsley_addresstext');
    var $province = $(form + ' #ul_parsley_province');
    var $district = $(form + ' #ul_parsley_district');
    var $ward = $(form + ' #ul_parsley_ward');

    $(form + ' #name').on('keyup', function () {
        let value = $(this).val();
        CheckRequired($name, value)
    });
    $(form + ' #phoneNumber').on('keyup', function () {
        let value = $(this).val();
        if (!IsNullOrEmty(value)) {
            if (!/^[0-9]{3,12}$/.test(value))
                $($phonenumber.find('li')[1]).css('display', 'block')
            else
                $($phonenumber.find('li')[1]).css('display', 'none');
            $($phonenumber.find('li')[0]).css('display', 'none');
        } else
            $($phonenumber.find('li')[0]).css('display', 'block'), $($phonenumber.find('li')[1]).css('display', 'none');
    });
    $(form + ' #addressText').on('keyup', function () {
        let value = $(this).val();
        CheckRequired($addresstext, value);
    });
    $(form + ' #provinceId').on('change', function () {
        let value = $(this).val();
        CheckRequired($province, value);
        setTimeout(function () {
            let district = $(form + ' #districtId');
            let ward = $(form + ' #wardId')
            CheckRequired($district, district.val());
            CheckRequired($ward, ward.val());
        }, 200);
    });
    $(form + ' #districtId').on('change', function () {
        let value = $(this).val();
        CheckRequired($district, value);
        setTimeout(function () {
            let ward = $(form + ' #wardId');
            CheckRequired($ward, ward.val());
        }, 200);
    });
    $(form + ' #wardId').on('change', function () {
        let value = $(this).val();
        CheckRequired($ward, value);
    });

    if (!CheckRequired($name, elmForm.name.value)) isValid = false;
    if (!CheckRequired($addresstext, elmForm.addressText.value)) isValid = false;
    if (!CheckRequired($province, elmForm.provinceId.value)) isValid = false;
    if (!CheckRequired($district, elmForm.districtId.value)) isValid = false;
    if (!CheckRequired($ward, elmForm.wardId.value)) isValid = false;

    if (!IsNullOrEmty(elmForm.phoneNumber.value)) {
        if (!/^[0-9]{3,12}$/.test(elmForm.phoneNumber.value))
            $($phonenumber.find('li')[1]).css('display', 'block'), isValid = false;
        else
            $($phonenumber.find('li')[1]).css('display', 'none');
        $($phonenumber.find('li')[0]).css('display', 'none');
    } else
        $($phonenumber.find('li')[0]).css('display', 'block'), $($phonenumber.find('li')[1]).css('display', 'none'), isValid = false;

    return isValid;
}

//Check required value
function CheckRequired(elmError, value) {
    let isValid = true;
    if (IsNullOrEmty(value))
        elmError.css('display', 'block'), isValid = false;
    else
        elmError.css('display', 'none');
    return isValid;
}

//Show overlay loading button
function ShowLoadingBody(elm) {
    var $loading = $($(elm).children()[0]);
    var trBody =
        `<tr>
            <td colspan="5">${_loadingButtonOverlay}</td>
        </tr>`
    if (!$loading.hasClass('overlay-loading-button')) {
        if ($(elm).hasClass('fa-refresh'))
            $(elm).removeAttr('class');
        $(elm).prepend(trBody);
        $($(elm).children().children().children()[0]).fadeIn(200);
    }
}

//Hide overlay
function HideLoadingBody(elm) {
    var $loading = $($(elm).children()[0]);
    if ($loading.hasClass('overlay-loading-button')) {
        $loading.fadeOut(200);
        setTimeout(function () {
            $loading.remove();
        }, 250);
    }
}

//Closse modal
function CloseModal() {
    $('#div_main_table').fadeIn(200);
    $('#div_view_panel').fadeOut(200);
    setTimeout(function () {
        $('#div_view_panel').html('');
    }, 200);
}

//On change province form
function OnChangeProvinceFormEvent(elm) {
    /* let $formElement = $('#form_data_add_address');*/
    $('select[name="wardId"]').html('<option value="0">--Chọn--</option>');
    $('select[name="wardId"]').attr('disabled', true);
    $('select[name="wardId"]').trigger("refesh");

    ShowOverlay3Dot('#div_zone_district');
    $.ajax({
        type: 'GET',
        url: '/Address/GetListDistrictOptionHtml',
        data: {
            id: $(elm).val(),
        },
        dataType: 'json',
        success: function (response) {
            HideOverlay3Dot('#div_zone_district');
            if (!CheckResponseIsSuccess(response)) return false;
            if (!IsNullOrEmty(response.data)) {
                $('select[name="districtId"]').html('<option value="0">--Chọn--</option>' + response.data);
                $('select[name="districtId"]').attr('disabled', false);
                $('select[name="districtId"]').trigger("refesh");
            }
        },
        error: function (err) {
            HideOverlay3Dot('#div_zone_district');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}


//On change district form
function OnChangeDistrictFormEvent(elm) {
    let $formElement = $('form_data_add');
    ShowOverlay3Dot('#div_zone_ward');
    $.ajax({
        type: 'GET',
        url: '/Address/GetListWardOptionHtml',
        data: {
            id: $(elm).val(),
        },
        dataType: 'json',
        success: function (response) {
            HideOverlay3Dot('#div_zone_ward');
            if (!CheckResponseIsSuccess(response)) return false;
            if (!IsNullOrEmty(response.data)) {
                $('select[name="wardId"]').html('<option value="0">--Chọn--</option>' + response.data);
                $('select[name="wardId"]').attr('disabled', false);
                $('select[name="wardId"]').trigger("refesh");
            }
        },
        error: function (err) {
            HideOverlay3Dot('#div_zone_ward');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

function RemoveRowUI(id) {
    //Remove row
    $('#tr_address_item_' + id).remove();

    //Check none record
    if ($('#tbody_main_table').find('tr').length === 0) {
        document.getElementById("tbody_main_table").innerHTML =
            `<tr>
                <td colspan="5" class="text-center p-2">
                    Sổ địa chỉ của bạn chưa có dữ liệu. Hãy thêm địa chỉ mới.
                </td>
            </tr>`;
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
