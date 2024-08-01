var $btnPlaceOrder = $('#btn_place_order');
var $modalAddAddress = $('#modal_add_address'),
    $modalListAddress = $('#modal_address_list'),
    $modalListBank = $('#modal_bank_list');
var addressDefaultData;
var addressListData = [];
var cartItemData = [];
var laddaPlaceOrder = Ladda.create(document.querySelector('#btn_place_order'));
const MESSAGE_NOT_FOUND_FEESHIP = '<p class="text-danger my-2">Phí vận chuyển của bạn sẽ được tính khi shipper giao hàng đến.</p>';
var totalMustPay = 0;
var $filterSelectProvince = $("#select_province"),
    $filterSelectDistrict = $("#select_district"),
    $filterSelectWard = $("#select_ward");
function tableDataHtml(data) {
    //Get record
    var shopItem = '';
    var productItem = '';
    var shopUrl = '', shopId = 0;
    var countPackage = 0;
    var countItem = 0;
    var totalPriceItem = 0;
    productItem = '';
    $.each(data, function (key, value) {
        shopUrl = value.shopUrl;
        shopId = value.code;
        countPackage++;

        countItem++;
        let sizeTmp = '', colorTmp = '', priceDiscount = 0, priceTmp = '', discountTmp = '';
        /*   priceDiscount = value.produ > 0 ? (value.price - value.discount) : value.price;*/
        priceTmp = value.productPrice > 0 ? FormatToVNDCustom(parseInt(value.productPrice)) : 0;
        discountTmp = value.discount > 0 ? `<del>${FormatToVNDCustom(value.price)}</del>` : "";
        totalPriceItem += value.productPrice * value.quantity;
        typeNameTmp = value.typeName != null && value.typeName.length > 30 ? value.typeName.substring(0, 30) + "..." : value.typeName;
        sizeTmp = value.sizeName != null && value.sizeName.length > 30 ? value.sizeName.substring(0, 30) + "..." : value.sizeName;
        colorTmp = value.colorName != null && value.colorName.length > 30 ? value.colorName.substring(0, 30) + "..." : value.colorName;
        productItem +=
            `<div class="col-12 ${key != data.length - 1 ? 'border-bottom' : ''} row m-0 p-2">
                    <div class="col-auto px-1">
                        <a href="javascript:void(0);">
                            <img src="${value.imageUrl}" class="img-fluid img-thumbnail" loading="lazy" style="width:70px; height:70px;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;object-fit: cover;" alt="${value.name}" onerror="this.onerror=null;this.src='/img_dev/error/product.png';">
                        </a>
                    </div>

                    <div class="col">
                        <a href="javascript:void(0);">
                            <div class="div_desktop_custom text-muted" title="${IsNullOrEmty(value.productName) ? "" : value.name}${IsNullOrEmty(typeNameTmp) ? '' : ' (' + typeNameTmp + ')'}">
                                <span class="sp-line-2 text-black">${IsNullOrEmty(value.productName) ? "" : value.productName}</span>
                                ${!IsNullOrEmty(typeNameTmp) ? `<span class="col-auto badge badge-default" style="background: red;">${typeNameTmp}</span>` : ""}
                            </div>
                            <span class="text-danger fw-bold">Số lượng: ${value.quantity}</span>
                           
                        </a>
                    </div>
                    <div class="col-md-4 col-lg-4 col-xl-4 div_desktop_custom text-right">
                        <span class="m-0 color-default h6 d-flex" style="float: right;color: #357ebd;">
                            <span class="mx-1 text-black">Đơn giá :</span>
                            ${priceTmp}
                            
                        </span>
                        
                    </div>
                </div>`;
    });
    shopItem =
        `<div class="col-12 px-0 div_zone_shop">
                ${productItem}
            </div>`;
    totalMustPay = totalPriceItem
    RefreshTotalItem(totalPriceItem, countItem);
    RefreshTotalPay();
    return shopItem;
}

function orderReviewHtml(data, productGiftSeleted) {
    //Get record
    var shopItem = '';
    var productItem = '';
    var productGiftHtml = '';
    var totalPriceItem = 0;
    var totalPriceOneOrder = 0;
    let orderCode = '';
    let feeShip = 0;
    var paymentMethod = $('input[type="radio"][name="input_payment_group"]:checked').val();
    if (productGiftSeleted != null) {
        productGiftHtml = `  <td style="margin: auto">
                    <table class="product-table"
                           align="center"
                           border="0"
                           cellpadding="0"
                           cellspacing="0"
                           width="100%">
                        <tbody>
                         <td style="font-size: 15px;">
                                        <h5 style="font-weight: 500;font-size: 20px;">
                                        <i class="fa-solid fa-gift flashit" style="font-size: 20px;color: #d36611;"></i>Quà tặng
                                    </h5>
                                </td>
                            <tr>
                                <td style="width: 100px; border-bottom: 1px solid rgba(217, 217, 217, 0.5); ">
                                    <img style="width: 100%" src="${!IsNullOrEmty(productGiftSeleted.productObj?.imageObj?.smallUrl) ? productGiftSeleted.productObj?.imageObj?.smallUrl : "/img_dev/error/avatar.png"}"
                                   onerror="this.onerror=null;this.src='/img_dev/error/product.png'" alt="" />
                                </td>
                                <td style="
                              padding: 28px 0;
                              border-bottom: 1px solid rgba(217, 217, 217, 0.5);
                            ">
                                    <ul class="product-detail">
                                        <li>${productGiftSeleted.productObj?.name}</li>
                                        <li>Số lượng: <span> Số lượng ${productGiftSeleted.quantityDonation}</span></li>
                                        <li>Giá: <span style="color: red">${(productGiftSeleted.productObj?.productPriceObj[0]?.priceOut != null) ? FormatToVND(productGiftSeleted.productObj?.productPriceObj[0]?.priceOut) : ""}</span></li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>`;
    } else {
        productGiftHtml = ``
    }

    /*    $.each(data, function (key, value) {*/
    productItem = '';
    totalPriceOneOrder = 0;
    cartItemData.forEach(function (item, index) {
        priceTmp = item.productPrice > 0 ? FormatToVNDCustom(parseInt(item.productPrice)) : 0;
        discountTmp = item.discount > 0 ? `<del>${FormatToVNDCustom(item.price)}</del>` : "";
        totalPriceItem += item.productPrice * item.quantity;
        typeNameTmp = item.typeName != null && item.typeName.length > 30 ? item.typeName.substring(0, 30) + "..." : item.typeName;
        sizeTmp = item.sizeName != null && item.sizeName.length > 30 ? item.sizeName.substring(0, 30) + "..." : item.sizeName;
        colorTmp = item.colorName != null && item.colorName.length > 30 ? item.colorName.substring(0, 30) + "..." : item.colorName;
        totalPriceOneOrder += item.productPrice * item.quantity;
        productItem +=
            ` <table class="product-table" align="center" border="0" cellpadding="0"
                                               cellspacing="0" width="100%">
                                             <tbody >
                                                <tr>
                                                    <td style="padding: 0 7px;border-bottom: 1px solid rgba(217, 217, 217, 0.5);width:100px">
                                                        <img src="${item.imageUrl}" alt="${item.name}" style="width: 100%;height:100%; object-fit:cover" onerror="this.onerror=null;this.src='/img_dev/error/product.png';">
                                                    </td>
                                                    <td style="padding: 28px 0;border-bottom: 1px solid rgba(217, 217, 217, 0.5);">
                                                        <ul class="product-detail" title="${IsNullOrEmty(item.productName) ? "" : item.productName}${IsNullOrEmty(typeNameTmp) ? '' : ' (' + typeNameTmp + ')'}">
                                                            <li>${IsNullOrEmty(item.productName) ? "" : item.productName}</li>
                                                            <li>Số lượng: <span>${item.quantity}</span></li>
                                                            <li>Giá: <span>${priceTmp}</span></li>
                                                        </ul>
                                                    </td>
                                                </tr>


                                            </tbody>
                                        </table> `;
    });
    orderCode = data[0].id
    feeShip = IsNullOrEmty($('#input_feeship_calculate').val()) ? 0 : parseInt($('#input_feeship_calculate').val());

    totalPriceItem = totalPriceItem + feeShip;
    let buttonShowBankList = parseInt(paymentMethod) === 2 ?
        `<li sttle="height:28px;">
                <button type="button" data-id="${data[0].supplierId}" id="btn_show_bank_info" onclick="ShowBankPaymentInPanel(this,'${orderCode}',${totalPriceOneOrder + feeShip})"
                    class="btn btn-xs btn-solid font-weight-bold float-right mt-2 ladda-button" dir="ltr" data-style="zoom-in">Xem TT thanh toán</button>
            </li>` : "";
    shopItem =
        ` <td style="width: 100%;max-height: 300px;overflow-y: auto">
            <div class="col-12 mt-4" style="margin-bottom:10px;margin-top:-6px;">
                        <p><b>Đơn hàng:</b><span class="color-default ml-1">#${orderCode}
                         <button style="display: contents;color: red" type="button" class="btn btn-sm p-0 color-default" onclick="CopyText('${orderCode}')" title="Sao chép">
                                <i class="fa fa-clone"></i> <span style="text-transform:none;font-weight:normal;">Sao chép</span>
                            </button></span></p>
                            <span class="" style="
                                color: red;
                                font-weight: 600;
                                position: relative;
                                bottom: 15px;
                            ">Vui lòng lưu lại mã đơn để tra cứu đơn hàng bạn nhé !</span>
                          
     <br /> <strong class="text-success">Cách tra cứu: Chọn vào nút "Tài khoản" ở trên cùng góc phải màn hình >> Tra cứu đơn hàng</strong>
                    </div>
                ${productItem}
            </td>
            
                    <td style="width: 70%;max-height: 400px;overflow-y: auto;">
                     
                                        <table class="dilivery-table" align="center" border="0" cellpadding="0"
                                               style="background-color: #F7F7F7;padding: 14px;border-collapse: separate;" cellspacing="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="font-weight: 700;font-size: 17px;padding-bottom: 15px;border-bottom: 1px solid rgba(217, 217, 217, 0.5);"
                                                        colspan="2">
                                                        Thanh toán
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="text-align: left;font-size: 15px;font-weight: 400;padding: 15px 0;border-bottom: 1px solid rgba(217, 217, 217, 0.5);">
                                                        Tạm tính
                                                    </td>
                                                    <td style="text-align: right;font-size: 15px;font-weight: 400;padding: 15px 0;border-bottom: 1px solid rgba(217, 217, 217, 0.5);">
                                                        ${FormatToVNDCustom(totalPriceOneOrder)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="text-align: left;font-size: 15px;font-weight: 400;padding: 15px 0;border-bottom: 1px solid rgba(217, 217, 217, 0.5);">
                                                        Phí vận chuyển
                                                    </td>
                                                    <td style="text-align: right;font-size: 15px;font-weight: 400;padding: 15px 0;border-bottom: 1px solid rgba(217, 217, 217, 0.5);">
                                                        ${IsNullOrEmty($('#input_feeship_calculate').val()) ? '(chưa tính)' : FormatToVNDCustom(feeShip)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="text-align: left;font-size: 15px;font-weight: 600;padding-top: 15px;">
                                                        Thành tiền
                                                    </td>
                                                    <td style="color:red;text-align: right;font-size: 15px;font-weight: 600;padding-top: 15px;">
                                                        ${FormatToVNDCustom(totalPriceOneOrder + feeShip)}
                                                    </td>
                                                    ${buttonShowBankList}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>`;


    $('#span_order_review_total_pay').text(FormatToVNDCustom(totalPriceItem));
    document.getElementById("div_list_order_item").innerHTML = shopItem;
    document.getElementById("div_list_order_product_gift").innerHTML = productGiftHtml;
    if (parseInt(paymentMethod) === 2)
        ShowBankPaymentInPanel('#btn_show_bank_info', orderCode, `${(totalPriceOneOrder + feeShip)}`);
}

//ChangeURLWithOut("Mua hàng", "/checkout/payment");

$(document).ready(function () {

    //Init bootstrap max length
    $("#input_remark").maxlength({
        alwaysShow: !0,
        warningClass: "badge badge-success",
        limitReachedClass: "badge badge-danger"
    });

    /* let listIdCartSeleted = myData.find(x => x.productId);*/
    //Load cart checked data
    LoadListCart();

    //Run js button place order
    RunJs();
    var input_default_addressJsonString = $('#input_default_address').val();
    if (!IsNullOrEmty(input_default_addressJsonString) && input_default_addressJsonString != "null") {
        addressDefaultData = JSON.parse(input_default_addressJsonString), RawDataAddressInView(addressDefaultData);
    }
    else {
        $('#span_address_location').html('<a href="javascript:void(0)" onclick="ShowAddressListModal(this)">Vui lòng chọn địa chỉ nhận hàng</a>'),
            document.getElementById("div_shipping_fee_list").innerHTML = _imgNotFoundHtml,
            $('#span_address_phone').text('');
    }
    GetListProvinces();
    //$('#select_province').change(function () {
    //    var selectedProvinceId = $(this).val();
    //    GetListDistricts(selectedProvinceId); 
    //});
    //$('#select_district').change(function () {
    //    var selectedDistrictId = $(this).val();
    //    GetListWards(selectedDistrictId); 
    //});

    LoadListFeeShip();
    $('#select_province').on('change', function () {

        LoadListFeeShip();
        //$filterSelectWard.html('<option value="0">--Chọn--</option>');
        //$filterSelectWard.selectpicker("refresh");
        //$filterSelectWard.selectpicker("val", 0);
    })
});

//Event onclick button place order
function RunJs() {
    //Button place order
    $btnPlaceOrder.on('click', function () {
        var listProduct = [];
        cartItemData.forEach((item, index) => {
            listProduct.push(`${item.productId}:${item.productPriceId}:${item.quantity}`);
        });

        let addressName = $('#input_address_delivery_name').val().trim();
        let addressPhone = $('#input_address_delivery_phonenumber').val().trim();

        let remark = $('#input_remark').val().trim();
        let paymentMethod = $('input[name="input_payment_group"]:checked').val();
        let shipMethod = $('input[name="shipping_method"]:checked').val() ?? '';
        $('#form_data_add_address').addClass('was-validated')
        // Lấy giá trị provinceId, districtId, wardId từ các dropdown tương ứng
        var provinceId = $('#select_province').val();
        var districtId = $('#select_district').val();
        var wardId = $('#select_ward').val();

        // Lấy giá trị wardName, districtName, provinceName từ các dropdown tương ứng
        var wardName = $('#select_ward option:selected').text().trim();
        var districtName = $('#select_district option:selected').text().trim();
        var provinceName = $('#select_province option:selected').text().trim();

        var addressText = $('#input_addressie_address_text').val().trim()

        let addressIe = {
            addressText: addressText,
            latitude: 0,
            longitude: 0,
            countryId: 1,
            provinceId: provinceId,
            districtId: districtId,
            wardId: wardId,
        }

        //Check product gift id
        var dataProductGift;
        let getValueProductGiftId = $('.checkbox_product_gift:checked').attr("id");
        var productGiftId;
        if (getValueProductGiftId != undefined || getValueProductGiftId != null) {
            productGiftId = getValueProductGiftId;
        } else {
            productGiftId = "";
        }

        let addressLocation = addressText + "," + wardName + "," + districtName + "," + provinceName;

        if (listProduct.length > 0) {
            if (!IsNullOrEmty(addressName) && !IsNullOrEmty(addressLocation) && !IsNullOrEmty(districtId) && !IsNullOrEmty(provinceId) && !IsNullOrEmty(addressPhone)) {

                let formData = new FormData();
                formData.append("sequenceProductProductPriceQuantity", JSON.stringify(listProduct).replace(/"/g, ''));
                formData.append("receiverFullName", addressName);
                formData.append("receiverPhoneNumber", addressPhone);
                formData.append("addressText", addressLocation);
                formData.append("latitude", addressIe.latitude);
                formData.append("longitude", addressIe.longitude);
                formData.append("addressIeText", addressIe.addressText);
                formData.append("countryId", addressIe.countryId);
                formData.append("provinceId", addressIe.provinceId);
                formData.append("districtId", addressIe.districtId);
                formData.append("wardId", addressIe.wardId);
                formData.append("paymentId", paymentMethod);
                formData.append("shippingPriceId", shipMethod);
                formData.append("companyTaxNumber", '');
                formData.append("companyName", '');
                formData.append("companyAddress", '');
                formData.append("remark", remark);
                formData.append("productGiftId", productGiftId);

                // Thực hiện AJAX để submit dữ liệu
                $.ajax({
                    type: 'POST',
                    url: '/CheckoutWithoutLogin/PlaceOrder',
                    data: formData,
                    contentType: false,
                    processData: false,
                    dataType: "json",
                    success: function (response) {
                        laddaPlaceOrder.stop();

                        if (!CheckResponseIsSuccess(response)) return;
                        ShowToastNoti('success', '', 'Đặt hàng thành công');
                        var listData = response.data;
                        var productGiftSeleted = response.data2nd;
                        RemoveItemInLocalStorage();
                        localStorage.setItem('listCartSelectedLocalStorage', JSON.stringify([]));
                        orderReviewHtml(listData, productGiftSeleted);
                        $("html, body").animate({
                            scrollTop: 0
                        }, 0);
                        $('.section_place_order').fadeOut(300).remove().delay(100);
                        $('.section_order_success').fadeIn(300);
                        countShoppingCartWithoutLogin();
                    },
                    error: function (err) {
                        laddaPlaceOrder.stop();
                        CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
                    }
                });
            } else {
                ShowToastNoti('warning', '', 'Vui lòng nhập đầy đủ thông tin nhận hàng');
            }
        } else {
            ShowToastNoti('info', '', 'Không có sản phẩm nào được chọn. Vui lòng chọn sản phẩm ở giỏ hàng', 5000);
        }
    });
}


function RemoveItemInLocalStorage() {
    var myData = JSON.parse(localStorage.getItem('listCartLocalStorage'));

    var idCartSelected = JSON.parse(localStorage.getItem('listIdCartSelectedLocalStorage'))
    idCartSelected.forEach(function (item) {
        if (item == FindItemInArray(myData, 'productPriceId', item).productPriceId) {
            RemoveItemInArray(myData, FindItemInArray(myData, 'productPriceId', item))
            localStorage.setItem('listCartLocalStorage', JSON.stringify(myData));
        }
    })
}

//Load list cart
function LoadListCart() {
    ShowOverlay('#div_zone_cart');
    let listCart = []
    var idCartSelected = JSON.parse(localStorage.getItem('listIdCartSelectedLocalStorage'))//List Id đã chọn
    idCartSelected.forEach(function (item) {
        if (item == FindItemInArray(myData, 'productPriceId', item).productPriceId) {
            listCart.push(FindItemInArray(myData, 'productPriceId', item))
        }
    })
    cartItemData = listCart
    if (listCart != null && listCart.length > 0) {
        HideOverlayLoadingButton('#div_zone_cart');
        document.getElementById("div_zone_cart").innerHTML = tableDataHtml(listCart);
        LoadListGift()
        GetListProductGiftYouCanGet();
        $btnPlaceOrder.attr('disabled', false);
    } else {
        HideOverlayLoadingButton('#div_zone_cart');
        NoneRecord();
    };
}

function LoadListGift() {
    ShowOverlay('#div_product_gift');
    try {
        $.ajax({
            type: 'GET',
            url: '/CheckoutWithoutLogin/GetListProductGift',
            data: {
                totalPrice: localStorage.getItem('totalPriceForGetListProductGift')
            },
            dataType: "json",
            success: function (response) {
                HideOverlay('#div_product_gift');
                //Success
                var listProductPrice = response;
                var listProductGift = '';
                var trProductGift = '';
                //Product gift
                if (listProductPrice != null && listProductPrice.length > 0) {
                    $.each(listProductPrice, function (key, item) {
                        if (parseInt(totalMustPay) > item.orderPriceApply) {
                            trProductGift += `<tr>
                                            <th scope="row">
                                                <a class="class="div_css_quantity_present" href="/san-pham/${item.productObj?.nameSlug}-${item.productObj?.id}" target="_blank">
                                                    <img src="${item.productObj?.imageObj?.smallUrl != null ? item.productObj?.imageObj?.smallUrl : "/img_dev/error/avatar.png"}" class="blur-up lazyloaded custom_img_product_gift">
                                                </a>
                                                <span class="div_css_quantity_present">${item.quantityDonation}</span>
                                            </th>
                                            <td>
                                                <div style="display: inline-grid;">
                                                    <a class="sp-line-2 mb-0 font-weight-5 text-dark" target="_blank" style="line-height: normal;" href="/san-pham/${item.productObj?.nameSlug}-${item.productObj?.id}">${item.productObj?.name}</a>
                                                    <span class="col-auto badge badge-default" style="background: red;width: fit-content;">${item.productObj?.categoryObj?.name}</span>
                                                </div>
                                                
                                            </td>
                                            <td class="p-0">
                                                <span class="text-primary">
                                                    ${(item.productObj?.productPriceObj[0]?.priceOut != null) ? FormatToVND(item.productObj?.productPriceObj[0]?.priceOut) : ""}
                                                </span>
                                                <div class="pretty p-icon p-round p-jelly d-flex">
                                                    <input id="${item.id}" type="checkbox" class="checkbox_product_gift" />
                                                    <div class="state p-success">
                                                        <i class="fas fa-check icon"></i>
                                                        <label></label>
                                                    </div>
                                                </div>
                                            </td>
                                           </tr>`
                        }
                        listProductGift = `
                            <div class="card mb-3 div_product_gift">
                                    <div class="card-body">
                                        <p class="mb-1">
                                            <i class="fa-solid fa-bolt flashit" style="font-size: 20px;color: #d36611;"></i>
                                            <span class="fs-6 text-success fw-bolder">Quà tặng</span>
                                        </p>
                                    

                                    <table class="table mb-0 align-middle">
                                        <tbody id="div_list_product_gift">
                                                ${trProductGift}
                                        </tbody>
                                    </table>
                                </div>  
                            </div>`
                    });
                    if (!IsNullOrEmty(trProductGift) && trProductGift.length > 0) {
                        document.getElementById("div_product_gift").innerHTML = listProductGift;
                    } else {
                        $('#div_product_gift').hide();
                    }

                    if (cartItemData != null && cartItemData.length > 0) {
                        document.getElementById("div_product_gift").innerHTML = listProductGift;

                        $('.checkbox_product_gift').click(function () {
                            $('.checkbox_product_gift').not(this).prop('checked', false);
                        });

                    } else {
                        NoneRecord();
                    }
                }
            },
            error: function (error) {
                HideOverlay('#div_product_gift');
                document.getElementById("div_product_gift").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListGift();$(this).remove();">
                        </i>
                    </div>`;
                $btnPlaceOrder.attr('disabled', 'disabled');
            }
        })
    }
    catch (e) {
        HideOverlay('#div_product_gift');
        document.getElementById("div_product_gift").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListGift();$(this).remove();">
                        </i>
                    </div>`;
        $btnPlaceOrder.attr('disabled', 'disabled');
    }
}

//Load list gift you can get
function GetListProductGiftYouCanGet() {
    ShowOverlay('#div_product_gift_you_can_get');
    try {
        $.ajax({
            type: 'GET',
            url: '/CheckoutWithoutLogin/GetListProductGiftYouCanGet',
            data: {
                totalPrice: localStorage.getItem('totalPriceForGetListProductGift')
            },
            dataType: "json",
            success: function (response) {
                HideOverlay('#div_product_gift_you_can_get');
                if (response != null && response.length > 0) {
                    //Success
                    var listProductGiftYouCanGet = response;
                    var trProductGiftYouCanGet = '';
                    var listProductGiftYouCanGetHtml = '';

                    //Product gidt you can get
                    // if (listProductGiftYouCanGet != null && listProductGiftYouCanGet.length > 0) {
                    //    let trProductGiftYouCanGet = "";

                    //    $.each(listProductGiftYouCanGet, function (key, item) {
                    //        if (item.orderPriceApply - parseInt(totalMustPay) > 0) {
                    //            trProductGiftYouCanGet += `<tr>
                    //                       <th scope="row">
                    //                           <a class="div_css_img_quantity" href="/san-pham/${item.productObj?.nameSlug}-${item.productObj?.id}" target="_blank">
                    //                                <img src="${item.productObj?.imageObj?.smallUrl != null ? item.productObj?.imageObj?.smallUrl : "/img_dev/error/avatar.png"}" class="blur-up lazyloaded custom_img_product_gift">
                    //                           </a>
                    //                           <span class="div_css_quantity">${item.quantityDonation}</span>
                    //                        </th>
                    //                        <td>
                    //                            <a class="sp-line-2 mb-0 font-weight-5 text-dark" target="_blank" style="line-height: normal;" href="/san-pham/${item.productObj?.nameSlug}-${item.productObj?.id}">${item.productObj?.name}</a>
                    //                          <span class="col-auto badge badge-default" style="background: red;">${item.productObj?.categoryObj?.name}</span>
                    //                           <p class="pb-0 mb-1 mt-1 text-danger" style="font-size: .875em;">Cần đạt mốc  <span class="fw-bolder">${FormatToVND(item.orderPriceApply)}</span</p>
                    //                            <p class="pt-0 mb-0" style="color:#0014ff;font-size: .875em;">Chỉ cần thêm <span class="fw-bolder">${FormatToVND(item.orderPriceApply - parseInt(totalMustPay))} </span>!!</p>
                    //                        </td>
                    //                        <td>
                                                
                    //                        </td> 
                                           
                    //                       </tr>`;
                    //        } 
                    //    });

                    //    if (trProductGiftYouCanGet !== "") {
                            
                    //        listProductGiftYouCanGetHtml = `
                    //            <div class="card mb-3 div_product_gift">
                    //                <div class="card-body">
                    //                    <p class="mb-1">
                    //                        <img style="width: 23px; height: 20px;" src="/img_dev/logo/hotuudai.png"/>
                    //                        <i class="ti-bolt text-danger fw-bolder"></i><span class="fs-6 text-success fw-bolder">Nhận ưu đãi nhiều hơn</span>
                    //                    </p>
                    //                    <table class="table mb-0 align-middle">
                    //                        <tbody id="div_list_product_gift">
                    //                            ${trProductGiftYouCanGet}
                    //                        </tbody>
                    //                    </table> 
                    //                </div>  
                    //            </div>`;
                    //    } else {
                            
                    //        listProductGiftYouCanGetHtml = "";
                    //    }
                    //}
                    if (listProductGiftYouCanGet != null && listProductGiftYouCanGet.length > 0) {
                        $.each(listProductGiftYouCanGet, function (key, item) {
                            if (item.orderPriceApply - parseInt(totalMustPay) > 0) {
                                trProductGiftYouCanGet += `<tr>
                                            <th scope="row">
                                                <a class="div_css_img_quantity" href="/san-pham/${item.productObj?.nameSlug}-${item.productObj?.id}" target="_blank">
                                                    <img src="${item.productObj?.imageObj?.smallUrl != null ? item.productObj?.imageObj?.smallUrl : "/img_dev/error/avatar.png"}" class="blur-up lazyloaded custom_img_product_gift">
                                                </a>
                                                <span class="div_css_quantity">${item.quantityDonation}</span>
                                            </th>
                                            <td>
                                                <a class="sp-line-2 mb-0 font-weight-5 text-dark" target="_blank" style="line-height: normal;" href="/san-pham/${item.productObj?.nameSlug}-${item.productObj?.id}">${item.productObj?.name}</a>
                                                <span class="col-auto badge badge-default" style="background: red;">${item.productObj?.categoryObj?.name}</span>
                                               <p class="pb-0 mb-1 mt-1 text-danger" style="font-size: .875em;">Cần đạt mốc  <span class="fw-bolder">${FormatToVND(item.orderPriceApply)}</span</p>
                                                <p class="pt-0 mb-0" style="color:#0014ff;font-size: .875em;">Chỉ cần thêm <span class="fw-bolder">${FormatToVND(item.orderPriceApply - parseInt(totalMustPay))} </span>!!</p>
                                            </td>
                                            <td>
                                                
                                            </td> 
                                           
                                           </tr>`
                            }

                            listProductGiftYouCanGetHtml = `
                            <div class="card mb-3 div_product_gift">
                                    <div class="card-body">
                                        <p class="mb-1">
                                            <img style="width: 23px; height: 20px;" src="/img_dev/logo/hotuudai.png"/>
                                            <i class="ti-bolt text-danger fw-bolder"></i><span class="fs-6 text-success fw-bolder">Nhận ưu đãi nhiều hơn</span>
                                        </p>
                                  

                                    <table class="table mb-0 align-middle">
                                        <tbody id="div_list_product_gift">
                                                ${trProductGiftYouCanGet}
                                        </tbody>
                                    </table> 
                                </div>  
                            </div>`
                        });
                    } 
                    document.getElementById("div_product_gift_you_can_get").innerHTML = listProductGiftYouCanGetHtml;
                }
            },
            error: function (error) {
                HideOverlay('#div_product_gift_you_can_get');
                document.getElementById("div_product_gift_you_can_get").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="GetListProductGiftYouCanGet();$(this).remove();">
                        </i>
                    </div>`;
                $btnPlaceOrder.attr('disabled', 'disabled');
            }
        })
    }
    catch (e) {
        HideOverlay('#div_product_gift_you_can_get');
        document.getElementById("div_product_gift_you_can_get").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="GetListProductGiftYouCanGet();$(this).remove();">
                        </i>
                    </div>`;
        $btnPlaceOrder.attr('disabled', 'disabled');
    }
}

//Show address list modal
function ShowAddressListModal(elm) {
    var htmlElm = $(elm).html();
    $(elm).attr('onclick', '');
    $(elm).html(_loadAnimationSmallHtml);
    $.ajax({
        type: 'GET',
        url: '/Address/GetListDeliveryAddress',
        success: function (response) {
            $(elm).html(htmlElm);
            $(elm).attr('onclick', 'ShowAddressListModal(this)');
            if (!CheckResponseIsSuccess(response)) return false;

            addressListData = response.data;
            var tmpHtml = ``;
            let addressTmp = '';
            let typeTmp = '';
            if (addressListData != null && addressListData.length > 0) {
                $.each(addressListData, function (key, value) {
                    switch (value.typeId) {
                        case 0: typeTmp = 'Khác'; break;
                        case 1: typeTmp = 'Nhà riêng'; break;
                        case 2: typeTmp = 'Văn phòng'; break;
                        default: break;
                    }
                    addressTmp = `${value.addressText}, ${value.wardName}, ${value.districtName}, ${value.provinceName}`;
                    tmpHtml +=
                        `<tr>
                            <td class="col-2"><label for="input_address_item_${value.id}">${value.name}</label></td>
                            <td class="col-5">
                                <label class="text-left" for="input_address_item_${value.id}">
                                    ${addressTmp}
                                </label>
                            </td>
                            <td class="col-2"><label for="input_address_item_${value.id}">${value.phoneNumber}</label></td>
                            <td class="col-2">
                                <label for="input_address_item_${value.id}"><small>${typeTmp}<small></label>
                            </td>
                            <td class="col-1">
                                <div class="d-flex align-items-center">
                                     <div class="pretty p-svg p-jelly p-round">
                                        <input type="radio" name="input_address_item" id="input_address_item_${value.id}" value="${value.id}" ${addressDefaultData != null && value.id === addressDefaultData.id ? "checked" : ""}>
                                        <div class="state p-success">
                                            <svg class="svg svg-icon" viewBox="0 0 20 20">
                                                <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                                            </svg>
                                            <label for="input_address_item_${value.id}"> </label>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>`;
                });
                document.getElementById("tbody_address_list").innerHTML = tmpHtml;
            }
            else {
                document.getElementById("tbody_address_list").innerHTML =
                    `<tr>
                        <td colspan="4" class="text-center p-2">
                            Sổ địa chỉ của bạn chưa có dữ liệu. Hãy thêm địa chỉ mới.
                        </td>
                    </tr>`;
            }
            $modalListAddress.modal('show');
        },
        error: function (err) {
            $(elm).html(htmlElm);
            $(elm).attr('onclick', 'ShowAddressListModal(this)');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//Save address info
function SaveAddressInfo() {
    var addressId = $('#table_address_list input[name="input_address_item"]:checked').val();
    addressDefaultData = addressListData.find(x => x.id == addressId);
    if (addressId == undefined || addressId == null)
        ShowToastNoti('info', '', 'Vui lòng chọn địa chỉ nhận hàng');
    else
        RawDataAddressInView(addressDefaultData), $modalListAddress.modal('hide');
}

//Show add address modal
function ShowAddAddressModal(elm) {
    var htmlElm = $(elm).html();
    $(elm).attr('onclick', '');
    $(elm).html(_loadAnimationSmallHtml);
    $.ajax({
        type: 'GET',
        url: '/CheckoutWithoutLogin/P_AddAddress',
        success: function (response) {
            $(elm).html(htmlElm);
            $(elm).attr('onclick', 'ShowAddAddressModal(this)');
            $('#div_body_modal_add_address').html(response);
            $modalAddAddress.modal('show');
            $modalListAddress.modal('hide');
            $('.selectpicker').selectpicker();
            initialize('#form_data_add_address', '', '');
            listenOnchangeAddress('#form_data_add_address');

            //Submit form event
            $('#form_data_add_address').on('submit', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                let formElm = $('#form_data_add_address');
                var laddaSubmitFormAddress = Ladda.create(document.querySelector('#btn_submit_form_add_address'));
                let formDataElm = document.getElementById('form_data_add_address');
                let isvalidate = formElm[0].checkValidity();
                let formData = new FormData(formDataElm);
                var validateDropdown = ValidateDropDownAddress(formDataElm.elements);
                let isAddNew = $(formDataElm.elements.isAddNew).is(":checked");
                var data = {
                    name: formDataElm.elements.name.value,
                    phoneNumber: formDataElm.elements.phoneNumber.value,
                    latitude: formDataElm.elements.latitude.value,
                    longitude: formDataElm.elements.longitude.value,
                    addressText: formDataElm.elements.addressText.value,
                    countryId: 1,
                    provinceId: formDataElm.elements.provinceId.value,
                    districtId: formDataElm.elements.districtId.value,
                    wardId: formDataElm.elements.wardId.value,
                    provinceName: $(formDataElm.elements.provinceId).find('option:selected').text(),
                    districtName: $(formDataElm.elements.districtId).find('option:selected').text(),
                    wardName: $(formDataElm.elements.wardId).find('option:selected').text()
                };
                if (isvalidate && validateDropdown) {
                    if (isAddNew) {
                        laddaSubmitFormAddress.start();
                        $.ajax({
                            url: formElm.attr('action'),
                            type: formElm.attr('method'),
                            data: formData,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                laddaSubmitFormAddress.stop();
                                if (!CheckResponseIsSuccess(response)) return false;

                                addressDefaultData = {
                                    id: response.data.id,
                                    isDefault: response.data.isDefault,
                                    typeId: response.data.typeId,
                                    name: formDataElm.elements.name.value,
                                    phoneNumber: formDataElm.elements.phoneNumber.value,
                                    latitude: formDataElm.elements.latitude.value,
                                    longitude: formDataElm.elements.longitude.value,
                                    addressText: formDataElm.elements.addressText.value,
                                    countryId: 1,
                                    provinceId: formDataElm.elements.provinceId.value,
                                    districtId: formDataElm.elements.districtId.value,
                                    wardId: formDataElm.elements.wardId.value,
                                    provinceName: $(formDataElm.elements.provinceId).find('option:selected').text(),
                                    districtName: $(formDataElm.elements.districtId).find('option:selected').text(),
                                    wardName: $(formDataElm.elements.wardId).find('option:selected').text()
                                };
                                RawDataAddressInView(addressDefaultData);
                                $modalAddAddress.modal('hide');
                            }, error: function (err) {
                                laddaSubmitFormAddress.stop();
                                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
                            }
                        });
                    }
                    else {
                        RawDataAddressInView(data);
                        $modalAddAddress.modal('hide');
                    }
                } else {
                    ShowToastNoti('warning', '', _resultActionResource.PleaseWrite);
                }
            });
        },
        error: function (err) {
            $(elm).html(htmlElm);
            $(elm).attr('onclick', 'ShowAddAddressModal(this)');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//Show bank payment
function ShowBankPayment(elm, orderId, totalPay) {
    var id = $(elm).data('id');
    var laddaGetBank = Ladda.create(elm);
    laddaGetBank.start();
    $.ajax({
        type: 'GET',
        url: '/CheckoutWithoutLogin/GetBankList',
        data: { id: id },
        success: function (response) {
            laddaGetBank.stop();
            if (!CheckResponseIsSuccess(response)) return false;

            var listData = response.data;
            var itemBank = ``;
            let resultHtml = '';
            if (listData != null && listData.length > 0) {
                let totalPayHtml = FormatToVNDCustom(totalPay);
                $.each(listData, function (key, value) {
                    itemBank += `
                      <div class="col-12 col-md-6 col-lg-6 mb-2">
                            <ul class="list-group text-left">
                             <li class="list-group-item">
                                    ${IsNullOrEmty(value.bankTradeName) ? '' : `<img class="w-50" src="https://img.vietqr.io/image/${value.bankTradeName}-${value.number}-compact.png?amount=${totalPay}&addInfo=${orderId}" alt="QrCode thanh toán" />`}
                                </li>
                                <li class="list-group-item">
                                    <i class="fa fa-id-card-o mr-1"></i> <span>
                                        Số tài khoản:
                                    </span>${value.number}
                                    <button type="button" class="btn btn-sm p-0 color-default" onclick="CopyText('${value.number}')" title="Sap chép">
                                         <i class="fa fa-clone"></i> <span style="text-transform:none;font-weight:normal;">Sao chép</span>
                                    </button>
                                </li>
                                <li class="list-group-item"><i class="fa fa-user mr-1"></i> <span style="color: #c65610;font-size: 18px;">Tên người nhận: </span>${value.personName}</li>
                                <li class="list-group-item"><i class="fa fa-bank mr-1"></i> <span style="color: #c65610;font-size: 18px;">Ngân hàng: </span>${value.bankName} - ${value.bankTradeName}</li>
                            </ul>
                        </div>
                      
                        `;
                });
                resultHtml =
                    `<h5 class="font-weight-bold text-center text-white text-uppercase" style="background: #1ac138;padding: 5px;"><i class="fa fa-credit-card h4"></i> Thông tin thanh toán</h5>
                        <p class="text-center mb-0">
                            <b>Số tiền: </b>${totalPayHtml}
                        </p>
                        <p class="text-center">
                            <b>Nội dung chuyển khoản: </b><span>${orderId}</span>
                            <button type="button" class="btn btn-sm p-0 color-default" onclick="CopyText('${orderId}')" title="Sap chép">
                                <i class="fa fa-clone"></i> <span style="text-transform:none;font-weight:normal;">Sao chép</span>
                            </button>
                        </p>
                        <div class="row justify-content-center">
                            ${itemBank}
                        </div>
                        `
                document.getElementById("div_bank_qr_code").innerHTML = `    <b style="line-height: 3.2em">Hướng dẫn chuyển khoản</b>
                        <div style="float: left;text-align: left">
                            <p style="">Bước 1: <span>Vào App ngân hàng của bạn</span></p>
                            <p style="">Bước 2: Chọn chức năng quét QR Code và quét mã thanh toán bên cạnh, hoàn tất thanh toán hoặc thực hiện cách sau</p>
                            <p style="">Bước 3: Nhập số tài khoản ngân hàng và tên ngân hàng</p>
                            <p style="">Bước 4: Nhập số tiền thanh toán</p>
                            <p style="">Bước 5: <span class="text-danger">Nhập nội dung chuyển khoản như hình bên</span></p>
                            <p style="">Bước 6: Kiểm tra thông tin và chuyển khoản</p>
                        </div>`;
                document.getElementById("div_body_modal_bank_list").innerHTML = resultHtml;
                $modalListBank.modal('show');
            } else {
                ShowToastNoti('warning', '', 'Shop chưa có thông tin chuyển khoản');
            }
        }, error: function (err) {
            laddaGetBank.stop();
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//Show bank payment
function ShowBankPaymentInPanel(elm, orderId, totalPay) {
    var id = $(elm).data('id');
    ShowOverlay('#div_bank_info_panel');
    $.ajax({
        type: 'GET',
        url: '/CheckoutWithoutLogin/GetBankList',
        data: { id: id },
        success: function (response) {
            HideOverlay('#div_bank_info_panel');
            if (!CheckResponseIsSuccess(response)) return false;

            var listData = response.data;
            var itemBank = ``;
            let resultHtml = '';
            if (listData != null && listData.length > 0) {
                let totalPayHtml = FormatToVNDCustom(totalPay);
                $.each(listData, function (key, value) {
                    itemBank +=
                        `<div class="col-10 col-md-12 mb-2">
                            <ul class="list-group text-left">
                              <li class="list-group-item">
                                    ${IsNullOrEmty(value.bankTradeName) ? '' : `<img class="w-50" src="https://img.vietqr.io/image/${value.bankTradeName}-${value.number}-compact.png?amount=${totalPay}&addInfo=${orderId}" alt="QrCode thanh toán" />`}
                                </li>
                                <p style="font-style: italic">Lưu ý: (Quý khách có thể chụp màn hình mã QR và vào ứng dụng ngân hàng, chọn tải ảnh màn hình vừa chụp lên app ngân hàng để hệ thống tự động điền dữ liệu thanh toán nhé)</p>
                                <li class="list-group-item">
                                    <i class="fa fa-id-card-o mr-1"></i> <span>
                                        STK:
                                    </span>
                                    <b class="color-default mx-2 text-danger" style="display: inline-flex;">
                                        ${value.number}
                                         <button type="button" class="btn btn-sm p-0 color-default mx-1" onclick="CopyText('${value.number}')" title="Sap chép">
                                         <i class="fa fa-clone"></i> <span style="text-transform:none;font-weight:normal;"></span>
                                    </button>
                                    </b>
                                   
                                </li>
                                <li class="list-group-item"><i class="fa fa-user mr-1"></i> <span>Tên người nhận: </span><b class="color-default text-danger mx-1">${value.personName}</b></li>
                                <li class="list-group-item"><i class="fa fa-bank mr-1"></i> <span>Ngân hàng: </span><b class="color-default text-danger">${value.bankName} - ${value.bankTradeName}</b></li>
                            </ul>
                        </div>`;
                });
                resultHtml =
                    `<h5 class="font-weight-bold text-white text-success text-uppercase" style="background: #357ebd;"><i class="fa fa-credit-card h4 mt-1"></i> Thông tin thanh toán</h5>
                        <p class="text-center mb-0">
                            <span>Số tiền: </span><b class="color-default text-danger mx-2">${totalPayHtml}</b>
                        </p>
                        <p class="text-danger">
                            <span class="font-size: 16px;">Nội dung chuyển khoản: </span><b class="color-default mx-2" style="display: inline-flex;">
                                ${orderId}
                                 <button type="button" class="btn btn-sm p-0 color-default mx-2" onclick="CopyText('${orderId}')" title="Sap chép">
                                <i class="fa fa-clone"></i> <span style="text-transform:none;font-weight:normal;"></span>
                            </button>
                            </b>
                           
                        </p>
                        <div class="row justify-content-center">
                            ${itemBank}
                        </div>`
                document.getElementById("div_bank_info_panel").innerHTML = resultHtml;
                document.getElementById("div_bank_qr_code").innerHTML = `
                     <h5 class="text-success text-uppercase fw-bold" style="color: #2f71a9;">Hướng dẫn chuyển khoản</h5>
                        <div style="float: left;text-align: left">
                            <h5 class="fw-bold text-black" style="">Bước 1: <span>Vào App ngân hàng của bạn</span></h5>
                            <h5 class="fw-bold text-black" style="">Bước 2: Nhập số tài khoản ngân hàng và tên ngân hàng</h5>
                            <h5 class="fw-bold text-black" style="">Bước 3: Nhập số tiền thanh toán</h5>
                            <h5 class="fw-bold text-black" style="">Bước 4: <span style="font-size: 14px;" class="text-danger">Nhập nội dung chuyển khoản như hình bên</span></h5>
                            <h5 class="fw-bold text-black" style="">Bước 5: Kiểm tra thông tin và chuyển khoản</h5>
                        </div>
                `;
                $(elm).remove();
            } else {
                document.getElementById("div_bank_info_panel").innerHTML = '<p class="text-center text-muted">Shop chưa có thông tin chuyển khoản</p>';
            }
        }, error: function (err) {
            HideOverlay('#div_bank_info_panel');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//Raw data address in view
function RawDataAddressInView(data) {
    var location = `${data.addressText}, ${data.wardName}, ${data.districtName}, ${data.provinceName}`;
    $('#b_address_name').text(data.name);
    $('#span_address_phone').text(data.phoneNumber);
    $('#span_address_location').text(location);
    $('#input_address_delivery_name').val(data.name);
    $('#input_address_delivery_location').val(location);
    $('#input_address_delivery_phonenumber').val(data.phoneNumber);
    $('#input_addressie_latitude').val(data.latitude);
    $('#input_addressie_longitude').val(data.longitude);
    $('#input_addressie_address_text').val(data.addressText);
    $('#input_addressie_country_id').val(data.countryId);
    $('#input_addressie_province_id').val(data.provinceId);
    $('#input_addressie_district_id').val(data.districtId);
    $('#input_addressie_ward_id').val(data.wardId);
    $('#input_addressie_province_name').val(data.provinceName);
    $('#input_addressie_district_name').val(data.districtName);
    $('#input_addressie_ward_name').val(data.wardName);
    /*    LoadListFeeShip();*/
}

//Check validate dropdown
function ValidateDropDownAddress(elmForm) {
    var isValid = true;
    var $name = $('#ul_parsley_name');
    var $phonenumber = $('#ul_parsley_phonenumber');
    var $addresstext = $('#ul_parsley_addresstext');
    var $province = $('#ul_parsley_province');
    var $district = $('#ul_parsley_district');
    var $ward = $('#ul_parsley_ward');

    $('#form_data_add_address #name').on('keyup', function () {
        let value = $(this).val();
        CheckRequired($name, value)
    });
    $('#form_data_add_address #phoneNumber').on('keyup', function () {
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
    $('#form_data_add_address #addressText').on('keyup', function () {
        let value = $(this).val();
        CheckRequired($addresstext, value);
    });
    $('#form_data_add_address #provinceId').on('change', function () {
        let value = $(this).val();
        CheckRequired($province, value);
        setTimeout(function () {
            let district = $('#form_data_add_address #districtId');
            let ward = $('#form_data_add_address #wardId')
            CheckRequired($district, district.val());
            CheckRequired($ward, ward.val());
        }, 200);
    });
    $('#form_data_add_address #districtId').on('change', function () {
        let value = $(this).val();
        CheckRequired($district, value);
        setTimeout(function () {
            let ward = $('#form_data_add_address #wardId');
            CheckRequired($ward, ward.val());
        }, 200);
    });
    $('#form_data_add_address #wardId').on('change', function () {
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

//On change province form
function GetListProvinces() {
    $('#select_ward').val('')
    $('#select_ward').attr('disabled', true);
    $('#select_ward').html('<option value="0">--Chọn--</option>')
    $('#select_district').val('')
    $('#select_district').attr('disabled', true);
    $('#select_district').html('<option value="0">--Chọn--</option>')
    $.ajax({
        type: 'GET',
        url: '/Common/GetProvinceJson',
        data: {

        },
        dataType: 'json',
        success: function (response) {

            HideOverlay3Dot('#div_select_district');
            if (!CheckResponseIsSuccess(response)) return false;

            var $filterSelectProvince = $('#select_province');
            $filterSelectProvince.html('<option value="0">--Chọn--</option>');
         
            $.each(response.data, function (index, province) {

                $filterSelectProvince.append($('<option></option>').attr('value', province.id).text(province.name));

            });

            $filterSelectProvince.attr('disabled', false);

        },
        error: function (err) {
            HideOverlay3Dot('#div_select_district');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//On change district form
function GetListDistricts(elm) {
    $('#select_ward').val('')
    $('#select_ward').attr('disabled', true);
    $('#select_ward').html('<option value="0">--Chọn--</option>')

   
    var provinceId = $(elm).val();
    $.ajax({
        type: 'GET',
        url: '/Common/GetDistrictJson',
        data: {
            provinceId: provinceId
        },
        dataType: 'json',
        success: function (response) {
            HideOverlay3Dot('#div_select_district');
            if (!CheckResponseIsSuccess(response)) return false;

            var $filterSelectDistrict = $('#select_district');
            $filterSelectDistrict.html('<option value="0">--Chọn--</option>');
            $.each(response.data, function (index, district) {
                $filterSelectDistrict.append($('<option></option>').attr('value', district.id).text(district.name));
            });
            $filterSelectDistrict.attr('disabled', false);
            
        },
        error: function (err) {
            HideOverlay3Dot('#div_select_district');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}
//Get list Ward
function GetListWards(elm) {
    var districtId = $(elm).val();
    $.ajax({
        type: 'GET',
        url: '/Common/GetWardJson',
        data: {
            districtId: districtId // Truyền districtId đã được chọn từ dropdown của quận/huyện
        },
        dataType: 'json',
        success: function (response) {
            HideOverlay3Dot('#div_select_ward');
            if (!CheckResponseIsSuccess(response)) return false;

            var $filterSelectWard = $('#select_ward');
            $filterSelectWard.html('<option value="0">--Chọn--</option>');
            $.each(response.data, function (index, ward) {
                $filterSelectWard.append($('<option></option>').attr('value', ward.id).text(ward.name));
            });
            $filterSelectWard.attr('disabled', false);

        },
        error: function (err) {
            HideOverlay3Dot('#div_select_ward');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

function NoneRecord() {
    var html = `<div class="col-sm-12 text-center p-2">
                    <img src="/img_dev/error/datanull.jpg" style="width:150px;" alt="No data" />
                    <p>Không có sản phẩm nào trong giỏ hàng của bạn.</p>
                    <a href="/san-pham" class="btn btn-solid">Tiếp tục mua sắm</a>
                </div>`;
    $('#div_zone_cart').html(html);
    $btnPlaceOrder.attr('disabled', 'disabled');
}

//Calulate total price item
function RefreshTotalItem(totalPay, countItem) {
    $('#span_total_price_all_item').text(FormatToVNDCustom(totalPay));
    $('#b_count_cart_item').text(countItem);
}

//Calulate total pay

function RefreshTotalPay() {
    var toalItem = FormatToNumerCustom($('#span_total_price_all_item').text());

    var span_transport_fee = FormatToNumerCustom($('#span_transport_fee').text());
    var totalPay = toalItem + span_transport_fee;
    $('#span_total_price_payment').text(FormatToVNDCustom(totalPay));
}
//function RefreshTotalPay() {
//    var totalItem = FormatToNumerCustom($('#span_total_price_all_item').text());
//    var valuePrice = 0, priceFormat = 0, totalPay = 0;
//    if (!IsNullOrEmty($('#span_transport_fee').text()) && $('#span_transport_fee').text().trim() != "(chưa tính)") {
//        valuePrice = $('#span_transport_fee').text().replace("đ", "");
       
//        priceFormat = parseInt(valuePrice.replace(".", ""))
//    }
//    console.log(totalItem, priceFormat);
//    totalPay = totalItem + priceFormat;

//    $('#span_total_price_payment').text(FormatToVNDCustom(totalPay));
//}
//Load list fee ship
function LoadListFeeShip() {
    let countryId = $('#input_addressie_country_id').val();
    let provinceId = $('#input_addressie_province_id').val();
    ShowOverlayLoadingButton('#div_shipping_fee_list');
       /*$btnPlaceOrder.attr('disabled', true);*/
    $.ajax({
        type: 'GET',
        url: '/CheckoutWithoutLogin/GetListFeeShipSupplier',
        data: {
            countryId: 1,
            provinceId: $filterSelectProvince.val(),
        },
        dataType: "json",
        success: function (response) {
            HideOverlayLoadingButton('#div_shipping_fee_list');
            if (!CheckResponseIsSuccess(response)) return;
            document.getElementById("span_transport_fee").innerHTML = '(chưa tính)';
            //Has data
            if (response.data != null && response.data.length > 0) {

                $btnPlaceOrder.attr('disabled', false);
                let listData = response.data.filter(x => x.status === 1);
                if (listData.length === 0) {
                    //No data
                    document.getElementById("div_shipping_fee_list").innerHTML = MESSAGE_NOT_FOUND_FEESHIP;
                    return false;
                }
                if (listData[0].shippingPriceObj.length === 0) {
                    //No data
                    document.getElementById("div_shipping_fee_list").innerHTML = MESSAGE_NOT_FOUND_FEESHIP;
                    return false;
                }
                let html = '';
                listData[0].shippingPriceObj.forEach(function (item, index) {
                    html += ` <div class="col-xxl-12 div_fee_ship_css_payment my-2 mx-2">
                                  <div class="delivery-option div_css_delivery_payment d-flex">
                                      <div class="delivery-category">
                                          <div class="shipment-detail">
                                              <div class="form-check custom-form-check hide-check-box">
                                                  <input class="form-check-input" type="radio"
                                                         name="shipping_method" data-feeship="${item.feeShip ?? 0}" value="${item.id}" id="shipping_method_${index}" id="standard" checked>
                                                  <label class="form-check-label"
                                                         for="shipping_method_${index}">
                                                     ${item.name ?? ''}
                                                  </label>
                                              </div>
                                                                      
                                          </div>
                                     </div>
                                      <span>${item.feeShip != null ? FormatToVND(item.feeShip) : 0}</span>
                                  </div>
                              </div>`;
                });
                document.getElementById("div_shipping_fee_list").innerHTML = `<div class="col-12 border_bottom section over-hide z-bigger row" style="padding:4px;">${html}</div>`;

                $('[name="shipping_method"]').on('change', function () {
                    let feeShip = parseInt($('[name="shipping_method"]:checked').attr('data-feeship'));
                    $('#span_transport_fee').html(FormatToVNDCustom(feeShip));
                    $('#input_feeship_calculate').val(feeShip);
                    RefreshTotalPay();
                });
                $(`#shipping_method_0`).click(); $('[name="shipping_method"]').change();
                return;
            }
            else {
                RefreshTotalPay();
            }
            //No data
            document.getElementById("div_shipping_fee_list").innerHTML = MESSAGE_NOT_FOUND_FEESHIP;
        },
        error: function (err) {
            HideOverlayLoadingButton('#div_shipping_fee_list');
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

function FormatToNumerCustom(value) {
    return Number(value.replace(/[^0-9,-]+/g, ""));
}


function OnChangeProvince() {
    ShowOverlay($filterSelectProvince);
    $filterSelectProvince.html('<option value="">--Chọn--</option>');
    $filterSelectProvince.selectpicker("refresh");
    $filterSelectProvince.selectpicker("val", 0);

    $filterSelectWard.html('<option value="0">--Chọn--</option>');
    $filterSelectWard.selectpicker("refresh");
    $filterSelectWard.selectpicker("val", 0);
    $.ajax({
        type: "POST",
        url: "/Common/OnChangeProvince",
        data: {
            id: 1
        },
        dataType: 'json',
        success: function (response) {
            $($($filterSelectProvince.parent()).parent()).fadeIn(200);
            HideOverlay($filterSelectProvince);
            let defaultChoose = `<option value="0">--Chọn--</option>`;
            var html = ``;
            var data = response.data
            $.each(data, function (key, item) {
                html += `<option value="${item.id}">${item.name}</option>`
            })

            $filterSelectProvince.html(defaultChoose + html);
            $filterSelectProvince.selectpicker("refresh");
            $filterSelectProvince.selectpicker("val", $filterSelectProvince.first().val());

            $filterSelectDistrict.html('<option value="0">--Chọn--</option>');
            $filterSelectDistrict.selectpicker("refresh");
            $filterSelectDistrict.selectpicker("val", 0);

            $filterSelectWard.html('<option value="0">--Chọn--</option>');
            $filterSelectWard.selectpicker("refresh");
            $filterSelectWard.selectpicker("val", 0);
        },
        error: function (err) {
            HideOverlay($filterSelectProvince);
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}
function OnChangeDistrict(elm) {
    let value = $(elm).val();
    if (value == 0) {
        $filterSelectDistrict.html('<option value="0">--Chọn--</option>');
        $filterSelectDistrict.selectpicker("refresh");
        $filterSelectDistrict.selectpicker("val", 0);

        $filterSelectWard.html('<option value="0">--Chọn--</option>');
        $filterSelectWard.selectpicker("refresh");
        $filterSelectWard.selectpicker("val", 0);
    } else {
        ShowOverlay($filterSelectWard);
        $filterSelectDistrict.html('<option value="0">--Chọn--</option>');
        $filterSelectDistrict.selectpicker("refresh");
        $filterSelectDistrict.selectpicker("val", 0);
        $.ajax({
            type: "POST",
            url: "/Common/OnChangeDistrict",
            data: {
                provinceId: value
            },
            dataType: 'json',
            success: function (response) {
                $($($filterSelectProvince.parent()).parent()).fadeIn(200);
                HideOverlay($filterSelectWard);
                var html = ``;
                var data = response.data
                $.each(data, function (key, item) {
                    html += `<option value="${item.id}">${item.name}</option>`
                })
                let defaultChoose = `<option value="0">--Chọn--</option>`;
                $filterSelectDistrict.html(defaultChoose + html);
                $filterSelectDistrict.selectpicker("refresh");
                $filterSelectDistrict.selectpicker("val", $filterSelectDistrict.first().val());
            },
            error: function (err) {
                HideOverlay($filterSelectWard);
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    }
}
function OnChangeWard(elm) {
    let value = $(elm).val();
    if (value == 0) {
        $filterSelectWard.html('<option value="0">--Chọn--</option>');
        $filterSelectWard.selectpicker("refresh");
        $filterSelectWard.selectpicker("val", 0);
    } else {
        ShowOverlay($filterSelectWard);
        $filterSelectWard.html('<option value="0">--Chọn--</option>');
        $filterSelectWard.selectpicker("refresh");
        $filterSelectWard.selectpicker("val", 0);
        $.ajax({
            type: "POST",
            url: "/Common/OnChangeWard",
            data: {
                districtId: value
            },
            dataType: 'json',
            success: function (response) {
                $($($filterSelectDistrict.parent()).parent()).fadeIn(200);
                HideOverlay($filterSelectWard);

                let defaultChoose = `<option value="0">--Chọn--</option>`;
                var html = ``;
                var data = response.data
                $.each(data, function (key, item) {
                    html += `<option value="${item.id}">${item.name}</option>`
                })
                $filterSelectWard.html(defaultChoose + html);
                $filterSelectWard.selectpicker("refresh");
                $filterSelectWard.selectpicker("val", $filterSelectWard.first().val());
            },
            error: function (err) {
                HideOverlay($filterSelectWard);
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    }
}
function FindItemInArray(arr, key, value) {
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] == value) return arr[i];
        }
    }
    return false;
}
function RemoveItemInArray(arr, item) {
    return arr.splice(arr.indexOf(item), 1);;
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
