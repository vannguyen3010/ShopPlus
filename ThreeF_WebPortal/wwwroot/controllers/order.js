var statusProcess = -2;
var pageCurrent = 1;
var pageSize = 10;
var isHaveNewData = false;
var detailLoading = false;
var detailElmSaveClick;
var detailOrderCurrentData;
var reasonListData = [];
function handleProcessStatusToText(value) {
    let statusTmp = '';
    switch (value) {
        case 0: statusTmp = 'Chờ xác nhận'; break;
        case 1: statusTmp = 'Đã tiếp nhận'; break;
        case 2: statusTmp = 'Đang vận chuyển'; break;
        case 3: statusTmp = 'Đã giao'; break;
        case 4: statusTmp = 'Đã hủy'; break;
        case 5: statusTmp = 'Trả hàng'; break;
        default: break;
    }
    return statusTmp;
}
function rawSelectCancelOption() {
    let html = '';
    reasonListData.forEach(function (item, index) {
        html += `<option value="${item.id}">${item.name}</option>`;
    });
    return html;
}
function tableDataHtml(data) {
    var shopItem = '';
    var productItem = '';
    var statusTmp = '';
    $.each(data, function (key, value) {
        productItem = '';
        value.orderItem.forEach(function (item, index) {
            let sizeTmp = '', colorTmp = '', typeNameTmp = '', priceTmp = '';
            priceTmp = item.discount > 0 ? CalDiscountPrice(item.price, item.discount) : FormatToVNDCustom(item.price);
            typeNameTmp = item.typeName != null && item.typeName.length > 30 ? item.typeName.substring(0, 30) + "..." : item.typeName;
            sizeTmp = item.sizeName != null && item.sizeName.length > 30 ? item.sizeName.substring(0, 30) + "..." : item.sizeName;
            colorTmp = item.colorName != null && item.colorName.length > 30 ? item.colorName.substring(0, 30) + "..." : item.colorName;
            productItem +=
                `<div class="col-12 row m-0 p-2" style="border: 1px solid #e0d9d9;">
                    <div class="col-auto p-0" style="width: 70px;height: 70px">
                        <img src="${item.productImage}" loading="lazy" class="img-fluid img-thumbnail" style="width:100%; height:100%; object-fit: cover" alt="${item.productName}"
                        onerror="this.onerror=null;this.src='/img_dev/error/product.png';">
                    </div>
                    <div class="col">
                        <div class="div_desktop_custom">
                            ${item.productName != null && item.productName.length > 40 ? item.productName.substring(0, 40) + "..." : item.productName}
                            ${!IsNullOrEmty(typeNameTmp) ? `<span class="col-auto badge badge-default" style="background: red">${typeNameTmp}</span>` : ""}
                            ${!IsNullOrEmty(sizeTmp) ? `<span class="col-auto badge badge-grey-color">${sizeTmp}</span>` : ""}
                            ${!IsNullOrEmty(colorTmp) ? `<span class="col-auto badge badge-default">${colorTmp}</span>` : ""}
                        </div>
                            <div class="div_desktop_custom">
                            ${!IsNullOrEmty(item.reasonDescription) ? `<small class="col-auto text_organge custom_css_div">${item.reasonDescription}</small>` : ""}
                             </div>
                        <div class="mobile-cart-content text-center row">
                            <span class="col-12">${item.productName != null && item.productName.length > 40 ? item.productName.substring(0, 40) + "..." : item.productName}</span>
                            ${!IsNullOrEmty(typeNameTmp) ? `<span class="col-auto badge badge-defaultr">${typeNameTmp}</span>` : ""}
                            ${!IsNullOrEmty(sizeTmp) ? `<span class="col-auto badge badge-grey-color">${sizeTmp}</span>` : ""}
                            ${!IsNullOrEmty(colorTmp) ? `<span class="col-auto badge badge-default">${colorTmp}</span>` : ""}

                            <div class="col-12 row m-0">
                                <div class="col">
                                    <small>SL: ${item.quantity}</small>
                                </div>
                                <div class="col">
                                    <small class="m-0">${priceTmp}</small>
                                </div>
                            </div>
                            ${!IsNullOrEmty(item.reasonDescription) ? `<small class="text-end text_organge">${item.reasonDescription}</small>` : ""}
                        </div>
                    </div>
                    <div class="col-md-2 col-lg-2 col-xl-2 div_desktop_custom">
                        <small class="text-muted">SL: ${item.quantity}</small>
                    </div>
                    <div class="col-md-2 col-lg-2 col-xl-2 div_desktop_custom" style="text-align:right;">
                        <span class="m-0">${priceTmp}</span>
                    </div>
                </div>`;
        });

        statusTmp = handleProcessStatusToText(value.processStatus);
        shopItem +=
            `<a href="javascript:void(0)" onclick="ViewDetail(event, this, '${value.id}')" class="col-12 a_row_hover div_zone_order_item">
                <div class="col-12 orderTitle d-flex justify-content-between">
                    <span class="mb-0" style="font-weight: 700;color: #d31212d1;">#${value.id} <small class="text-dark">${value.createdAt != null ? moment(value.createdAt).format('DD-MM-YYYY') : ""}</small></span>
                    <span class="mb-0 badge badge-info float-right text-white" style="background: #f95f00;">${statusTmp}</span>
                </div>
                ${productItem}
            </a>`;
    });

    return shopItem;
}
function tableCancelItemHtml(data) {
    var productItem = '';
    data.orderItem.filter(x => x.processStatus === 0).forEach(function (item, index) {
        let sizeTmp = '', colorTmp = '', priceTmp = '';
        priceTmp = item.discount > 0 ? CalDiscountPrice(item.price, item.discount) : FormatToVNDCustom(item.price);
        sizeTmp = item.sizeName != null && item.sizeName.length > 30 ? item.sizeName.substring(0, 30) + "..." : item.sizeName;
        colorTmp = item.colorName != null && item.colorName.length > 30 ? item.colorName.substring(0, 30) + "..." : item.colorName;
        productItem +=
            `<tr>
                <td class="col-1">
                    <div class="d-flex align-items-center">
                        <input type="checkbox" name="input_order_item_cancel" data-id="${item.id}" id="input_order_item_cancel_${item.id}" />
                        <label for="input_order_item_cancel_${item.id}"> </label>
                    <img src="${item.productImage}" style="width:50px; height:50px;object-fit: cover;" alt="${item.productName}"
                    onerror="this.onerror=null;this.src='/assets/images/error/product_1x1_medium.png';">
                    </div>
                </td>
                <td class="col" style="text-align:left;">
                    <label for="input_order_item_cancel_${item.id}">
                        ${item.productName != null && item.productName.length > 40 ? item.productName.substring(0, 40) + "..." : item.productName}
                        ${!IsNullOrEmty(sizeTmp) ? `<span class="badge badge-grey-color">${sizeTmp}</span>` : ""}
                        ${!IsNullOrEmty(colorTmp) ? `<span class="badge badge-default">${colorTmp}</span>` : ""}
                    </label>
                </td>
                 <td class="col-4">
                    <select name="ReasonId" id="ReasonId_${item.id}" data-none-results-text="Không tìm thấy kết quả phù hợp"
                            data-none-selected-text="Vui lòng chọn lý do" title="Vui lòng chọn lý do"
                            class="select_picker_custom form-control show-tick reasonList" data-style="border" data-live-search="false" data-size="10">
                            ${rawSelectCancelOption()}                                
                    </select>
                </td>
            </tr>`;
    });

    return productItem;
}
function loadDetailOrder(data) {
    var div_zone_order_item = '';
    var orderItem = '';
    productItem = '';
    var countItem = 0;
    var totalPrice = 0;
    data.orderItem.forEach(function (item, index) {
        countItem++;
        let sizeTmp = '', colorTmp = '', typeNameTmp = '', priceTmp = '', priceDiscount = 0, reasonCancel = '';
        priceDiscount = item.discount > 0 ? (item.price - item.discount) : item.price;
        priceTmp = FormatToVNDCustom(priceDiscount);
        typeNameTmp = item.typeName != null && item.typeName.length > 30 ? item.typeName.substring(0, 30) + "..." : item.typeName;
        sizeTmp = item.sizeName != null && item.sizeName.length > 30 ? item.sizeName.substring(0, 30) + "..." : item.sizeName;
        colorTmp = item.colorName != null && item.colorName.length > 30 ? item.colorName.substring(0, 30) + "..." : item.colorName;
        if (item.processStatus !== 4) //check is not cancel
            totalPrice += priceDiscount * item.quantity;
        if (IsNullOrEmty(data.reasonName) || data.reasonName === "--")
            if (item.processStatus === 4 || item.processStatus === 5)
                reasonCancel =
                    `<div class="col-12">
                        <div style="float: right">
                         <span class="m-0 text-danger">Đã hủy</span><span class="m-0"> - ${item.reasonName}</span>
                            <p class="text-break" style="font-style: italic;font-size:12px;">${IsNullOrEmty(item.reasonDescription) ? "" : item.reasonDescription}</p>
                        </div>
                       
                    </div>`;

        orderItem +=
            `<div class="col-12 row m-0 p-2 border-bottom border-white ${item.processStatus === 4 ? "deleted" : ""}">
                <div class="col-auto p-0">
                    <a href="/san-pham/${item.productNameSlug}-${item.productId}">
                        <img src="${item.productImage}" class="img-fluid img-thumbnail" style="width:60px; height:60px;object-fit: cover;" alt="${item.productName}" loading="lazy"
                                onerror="this.onerror=null;this.src='/img_dev/error/product.png';">
                    </a>
                </div>
                <div class="col">
                    <a href="/san-pham/${item.productNameSlug}-${item.productId}">
                        <div class="div_desktop_custom" style="color: black">
                            ${item.productName != null && item.productName.length > 40 ? item.productName.substring(0, 40) + "..." : item.productName}
                 
                            ${!IsNullOrEmty(typeNameTmp) ? `<span class="col-auto badge badge-default" style="background: #7faf5a;">${typeNameTmp}</span>` : ""}
                            ${!IsNullOrEmty(sizeTmp) ? `<span class="col-auto badge badge-grey-color">${sizeTmp}</span>` : ""}
                            ${!IsNullOrEmty(colorTmp) ? `<span class="col-auto badge badge-default">${colorTmp}</span>` : ""}
                        </div>
                       ${!IsNullOrEmty(item.reasonDescription) ? `<span class="col-auto badge badge-warning" style="background: red">${item.reasonDescription}</span>` : ""}
                        <div class="mobile-cart-content text-right row">
                            <span class="col-12 px-1">${item.productName != null && item.productName.length > 40 ? item.productName.substring(0, 40) + "..." : item.productName}</span>
                            ${!IsNullOrEmty(typeNameTmp) ? `<span class="col-auto badge badge-default">${typeNameTmp}</span>` : ""}
                            <div class="col-12 m-0 p-0 row">
                                <div class="col px-1">
                                    <small>SL: ${item.quantity}</small>
                                </div>
                                <div class="col px-1">
                                    <small class="m-0">${priceTmp}</small>
                                </div>

                            </div>
                        ${!IsNullOrEmty(item.reasonDescription) ? `<span class="col-auto badge badge-danger">${item.reasonDescription}</span>` : ""}
                        </div>
                    </a>
                </div>
                <div class="col-md-2 col-lg-2 col-xl-2 div_desktop_custom">
                    <small class="fw-bold" style="font-size: 13px;color: #a29191">Số lượng: ${item.quantity}</small>
                </div>
                <div class="col-md-2 col-lg-2 col-xl-2 div_desktop_custom" style="text-align:right;">
                    <span class="m-0" style="color: red">${priceTmp}</span>
                </div>
                ${reasonCancel}
            </div>`;
    });

    var statusTmp = handleProcessStatusToText(data.processStatus);
    var cancelButonOrder = data.processStatus === 0 ? `<a href="javascript:void(0)" class="float-right text-danger" onclick="ShowCancelModal(this)"
                            style="width:24px;font-size:12px;text-decoration:underline;">Hủy đơn hàng</a>` : '';
    var reasonAll = '';
    if (!IsNullOrEmty(data.reasonName) && data.reasonName !== "--")
        reasonAll =
            `<div class="col-12 m-0 p-2">
                <span class="m-0 text-danger">Lý do hủy:</span><span class="m-0"> ${data.reasonName}</span>
                <p class="text-break" style="font-style: italic;font-size:12px;">${IsNullOrEmty(data.reasonDescription) ? "" : data.reasonDescription}</p>
            </div>`;
    div_zone_order_item =
        `<div class="div_order_list_custom row mt-2">
                <div class="col-12 div_zone_order_item">
                    <div class="col-12 orderTitle" style="height:32px;">
                        <span class="mb-0" style="display:none;"><img src="/assets/images/icon/shop.png" width="17" height="17" alt="" /> ${data.shopName} <a style="padding-left:6px;" href="${data.shopUrl}"><i class="fa fa-link"></i></a></span>
                        <span class="mb-0 badge badge-info float-right" style="float: right;background: #d06523;">${statusTmp}</span>
                        ${cancelButonOrder}
                    </div>
                    ${orderItem}
                    ${reasonAll}
                </div>
            </div>`;

    var checkFeeShip = (data.feeship == -1) ? 0 : data.feeship;
    var totalPriceFinal = totalPrice + checkFeeShip;

    var zoneTotalPay =
        `<div class="checkout-details">
            <div class="order-box">
                <ul class="qty">
                    <li class="text_div_price">
                    <i class="fas fa-comment-dollar mx-2" style="color: #357ebd;font-size: 20px"></i>
                        Tạm tính (<b style="font-weight:normal;">${countItem}</b> sản phẩm)
                        <span class="fw-bold" style="float: right;color: #2b34da">${FormatToVNDCustom(totalPrice)}</span>
                    </li>
                    <li class="text_div_price">
                    <i class="fa-solid fa-truck mx-2" style="color: #357ebd;font-size: 20px"></i>
                        Phí vận chuyển
                        <span class="fw-bold" style="float: right;color: #2b34da">${data.feeship < 0 ? "(chưa tính)" : FormatToVNDCustom(data.feeship)}</span>
                    </li>
                </ul>
                <ul class="total" style="line-height: 4.2em">
                    <li class="m-0 div_all_price_css" style="font-size: 20px">Tổng cộng <span style="float: right;color: red">${FormatToVNDCustom(parseInt(totalPriceFinal))}</span></li>
                    <li> <span class="text_div_price" style="font-size:12px;"><i>(Đã bao gồm VAT)</i></span></li>
                </ul>
            </div>
            <div class="payment-box pt-2">
                <div class="text-start">
                    <a href="javascript:void(0)" onclick="CloseDetailPanel()"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Trở về</a>
                </div>
            </div>
        </div>`;

    var title =
        `<div class="col-12 border p-2" style="background: #11ad3d;height: 80px" >
            <h4 class="mb-0 text-white font-weight-bold d-flex justify-content-between">
                Đơn hàng #${data.id}
                <a id="myLink" href="javascript:void(0)" onclick="CloseDetailPanel()" title="Đóng" class="float-right" style="line-height:0;"><i class="fa fa-times-circle text-white"></i></a>
            </h4>
            <span class="mb-0 text-white col-12">Ngày đặt hàng: ${moment(data.createdAt).format('DD-MM-YYYY')}</span><br />
            <span class="mb-0 text-white col-12" style="font-weight:500;">${data.processStatus === 3 ? 'Ngày nhận hàng: ' + moment(data.doneAt).format('DD-MM-YYYY') : ''}</span>
            <span class="mb-0 text-white col-12" style="font-weight:500;">${data.processStatus === 4 ? 'Ngày hủy đơn: ' + moment(data.doneAt).format('DD-MM-YYYY') : ''}</span>
            <span class="mb-0 text-white col-12" style="font-weight:500;">${data.processStatus === 5 ? 'Ngày trả hàng: ' + moment(data.doneAt).format('DD-MM-YYYY') : ''}</span>
        </div>`;

    var buttonShowBankList = parseInt(data.paymentMethodId) === 2 ?
        `<div>
            <button type="button" data-id="${data.shopId}" onclick="ShowBankPayment(this,'${data.id}','${FormatToVNDCustom(totalPrice + data.feeship)}')"
                class="btn btn-xs text-white btn-solid font-weight-bold ladda-button" dir="ltr" data-style="zoom-in" style="background: #357ebd">THANH TOÁN</button>
        </div>` : "";
    var infoOrder =
        `<div class="div_order_list_custom row mt-2">
            <div class="col-12 col-md-12 col-lg-3 p-1">
                <div class="p-2 h-100 div_zone_order_item" style="border: 1px solid palevioletred;">
                    <div>
                        <p class="text-uppercase border-bottom" style="font-weight:500;font-size:14px;">Địa chỉ nhận hàng</p>
                    </div>
                    <div>
                        <b class="text-break">${data.receiverFullname}</b>
                    </div>
                    <div>
                        <span class="d-flex">
                            <i class="fa fa-map-marker text-success mx-1"></i>
                            <span class="text-break"> ${data.addressText}</span>
                        </span>
                    </div>
                    <div>
                        <span style="color: red; font-weight: 500"><i class="fa fa-phone text-success"></i> ${data.receiverPhoneNumber}</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-12 col-lg-3 p-1">
                <div class="p-2 h-100 div_zone_order_item" style="border: 1px solid palevioletred;">
                    <div>
                        <p class="text-uppercase border-bottom" style="font-weight:500;font-size:14px;">Hình thức giao hàng</p>
                    </div>
                    <div>
                        <b class="text-break">${data.shipMethodName}</b>
                    </div>
                    <div>
                        <span>
                            <span class="text-break">Phí vận chuyển: <b class="text-danger">${data.feeship < 0 ? "(chưa tính)" : FormatToVNDCustom(data.feeship)}</b></span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-12 col-lg-3 p-1">
                <div class="p-2 h-100 div_zone_order_item" style="border: 1px solid palevioletred;">
                    <div>
                        <p class="text-uppercase border-bottom" style="font-weight:500;font-size:14px;">Hình thức thanh toán</p>
                    </div>
                    <div>
                        <b class="text-break">${data.paymentMethodName}</b>
                    </div>
                    ${buttonShowBankList}
                </div>
            </div>
                        <div class="col-12 col-md-12 col-lg-3 p-1">
                <div class="p-2 h-100 div_zone_order_item" style="border: 1px solid palevioletred;">
                    <div>
                        <p class="text-uppercase border-bottom" style="font-weight:500;font-size:14px;">Thông tin khác</p>
                    </div>
                    <div>
                        <b>${IsNullOrEmty(data.remark) ? "Không ghi chú" : "Ghi chú:"}</b>
                        <br/>
                        <i style="white-space: break-spaces;">${IsNullOrEmty(data.remark) ? "" : data.remark}</i>
                    </div>
                </div>
            </div>

        </div>`

    return title + infoOrder + div_zone_order_item + zoneTotalPay;
}



$(document).ready(function () {


    var curHref = location.pathname.split('/');
    if (curHref.length === 4) {
        let orderId = curHref[3];
        LoadDetailByUrl(orderId);
    } else {
        LoadListOrder();
    }

    $('.li_status_order').on('click', function () {
        statusProcess = parseInt($(this).data('id'));
        pageCurrent = 1;
        LoadListOrder();
    });

    $('#select_show_records_search').on('change', function () {
        pageCurrent = 1;
        LoadListOrder();
    });

    //Submit cancel item
    $('#btn_submit_cancel_item').on('click', function (e) {
        var laddaSubmitForm = Ladda.create(document.querySelector('#btn_submit_cancel_item'));

        //Get checked row
        var listChecked = [];
        var flagFailSelectReason = false;
        var itemId = 0;
        var reasonId = 0;
        var rowChecked = $('#tbody_modal_cancel_oderitem tr input[name="input_order_item_cancel"]:checked');
        rowChecked.each(function (key, value) {
            itemId = $(this).data('id');
            reasonId = parseInt($('#ReasonId_' + itemId).val());
            if (reasonId === undefined || reasonId == null || isNaN(reasonId) || reasonId === 0) {
                flagFailSelectReason = true;
                return false;
            }
            listChecked.push(`${itemId}:${reasonId}`);
        });
        if (flagFailSelectReason) {
            ShowToastNoti('warning', '', 'Vui lòng chọn lý do hủy');
            return;
        }
        if (listChecked.length === 0) {
            ShowToastNoti('info', '', 'Bạn chưa chọn sản phẩm muốn hủy');
            return;
        }
        var data = {
            orderItemId: JSON.stringify(listChecked).replace(/"/g, ''),
            description: $('#textarea_description_cancel').val()
        };

        laddaSubmitForm.start();
        $.ajax({
            url: '/Order/CancelItem',
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function (response) {
                laddaSubmitForm.stop();
                if (!CheckResponseIsSuccess(response)) return false;
                var curHref = location.pathname.split('/');
                if (curHref.length === 4) {
                    LoadDetailByUrl(curHref[3]);
                }
                /*   swal.fire('Đã hủy đơn hàng', '', 'success');*/
                ShowToastNoti('success', '', 'Đã hủy đơn hàng');
                $('#modal_cancel_item').modal('hide');
                isHaveNewData = true;
            }, error: function (err) {
                laddaSubmitForm.stop();
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });

    });

    $('#textarea_description_cancel').maxlength({
        alwaysShow: !0,
        warningClass: "badge badge-success",
        limitReachedClass: "badge badge-danger"
    });


   
});


function dataParam() {
    return {
        status: statusProcess,
        type: parseInt($("#select_show_records_search").val()),
        page: pageCurrent
    }
}

//Load List order
function LoadListOrder() {
    var data = dataParam();
    try {
        ShowOverlay("#div_order_list");
        $.ajax({
            type: 'GET',
            url: '/Order/GetListOrder',
            data: data,
            dataType: "json",
            success: function (response) {
                HideOverlay("#div_order_list");
                isHaveNewData = false;
                if (!CheckResponseIsSuccess(response)) {
                    document.getElementById("div_order_list").innerHTML = ` 
                    <div class="text-center p-2">
                        <h4>Kết nối không ổn định</h4>
                        <button type="button" class="btn btn-primary" 
                            style="width:200px;height:45px;border-radius:4px;" 
                            onclick="LoadListOrder();$(this).parent().remove();">Tải lại
                        </button>
                    </div>`;
                    return;
                }

                var listData = response.data;
                if (listData != null && listData.length > 0) {
                    document.getElementById("div_order_list").innerHTML = tableDataHtml(listData);
                    $("#label_count_order_item").text(`${response.data2nd != null ? response.data2nd : 0} đơn hàng`);
                } else {
                    $("#label_count_order_item").text('');
                    document.getElementById("div_order_list").innerHTML = _imgNotFoundHtml;
                }
                var totalRecord = parseInt(response.data2nd);
                var pagination = LoadPagination(totalRecord, pageSize, pageCurrent);
                $('#ul_pagination_order_list').html(pagination);
            },
            error: function (err) {
                HideOverlay("#div_order_list");
                isHaveNewData = false;
                document.getElementById("div_order_list").innerHTML = ` 
                    <div class="text-center p-2">
                        <h4>Kết nối không ổn định!</h4>
                        <button type="button" class="btn btn-primary" 
                            style="width:200px;height:45px;border-radius:4px;" 
                            onclick="LoadListOrder();$(this).parent().remove();">Tải lại
                        </button>
                    </div>`;
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    } catch (e) {
        document.getElementById("div_order_list").innerHTML = ` 
                    <div class="text-center p-2">
                        <h4>Kết nối không ổn định!</h4>
                        <button type="button" class="btn btn-primary" 
                            style="width:200px;height:45px;border-radius:4px;" 
                            onclick="LoadListOrder();$(this).parent().remove();">Tải lại
                        </button>
                    </div>`;
    }
}

//Click Pagination ChangePage
function ChangePage(page, e) {
    e.preventDefault();
    ScrollToTop('.section-b-space', 700, 70);
    pageCurrent = page;

    //Get data
    LoadListOrder();
}

//Handle pagination
function LoadPagination(totalRecords, pageSize = 10, currentPage) {
    var pageDisplay = 5;
    var totalPage = Math.ceil(totalRecords / pageSize);

    //Check currentPage error
    if (currentPage > totalPage) {
        currentPage = totalPage;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }

    var startPage = parseInt(Math.max(1, Math.ceil(currentPage - pageDisplay / 2)));
    var endPage = parseInt(Math.min(totalPage, currentPage + pageDisplay / 2));

    if (totalPage >= 1) {
        var html = '';
        if (currentPage > 1) {
            html += `
                <li class="page-item">
                    <a class="page-link p-2 text-black" href="javascript:void(0);" title="Trang đầu" onclick="ChangePage(1,event)"
                    aria-label="First">
                        <span aria-hidden="true">
                            <i class="fa fa-angle-double-left" aria-hidden="true"></i>
                        </span> 
                        <span class="sr-only">First</span>
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link p-2" href="javascript:void(0);" title="Trang trước" onclick="ChangePage(${currentPage - 1},event)"
                    aria-label="Previous">
                        <span aria-hidden="true">
                            <i class="fa fa-angle-left" aria-hidden="true"></i>
                        </span> 
                        <span class="sr-only">Previous</span>
                    </a>
                </li>`;
        }
        for (var i = startPage; i <= endPage; i++) {
            if (currentPage == i) {
                html += `<li class="page-item active">
                            <a class="page-link p-2"><b>${currentPage}</b></a>
                        </li>`;
            }
            else {
                html += `<li class="page-item">
                            <a class="page-link p-2" href="javascript:void(0);" onclick="ChangePage(${i},event)" title="Trang ${i}">${i}</a>
                        </li>`;
            }
        }
        if (currentPage < totalPage) {
            html += `<li class="page-item">
                        <a class="page-link p-2" href="javascript:void(0);" title="Trang kế tiếp" onclick="ChangePage(${currentPage + 1},event)"
                            aria-label="Next">
                            <span aria-hidden="true">
                                <i class="fa fa-angle-right" aria-hidden="true"></i>
                            </span> 
                            <span class="sr-only">Next</span>
                        </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link p-2" href="javascript:void(0);" title="Trang cuối" onclick="ChangePage(${totalPage},event)"
                        aria-label="Last">
                            <span aria-hidden="true">
                                <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                            </span> 
                            <span class="sr-only">Last</span>
                        </a>
                    </li>`;
        }
        return html;
    }
    else {
        //NoData
        return "";
    }

}

//View detail order
function ViewDetail(e, elm, id) {
    ShowOverlayLoadingButton('#div_zone_order_view_detail')
    $(elm).html(_loadAnimationSmallHtml);
    $.ajax({
        type: 'GET',
        url: '/Order/ViewDetail',
        data: {
            id: id
        },
        dataType: "json",
        success: function (response) {
            HideOverlayLoadingButton('#div_zone_order_view_detail')
            if (response.result === -2 && response.error.code === 404) {
                location.href = "/error/404";
                return;
            }
            if (!CheckResponseIsSuccess(response)) return false;

            detailOrderCurrentData = response.data;

            //Change UI when success
                /*$('.dashboard-order').html(loadDetailOrder(detailOrderCurrentData))*/
            $('#div_zone_order_view_detail').html(loadDetailOrder(detailOrderCurrentData))
            /*ShowHidePanel("#div_zone_order_view_detail", "#section_div_cart")*/
            $('#section_div_cart').fadeOut(200)
            $('#div_zone_order_view_detail').slideDown(500)
        },
        error: function (err) {
            HideOverlayLoadingButton('#div_zone_order_view_detail')
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//Load detail by url
function LoadDetailByUrl(id) {
    $('#div_zone_order_list').fadeOut(200);
    $('#div_zone_order_view_detail').fadeIn(200);
    ScrollToTop('#div_zone_order_list', 200, 1);
    ShowOverlay("#div_zone_order_view_detail");
    $.ajax({
        type: 'GET',
        url: '/Order/ViewDetail',
        data: {
            id: id
        },
        dataType: "json",
        success: function (response) {
            HideOverlay("#div_zone_order_view_detail");
            if (response.result === -2 && response.error.code === 404) {
                location.href = "/error/404";
                return;
            }
            if (!CheckResponseIsSuccess(response)) return false;

            detailOrderCurrentData = response.data;
            document.getElementById("div_order_detail").innerHTML = loadDetailOrder(detailOrderCurrentData);
        },
        error: function (err) {
            HideOverlay("#div_zone_order_view_detail");
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//Close detail panel
function CloseDetailPanel() {
   
    $('#section_div_cart').fadeIn(200);
    $('#div_zone_order_view_detail').fadeOut(200);
    if (detailElmSaveClick === undefined) {
        LoadListOrder();
        ScrollToTop("#div_zone_order_list", 200, 1);
    } else {
        if (isHaveNewData)
            LoadListOrder();
        ScrollToTop($(detailElmSaveClick).children('div').eq(0), 200, 1);
    }
}

//Show cancel modal
function ShowCancelModal(elm) {
    var htmlElm = $(elm).html();
    if (reasonListData.length === 0) {
        $(elm).attr('onclick', '');
        $(elm).html(_loadAnimationSmallHtml);
        $.ajax({
            type: 'GET',
            url: '/Order/GetReasonForCancel',
            success: function (response) {
                $(elm).html(htmlElm);
                $(elm).attr('onclick', 'ShowCancelModal(this)');
                if (!CheckResponseIsSuccess(response)) return false;
                reasonListData = response.data;
                document.getElementById('tbody_modal_cancel_oderitem').innerHTML = tableCancelItemHtml(detailOrderCurrentData);
                $('#modal_cancel_item').modal('show');
                // Thực hiện các thao tác khác tại đây (nếu cần)
            },
            error: function (err) {
                $(elm).html(htmlElm);
                $(elm).attr('onclick', 'ShowCancelModal(this)');
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    } else {
        document.getElementById('tbody_modal_cancel_oderitem').innerHTML = tableCancelItemHtml(detailOrderCurrentData);
        $('#modal_cancel_item').modal('show');
        // Thực hiện các thao tác khác tại đây (nếu cần)
    }
}

// Xử lý sự kiện "change" trên phần tử select
$('.select_picker_custom').change(function () {
    var selectedValue = $(this).val();
    // Thực hiện các hành động cần thiết khi có sự thay đổi trong select
});

//Show bank payment
function ShowBankPayment(elm, orderId, totalPay) {
    var id = $(elm).data('id');
    var laddaGetBank = Ladda.create(elm);
    laddaGetBank.start();
    $.ajax({
        type: 'GET',
        url: '/Checkout/GetBankList',
        data: { id: id },
        success: function (response) {
            laddaGetBank.stop();
            if (!CheckResponseIsSuccess(response)) return false;

            var listData = response.data;
            var itemBank = ``;
            let resultHtml = '';
            if (listData != null && listData.length > 0) {
                $.each(listData, function (key, value) {
                    itemBank +=
                        `<div class="col-12 col-md-6 col-lg-6 mb-2">
                            <ul class="list-group text-left">
                                <li class="list-group-item">
                                    <i class="fa fa-id-card-o mr-1" style="font-size: 20px;color: #2f71a9;"></i> <span>
                                        Số tài khoản:
                                    </span>${value.number}
                                    <button style="display: contents;color:red" type="button" class="btn btn-sm p-0 color-default" onclick="CopyText('${value.number}')" title="Sap chép">
                                        <i class="fa fa-clone"></i> <span style="text-transform:none;font-weight:normal;">Sao chép</span>
                                    </button>
                                </li>
                                <li class="list-group-item"><i class="fa fa-user mr-1" style="font-size: 20px;color: #2f71a9;"></i> <span>Tên người nhận: </span>${value.personName}</li>
                                <li class="list-group-item"><i class="fa fa-bank mr-1" style="font-size: 20px;color: #2f71a9;"></i> <span>Ngân hàng: </span>${value.bankName} - ${value.bankTradeName}</li>
                            </ul>
                        </div>`;
                });
                resultHtml =
                    `<h4 class="font-weight-bold text-center text-success text-uppercase"><i class="fa fa-credit-card h4"></i> Thông tin thanh toán</h4>
                        <p class="text-center mb-0 text-danger">
                            <b style="color: #000">Số tiền: </b>${totalPay}
                        </p>
                        <p class="text-center">
                            <b>Nội dung chuyển khoản: </b><span>${orderId}
                               <button style="display: contents;;color: red" type="button" class="btn btn-sm p-0 color-default" onclick="CopyText('${orderId}')" title="Sao chép">
                                <i class="fa fa-clone"></i> <span style="text-transform:none;font-weight:normal;">Sao chép</span>
                            </button></span>
                         
                        </p>
                        <div class="row justify-content-center">
                            ${itemBank}
                        </div>
                            
                        `
                document.getElementById("div_body_modal_bank_list").innerHTML = resultHtml;
                $('#modal_bank_list').modal('show');
            } else {
                ShowToastNoti('warning', '', 'Shop chưa có thông tin chuyển khoản');
            }
        }, error: function (err) {
            laddaGetBank.stop();
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

function CalDiscountPrice(num1, num2) {
    return FormatToVNDCustom(num1 - num2);
}

function FormatToVNDCustom(value) {
    if (IsNullOrEmty(value))
        return "NaN";
    return value.toLocaleString('vi', { style: 'currency', currency: 'VND' }).replace(/\s₫/g, 'đ');
}
