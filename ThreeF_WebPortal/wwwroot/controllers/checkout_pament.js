
var $btnPlaceOrder = $('#btn_place_order');
var $modalAddAddress = $('#modal_add_address'),
    $modalListAddress = $('#modal_address_list'),
    $modalListBank = $('#modal_bank_list');
var addressDefaultData;
var addressListData = [];
var cartItemData = [];
var xhrGetFeeShip_GHTK;
var laddaPlaceOrder = Ladda.create(document.querySelector('#btn_place_order'));
const MAX_COST_DELIVERY_GHTK = 20000000; //VND
const MAX_TOTAL_WEIGHT_DELIVERY_GHTK = 20; //KG
var typeCarrier = $('#input_default_carrierId').val();
const MESSAGE_NOT_FOUND_FEESHIP = '<p class="text-danger mt-3 my-2" style="text-align: center;font-size: 15px">Phí vận chuyển của bạn sẽ được tính khi shipper giao hàng đến.!!</p>';

function tableDataHtml(data) {
    //Get record
    var shopItem = '';
    var productItem = '';
    var countPackage = 0;
    var countItem = 0;
    var totalPriceItem = 0;
    $.each(data, function (key, value) {
        productItem = '';
        shopUrl = value.shopUrl;
        shopId = value.code;
        countPackage++;
        value.productItem.forEach(function (item, index) {
            countItem++;
            sizeTmp = '', colorTmp = '', priceDiscount = 0, priceTmp = '', discountTmp = '';
            priceDiscount = item.discount > 0 ? (item.price - item.discount) : item.price;
            priceTmp = item.discount > 0 ? CalDiscountPrice(item.price, item.discount) : FormatToVNDCustom(item.price);
            discountTmp = item.discount > 0 ? `<del>${FormatToVNDCustom(item.price)}</del>` : "";
            totalPriceItem += priceDiscount * item.quantity;
            typeNameTmp = item.typeName != null && item.typeName.length > 30 ? item.typeName.substring(0, 30) + "..." : item.typeName;
            sizeTmp = item.sizeName != null && item.sizeName.length > 30 ? item.sizeName.substring(0, 30) + "..." : item.sizeName;
            colorTmp = item.colorName != null && item.colorName.length > 30 ? item.colorName.substring(0, 30) + "..." : item.colorName;
            productItem +=
                `<li>
                                <div class="product-thumbnail">
                                    <div class="product-thumbnail__wrapper" data-tg-static="" style="width:50px; height:50px">
                                        <img src="${item.imageUrl}" class="product-thumbnail__image w-100 h-100" alt="${item.name}" style="object-fit: cover" onerror="this.onerror=null;this.src='/assets/images/error/product_1x1_medium.png';">
                                        
                                    </div>
                                   
                                </div>
                                <div>
                                    <h4 data-toggle="tooltip" title="${item.name ?? ''}" class="mx-2 clamp_name">${IsNullOrEmty(item.name) ? "" : item.name} </h4>
                                    <span class="price_css_div">${typeNameTmp}</span>
                                </div>
                                
                                
                                    
                                <div class="mx-2" style="right: 0;position: absolute">
                                      <p class="pb-0 mb-1 mt-1 text-danger" style="font-size: 13px;"><span class="fw-bolder">${priceTmp}</span</p>
                                      <p class="pt-0 mb-0" style="color:#0014ff;font-size: 12px;">Số lượng: <span class="fw-bolder">${item.quantity}</span></p>
                                </div>
                            </li>`;
        });

    });

    RefreshTotalItem(totalPriceItem, countItem);
    return productItem;
}

function orderReviewHtml(data, orderList, productGiftSeleted) {
    var item = productGiftSeleted;
    // Get record
    var shopItem = '';
    var productItem = '';
    var productGiftHtml = '';
    var totalPriceItem = 0;
    var totalPriceOneOrder = 0;
    let orderCode = '';
    let feeShip = 0;
    var paymentMethod = $('input[type="radio"][name="input_payment_group"]:checked').val();
    var value; // Declare the 'value' variable outside the loop

    if (productGiftSeleted != null) {
        productGiftHtml = `
           <td style="margin: auto">
                    <table class="product-table"
                           align="center"
                           border="0"
                           cellpadding="0"
                           cellspacing="0"
                           width="100%">
                        <tbody>
                         <td style="font-size: 15px;">
                                        <h5 style="fw-bold">
                                        <i class="fa-solid fa-gift flashit" style="font-size: 20px;color: #d36611;"></i>Quà tặng
                                    </h5>
                                </td>
                            <tr>
                                <td style="width: 100px; border-bottom: 1px solid rgba(217, 217, 217, 0.5); ">
                                    <img style="width: 100%" src="${item.productObj?.imageObj?.smallUrl != null ? item.productObj?.imageObj?.smallUrl : "/img_dev/error/avatar.png"}" alt="" />
                                </td>
                                <td style="
                              padding: 28px 0;
                              border-bottom: 1px solid rgba(217, 217, 217, 0.5);
                            ">
                                    <ul class="product-detail">
                                        <li>${item.productObj?.categoryObj?.name}</li>
                                        <li>Số lượng: <span> x${item.quantityDonation}</span></li>
                                        <li>Giá: <span style="color: red">${(item.productObj?.productPriceObj[0]?.priceOut != null) ? FormatToVND(item.productObj?.productPriceObj[0]?.priceOut) : ""}</span></li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
        `;
    } else {
        productGiftHtml = ``;
    }

    $.each(data, function (key, val) {
        value = val; // Assign the value inside the loop
        productItem = '';
        totalPriceOneOrder = 0;

        // Rest of the code...

        $.each(value.productItem, function (index, item) {
            let sizeTmp = '', colorTmp = '', priceDiscount = 0, priceTmp = '';
            priceDiscount = item.discount > 0 ? (item.price - item.discount) : item.price;
            priceTmp = item.discount > 0 ? CalDiscountPrice(item.price, item.discount) : FormatToVNDCustom(item.price);
            totalPriceItem += priceDiscount * item.quantity;
            totalPriceOneOrder += priceDiscount * item.quantity;
            typeNameTmp = item.typeName != null && item.typeName.length > 30 ? item.typeName.substring(0, 30) + "..." : item.typeName;
            sizeTmp = item.sizeName != null && item.sizeName.length > 30 ? item.sizeName.substring(0, 30) + "..." : item.sizeName;
            colorTmp = item.colorName != null && item.colorName.length > 30 ? item.colorName.substring(0, 30) + "..." : item.colorName;
            productItem +=
                `
                           
                                        <table class="product-table" align="center" border="0" cellpadding="0"
                                               cellspacing="0" width="100%">
                                             <tbody >
                                                <tr>
                                                    <td style="padding: 0 7px;border-bottom: 1px solid rgba(217, 217, 217, 0.5);width:100px">
                                                        <img src="${item.imageUrl}" alt="${item.name}" style="width: 100%;height:100%; object-fit:cover" onerror="this.onerror=null;this.src='/img_dev/error/product.png';">
                                                    </td>
                                                    <td style="max-width:100%;padding: 28px 0;border-bottom: 1px solid rgba(217, 217, 217, 0.5);">
                                                        <ul class="product-detail">
                                                            <li class="d-flex justify-content-between">${IsNullOrEmty(item.name) ? "" : item.name}<span class="col-auto badge badge-default mx-2 bs-danger text-white">${IsNullOrEmty(item.typeName) ? "" : item.typeName}</span></li>
                                                            
                                                            <li>Số lượng: <span>${item.quantity}</span></li>
                                                            <li><span class="text-danger">${priceTmp}</span></li>
                                                        </ul>
                                                    </td>
                                                </tr>


                                            </tbody>
                                        </table>
                                 
                           `;
        });

        orderCode = orderList.find(x => x.supplierId === value.id).id;
        feeShip = IsNullOrEmty($('#input_feeship_calculate').val()) ? 0 : parseInt($('#input_feeship_calculate').val());
        totalPriceItem = totalPriceItem + feeShip;

        var buttonShowBankList = parseInt(paymentMethod) === 2 ?
            `<li style="height: 28px;">
                <button type="button" data-id="${value.id}" id="btn_show_bank_info" onclick="ShowBankPaymentInPanel(this,'${orderCode}','${totalPriceOneOrder + feeShip}')"
                    class="btn btn-xs btn-solid font-weight-bold float-right mt-2 ladda-button" dir="ltr" style="background: cornflowerblue;color: #fff;" data-style="zoom-in">Xem TT thanh toán</button>
            </li>` : "";

        shopItem = `
            <td style="width: 100%;max-height: 300px;overflow-y: auto">
            <div class="col-12 mt-4" style="margin-bottom:10px;margin-top:-6px;">
                        <p><b>Đơn hàng:</b><span class="color-default ml-1">#${orderCode}
                         <button style="display: contents;;color: red" type="button" class="btn btn-sm p-0 color-default" onclick="CopyText('${orderCode}')" title="Sao chép">
                                <i class="fa fa-clone"></i> <span style="text-transform:none;font-weight:normal;">Sao chép</span>
                            </button></span></p>
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
    });

    $('#span_order_review_total_pay').text(FormatToVNDCustom(totalPriceItem));
    document.getElementById("div_list_order_item").innerHTML = shopItem;
    document.getElementById("div_list_order_product_gift").innerHTML = productGiftHtml;
    if (parseInt(paymentMethod) === 2)
        ShowBankPaymentInPanel('#btn_show_bank_info', orderCode, totalPriceOneOrder + feeShip);
}

//ChangeURLWithOut("Mua hàng", "/checkout/payment");

$(document).ready(function () {

    //Init bootstrap max length
    $("#input_remark").maxlength({
        alwaysShow: !0,
        warningClass: "badge badge-success",
        limitReachedClass: "badge badge-danger"
    });

    GetListAddress();
    LoadListCart();

});

//Event onclick button place order
function RunJs() {
    //Button place order
    $btnPlaceOrder.on('click', function () {
        var listId = [];
        cartItemData.forEach((item, index) => {
            item.productItem.forEach((value) => { listId.push(`${value.cartId}:1`); });
        });
        let addressName = $('#input_address_delivery_name').val().trim();
        let addressPhone = $('#input_address_delivery_phonenumber').val().trim();
        let addressLocation = $('#input_address_delivery_location').val().trim();
        let remark = $('#input_remark').val().trim();
        let paymentMethod = $('input[name="input_payment_group"]:checked').val();
        let feeShip = $('input[name="input_fee_ship"]:checked').val() ?? '';
        let addressIe = {
            latitude: $('#input_addressie_latitude').val(),
            longitude: $('#input_addressie_longitude').val(),
            addressText: $('#input_addressie_address_text').val().trim(),
            countryId: $('#input_addressie_country_id').val().trim(),
            provinceId: $('#input_addressie_province_id').val().trim(),
            districtId: $('#input_addressie_district_id').val().trim(),
            wardId: $('#input_addressie_ward_id').val().trim(),
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
        if (listId.length > 0) {
            if (!IsNullOrEmty(addressName) && !IsNullOrEmty(addressLocation) && !IsNullOrEmty(addressPhone)) {

                let formData = new FormData();
                formData.append("sequenceShoppingCartItemId", JSON.stringify(listId).replace(/"/g, ''));
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
                formData.append("shippingPriceId", feeShip);
                formData.append("companyTaxNumber", '');
                formData.append("companyName", '');
                formData.append("companyAddress", '');
                formData.append("remark", remark);
                formData.append("productGiftId", productGiftId);

                //formData.append("listDataFeeShip", listDataFeeShip);
                //formData.append("carrierCode", carrierCode);
                //formData.append("tokenCarrier", tokenCarrier);

                laddaPlaceOrder.start();

                $.ajax({
                    type: 'POST',
                    url: '/Checkout/PlaceOrder',
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
                        orderReviewHtml(cartItemData, listData, productGiftSeleted);
                        $("html, body").animate({
                            scrollTop: 0
                        }, 0);
                        $('.section_place_order').fadeOut(300).remove().delay(100);
                        $('.section_order_success').fadeIn(300);
                        CountShoppingCartItem();
                    },
                    error: function (err) {
                        laddaPlaceOrder.stop();
                        CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
                    }
                });
            } else {
                ShowToastNoti('warning', '', 'Vui lòng chọn địa chỉ nhận hàng');
            }
        } else {
            ShowToastNoti('info', '', 'Không có sản phẩm nào được chọn. Vui lòng chọn sản phẩm ở giỏ hàng', 5000);
        }
    });


    var input_default_addressJsonString = $('#input_default_address').val();
    if (!IsNullOrEmty(input_default_addressJsonString) && input_default_addressJsonString != "null")
        addressDefaultData = JSON.parse(input_default_addressJsonString), RawDataAddressInView(addressDefaultData);
    else
        $('#span_address_location').html('<a href="javascript:void(0)" onclick="GetListAddress()">Vui lòng chọn địa chỉ nhận hàng</a>'),
            document.getElementById("div_shipping_fee_list").innerHTML = _imgNotFoundHtml,
            $('#span_address_phone').text('');
}
//Load list cart
function LoadListCart() {
    var listItem = $('#input_list_cart_item_selected').val();

    try {
        ShowOverlayLoadingButton('#div_zone_cart');
        $.ajax({
            type: 'GET',
            url: '/Checkout/GetCartSelectData',
            data: {
                listItem: listItem,
            },
            dataType: "json",
            success: function (response) {
                HideOverlayLoadingButton('#div_zone_cart');
                //Fail link
                if (response.result === -1 && response.code === -1) {
                    location.href = "/checkout/cart";
                    return;
                }

                //Check error code
                if (response.result !== 1) {
                    document.getElementById("div_zone_cart").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListCart();$(this).remove();">
                        </i>
                    </div>`;
                    $btnPlaceOrder.attr('disabled', 'disabled');
                    return;
                }

                //Success
                cartItemData = response.data;
                listProductPrice = response.data2nd;

                var listProductGift = '';
                if (cartItemData != null && cartItemData.length > 0) {
                    document.getElementById("div_zone_cart").innerHTML = tableDataHtml(cartItemData);
                    GetListProductGiftYouCanGet();
                    $btnPlaceOrder.attr('disabled', false);
                } else {
                    NoneRecord();
                };


                //Product gift
                if (listProductPrice != null && listProductPrice.length > 0) {
                    $.each(listProductPrice, function (key, item) {
                        listProductGift += `  <div class="col-12 row m-0 p-2" style="border-bottom: 1px solid #e3cece;">
                                            <div class="col-auto px-1" style="width:85px; height:70px">
                                                <a href="/san-pham/${item.productObj?.nameSlug}-${item.productObj?.id}" target="_blank"><img src="${item.productObj?.imageObj?.smallUrl != null ? item.productObj?.imageObj?.smallUrl : "/img_dev/error/avatar.png"}" class="img-fluid img-thumbnail" loading="lazy" style="width:100%; height:100%;object-fit: cover" alt="${item.name}" onerror="this.onerror=null;this.src='/assets/images/error/product_1x1_medium.png';"></a>
                                            </div>
                                            <div class="col">
                                                <a href="javascript:void(0);">
                                                    <div class="div_desktop_custom text-muted" title="${IsNullOrEmty(item.name) ? "" : item.name}${IsNullOrEmty(typeNameTmp) ? '' : ' (' + typeNameTmp + ')'}">
                                                      <span class="sp-line-2 fs-6 text-black">${item.productObj?.name}</span>
                                                        <span class="price_css_div">${(item.productObj?.productPriceObj[0]?.typeName != null) ? FormatToVND(item.productObj?.productPriceObj[0]?.typeName) : ""}</span>
                                                    </div>
                                                 
                           
                                                </a>
                                            </div>
                                            <div class="col-md-4 col-lg-4 col-xl-4 text-right d-flex align-items-center justify-content-between">
                  
                                                 <td>
                                                   <div class="price_css_respon" >
                                                     <span class="m-0 color-default fs-6 mx-2" style="color: red">${(item.productObj?.productPriceObj[0]?.priceOut != null) ? FormatToVND(item.productObj?.productPriceObj[0]?.priceOut) : ""}</span>
                                                     <span class="fs-6"> x${item.quantityDonation}</span>
                                                    </div>
                                                         <div class="pretty p-icon p-round p-jelly" style="float: right">
                                                             <input id="${item.id}" type="checkbox" class="checkbox_product_gift" />
                                                             <div class="state p-success">
                                                                 <i class="fas fa-check icon"></i>
                                                                 <label></label>
                                                             </div>
                                                         </div>
                                                   </td>
                                            </div>
                                        </div>`
                    }
                    );
                    if (cartItemData != null && cartItemData.length > 0) {
                        document.getElementById("div_product_gift").innerHTML = listProductGift;


                        //document.getElementById("div_product_gift_wrapper").innerHTML = listProductGift;
                    } else {
                        NoneRecord();
                    }


                    $('.checkbox_product_gift').click(function () {
                        $('.checkbox_product_gift').not(this).prop('checked', false);
                    });
                    //let getValueProductGiftId = $('.checkbox_product_gift:checked').attr("id");

                    //if (getValueProductGiftId != undefined || getValueProductGiftId != null) {
                    //    productGiftId = getValueProductGiftId;

                    //} else {
                    //    productGiftId = "";

                    //}
                }

                else {
                    $('.li_product_gift_wrapper').hide();
                }

                //Run js when cart load success
                RunJs();

            },
            error: function (error) {
                HideOverlayLoadingButton('#div_zone_cart');
                document.getElementById("div_zone_cart").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListCart();$(this).remove();">
                        </i>
                    </div>`;
                $btnPlaceOrder.attr('disabled', 'disabled');
            }
        })
    }
    catch (e) {
        HideOverlayLoadingButton('#div_zone_cart');
        document.getElementById("div_zone_cart").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListCart();$(this).remove();">
                        </i>
                    </div>`;
        $btnPlaceOrder.attr('disabled', 'disabled');
    }
}

//Load list gift you can get
function GetListProductGiftYouCanGet() {
    try {
        $.ajax({
            type: 'GET',
            url: '/Checkout/GetListProductGiftYouCanGet',
            data: {
                totalPrice: localStorage.getItem('totalPriceForGetListProductGift')
            },
            dataType: "json",
            success: function (response) {
                HideOverlayLoadingButton('#div_zone_cart');
                if (response != null && response.length > 0) {
                    //Success
                    var listProductGiftYouCanGet = response;
                    var trProductGiftYouCanGet = '';
                    var listProductGiftYouCanGetHtml = '';

                    //Product gidt you can get
                    if (listProductGiftYouCanGet != null && listProductGiftYouCanGet.length > 0) {
                        $.each(listProductGiftYouCanGet, function (key, item) {
                            trProductGiftYouCanGet += `  <li>
                                <div class="product-thumbnail">
                                    <div class="product-thumbnail__wrapper" data-tg-static="">
                                        <img src="${item.productObj?.imageObj?.smallUrl != null ? item.productObj?.imageObj?.smallUrl : "/img_dev/error/avatar.png"}" alt="" class="product-thumbnail__image w-100 h-100" style="object: cover">
                                        
                                    </div>
                                    <span class="product-thumbnail__quantity">1</span>
                                   
                                </div>
                                     <h4 class="mx-2" style="width: 100px">${item.productObj?.name}</h4>
                                <div class="mx-2" style="right: 0;position: absolute">
                                      <p class="pb-0 mb-1 mt-1 text-danger" style="font-size: .875em;">Cần đạt mốc  <span class="fw-bolder">${FormatToVND(item.orderPriceApply)}</span</p>
                                      <p class="pt-0 mb-0" style="color:#0014ff;font-size: .875em;">Chỉ cần thêm <span class="fw-bolder"> ${FormatToVND(item.missingAmount)} </span>!!</p>
                                </div>
                            </li>`
                            listProductGiftYouCanGetHtml = `
                              <p class="mb-1"><i class="fa-solid fa-fire-flame-curved flashit" style="color: #d41c1c;width: unset;height:unset"></i><span class="fs-6 text-success fw-bolder mx-2">Nhận ưu đãi nhiều hơn</span></p>
                            <div class="card mb-3 div_product_gift" style="max-height: 200px;overflow-y: auto">
                                    <div class="card-body">
                                      
                                  

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
                HideOverlayLoadingButton('#div_zone_cart');
                document.getElementById("div_zone_cart").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListCart();$(this).remove();">
                        </i>
                    </div>`;
                $btnPlaceOrder.attr('disabled', 'disabled');
            }
        })
    }
    catch (e) {
        HideOverlayLoadingButton('#div_zone_cart');
        document.getElementById("div_zone_cart").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListCart();$(this).remove();">
                        </i>
                    </div>`;
        $btnPlaceOrder.attr('disabled', 'disabled');
    }
}

//Get list address
function GetListAddress() {
    try {
        $.ajax({
            type: 'GET',
            url: '/Address/GetListDeliveryAddress',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.data != null && response.data.length > 0) {
                    var listAddress = response.data;
                    var addressHtml = '';
                    var addressTmp = '';
                    var typeAddress = '';
                    listAddress.forEach(function (value, index) {
                        typeAddress = '';
                        switch (value.typeId) {
                            case 0: typeAddress = 'Khác'; break;
                            case 1: typeAddress = 'Nhà riêng'; break;
                            case 2: typeAddress = 'Văn phòng'; break;
                            default: break;
                        }
                        addressTmp = `${value.addressText}, ${value.wardObj ? value.wardObj.name : ''}, ${value.districtObj ? value.districtObj.name : ''}, ${value.provinceObj ? value.provinceObj.name : ''}`;

                        addressHtml += `
                            <div class="col-xxl-6 col-lg-12 col-md-6">
                                <div class="delivery-address-box" style="background-image: linear-gradient(45deg, #00b09b, transparent);}">
                                    <div>
                                        <div class="form-check">
                                            <input class="form-check-input input_address_delivery" data-country="${value.countryId}" data-province="${value.provinceId}" data-district="${value.districtId}"
                                            data-ward="${value.wardId}" data-name="${value.name}" data-phoneNumber="${value.phoneNumber}" data-latitude="${value.latitude}" data-longitude="${value.longitude}"
                                            data-districtName="${value.districtObj?.name}" data-provinceName="${value.provinceObj?.name}" data-wardName="${value.wardObj?.name}" onclick="ChooseAddressShipping(this)"
                                            value="${value.id}" type="checkbox" name="input_address_user" ${value.isDefault == 1 ? "checked" : ""}>
                                        </div>

                                        <div class="label">
                                            <label id="label_type_address">${typeAddress}</label>
                                        </div>

                                        <ul class="delivery-address-detail">
                                            <li>
                                                <h4 class="fw-500" style="cursor: pointer;" for="">${value.name}</h4>
                                            </li>

                                            <li>
                                                <p class="text-content">
                                                    <span id="span_address_location" for="input_address_item_${value.id}"
                                                        class="text-title">Địa chỉ: </span>${addressTmp}</p>
                                            </li>

                                            <li>
                                                <h6 class="text-content mb-0">
                                                    <span id="span_address_phone" for="input_address_item_${value.id}"
                                                        class="text-title">Điện thoại: </span>${value.phoneNumber}</h6>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>`;
                    });

                    $('#div_list_address').html(addressHtml);

                    $('#div_list_address .form-check-input').click(function () {
                        $('#div_list_address .form-check-input').not(this).prop('checked', false);
                    });
                }
                else {
                    // Hiển thị thông báo khi không có dữ liệu
                    $('#div_no_address').show();
                }
            },

            error: function (error) {
                HideOverlayLoadingButton('#div_zone_cart');
                document.getElementById("div_zone_cart").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListCart();$(this).remove();">
                        </i>
                    </div>`;
                $btnPlaceOrder.attr('disabled', 'disabled');
            }
        });
    } catch (e) {
        document.getElementById("div_zone_cart").innerHTML = ` 
            <div class="text-center p-2">
                <i type="button" class="fa fa-refresh" 
                    style="border-radius:4px;font-size:24px;" 
                    onclick="LoadListCart();$(this).remove();">
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
                        ` <div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="input_address_user"
                                    id="flexRadioDefault1">
                            </div>

                            <div class="label">
                                <label>Home</label>
                            </div>

                            <ul class="delivery-address-detail">
                                <li>
                                    <h4 class="fw-500">Văn Nguyên</h4>
                                </li>

                                <li>
                                    <p class="text-content"><span
                                            class="text-title">Địa chỉ
                                            : </span>8424 James Lane South San
                                        Francisco, CA 94080</p>
                                </li>

                                <li>
                                    <h6 class="text-content mb-0"><span
                                            class="text-title">Điện thoại
                                            :</span> + 380 (0564) 53 - 29 - 68</h6>
                                </li>
                            </ul>
                        </div>`;
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
    if (elm) {
        var htmlElm = $(elm).html();
        $(elm).attr('onclick', '');
        $(elm).html(_loadAnimationSmallHtml);
        $.ajax({
            type: 'GET',
            url: '/Checkout/P_AddAddress',
            success: function (response) {
                $(elm).html(htmlElm);
                $(elm).attr('onclick', 'ShowAddAddressModal(this)');
                $('#div_body_modal_add_address').html(response);
                $modalAddAddress.modal('show');
                $modalListAddress.modal('hide');
                $('.selectpicker').selectpicker();
                initialize('#form_data_add_address', '', '');
                listenOnchangeAddress('#form_data_add_address');

                $('.select2-modal').select2({ language: "vi", dropdownParent: $("#form_data_add_address") });

                //Submit form event
                $('#form_data_add_address').on('submit', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    let formElm = $('#form_data_add_address');
                    $('#form_data_add_address').addClass('was-validated')
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
                                    /* RawDataAddressInView(addressDefaultData);*/
                                    GetListAddress();
                                    $modalAddAddress.modal('hide');
                                }, error: function (err) {
                                    laddaSubmitFormAddress.stop();
                                    CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
                                }
                            });
                        }
                        else {
                            RawDataAddressInView(data);
                            var dataAdressNoSave = {
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
                            }
                            HandleAddress(dataAdressNoSave)

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
    } else {
        console.log("Không tìm thấy phần tử tương ứng trong HTML.");
    }
}

//Add default unsaved address
function HandleAddress(data) {
    RawDataAddressInView(data);
    var addressTmp = `${data.addressText}, ${data.wardName ?? ''}, ${data.districtName ?? ''}, ${data.provinceName ?? ''}`;

    let htmlAddressNoSave = `
        <div class="col-xxl-6 col-lg-12 col-md-6">
            <div class="delivery-address-box" style="background-image: linear-gradient(45deg, #00b09b, transparent);}">
                <div>
                    <div class="form-check">
                        <input class="form-check-input" data-country="${data.countryId}" data-province="${data.provinceId}" data-district="${data.districtId}" data-ward="${data.wardId}" data-name="${data.wardObj?.name}" data-phoneNumber="${data.phoneNumber}" data-districtName="${data.districtObj?.name}" data-provinceName="${data.provinceObj?.name}" data-wardName="${data.wardObj?.name}" onclick="ChooseAddressShipping(this)" data="${data.id}" type="checkbox" name="input_address_user" checked>
                    </div>
                    <ul class="delivery-address-detail">
                        <li>
                            <h4 class="fw-500">${data.name}</h4>
                        </li>

                        <li>
                            <p class="text-content">
                                <span id="span_address_location" for="input_address_item_${data.id}" class="text-title">Địa chỉ: </span>${addressTmp}
                            </p>
                        </li>

                        <li>
                            <h6 class="text-content mb-0">
                                <span id="span_address_phone" for="input_address_item_${data.id}" class="text-title">Điện thoại: </span>${data.phoneNumber}
                            </h6>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`;

    $('#div_list_address .input_address_delivery:checked').removeAttr('checked');

    let htmlListAddress = $('#div_list_address').html();
    $('#div_list_address').html(htmlAddressNoSave + htmlListAddress);

    $('#div_list_address .form-check-input').click(function () {
        $('#div_list_address .form-check-input').not(this).prop('checked', false);
    });
}

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
                    `<h5 class="font-weight-bold text-center text-success text-uppercase"><i class="fa fa-credit-card h4"></i> Thông tin thanh toán</h5>
                        <p class="text-center mb-0">
                            <b>Số tiền: </b>${totalPayHtml}
                        </p>
                        <p class="text-center">
                            <b>Nội dung chuyển khoản: </b><span>${orderId}</span>
                            <button type="button" style="float: right" class="btn btn-sm p-0 color-default" onclick="CopyText('${orderId}')" title="Sap chép">
                                <i class="fa fa-clone"></i> <span style="text-transform:none;font-weight:normal;">Sao chép</span>
                            </button>
                        </p>
                        <div class="row justify-content-center">
                            ${itemBank}
                        </div>
                        `
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
        url: '/Checkout/GetBankList',
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
                                <li class="list-group-item">
                                    <i class="fa fa-id-card-o mr-1"></i> <span>
                                        STK:
                                    </span><span class="color-default mx-2" style="font-size: 15px;color: red;">
                                        ${value.number}
                                        <button style="float: right" type="button" class="btn btn-sm p-0 color-default mx-2" onclick="CopyText('${value.number}')" title="Sap chép">
                                         <i class="fa fa-clone"></i> <span style="text-transform:none;font-weight:normal;"></span>
                                    </button>
                                    </span>
                                    
                                </li>
                                <li class="list-group-item"><i class="fa fa-user mr-1"></i> <span>Tên người nhận: </span><b style="color: red;" class="color-default mx-2">${value.personName}</b></li>
                                <li class="list-group-item"><i class="fa fa-bank mr-1"></i> <span>Ngân hàng: </span><b style="color: red;" class="color-default text-danger mx-2">${value.bankName} - ${value.bankTradeName}</b></li>
                            </ul>
                        </div>`;
                });
                resultHtml =
                    `<h5 style="color: white;background: #1ac138;padding: 5px" class="font-weight-bold text-center text-uppercase"><i class="fa fa-credit-card h4"></i> Thông tin thanh toán</h5>
                        <p class="text-center mb-0">
                            <span>Số tiền: </span><b class="color-default mx-2" style="color: red;">${totalPayHtml}</b>
                        </p>
                        <p class="text-center">
                            <span class="text-danger fs-6">Nội dung chuyển khoản: </span><span class="color-default mx-2" style="font-size: 15px;color: red;">
                                ${orderId}
                                  <button type="button" style="float: right" class="btn btn-sm p-0 color-default mx-2" onclick="CopyText('${orderId}')" title="Sap chép">
                                <i class="fa fa-clone"></i> <span style="text-transform:none;font-weight:normal;"></span>
                            </button>
                                </span>
                          
                        </p>
                        <div class="row justify-content-center">
                            ${itemBank}
                        </div>`
                document.getElementById("div_bank_info_panel").innerHTML = resultHtml;
                document.getElementById("div_bank_qr_code").innerHTML = `    <b style="line-height: 3.2em">Hướng dẫn chuyển khoản</b>
                        <div style="float: left;text-align: left">
                            <p style="">Bước 1: <span>Vào App ngân hàng của bạn</span></p>
                            <p style="">Bước 2: Chọn chức năng quét QR Code và quét mã thanh toán bên cạnh, hoàn tất thanh toán hoặc thực hiện cách sau</p>
                            <p style="">Bước 3: Nhập số tài khoản ngân hàng và tên ngân hàng</p>
                            <p style="">Bước 4: Nhập số tiền thanh toán</p>
                            <p style="">Bước 5: <span class="text-danger">Nhập nội dung chuyển khoản như hình bên</span></p>
                            <p style="">Bước 6: Kiểm tra thông tin và chuyển khoản</p>
                        </div>`;

                $(elm).remove();
            } else {
                document.getElementById("div_bank_info_panel").innerHTML = '<p class="mt-3 text-center text-danger">Shop chưa có thông tin chuyển khoản</p>';
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
    /*$('#b_address_name').text(data.name);
    $('#span_address_phone').text(data.phoneNumber);
    $('#span_address_location').text(location);*/
    $('#input_address_delivery_name').val(data.name);
    $('#input_address_delivery_location').val(data.location ?? location);
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

    $('#addressDeliveryName').val(data.name);
    $('#addressDeliveryPhoneNumber').val(data.phoneNumber);
    $('#addressDeliveryLocation').val(location);
    $('#addressDeliveryAddressText').val(data.addressText);
    $('#addressDeliveryProvinceId').val(data.provinceId);
    $('#addressDeliveryDistrictId').val(data.districtId);
    $('#addressDeliveryWardId').val(data.wardId);
    $('#addressDeliveryProvinceName').val(data.provinceName);
    $('#addressDeliveryDistrictName').val(data.districtName);
    $('#addressDeliveryWardName').val(data.wardName);
    LoadListFeeShip();
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
function OnChangeProvinceFormEvent(elm) {
    let $formElement = $('#form_data_add_address');
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
                $formElement.find('select[name="districtId"]').html('<option value="0">--Chọn--</option>' + response.data);
                $formElement.find('select[name="districtId"]').attr('disabled', false);

                $formElement.find('select[name="wardId"]').html('<option value="0">--Chọn--</option>' + response.data);
                $formElement.find('select[name="wardId"]').attr('disabled', false);
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
    let $formElement = $('#form_data_add_address');
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

                $formElement.find('select[name="wardId"]').html('<option value="0">--Chọn--</option>' + response.data);
                $formElement.find('select[name="wardId"]').attr('disabled', false);
            }
        },
        error: function (err) {
            HideOverlay3Dot('#div_zone_ward');
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//Raw html no data
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

function RefreshTotalPay() {
    var totalItem = FormatToNumerCustom($('#span_total_price_all_item').text());
    var valuePrice = 0, priceFormat = 0, totalPay = 0;
    if (!IsNullOrEmty($('#span_transport_fee').text()) && $('#span_transport_fee').text().trim() != "(chưa tính)") {
        valuePrice = $('#span_transport_fee').text().replace("đ", "");
        console.log(valuePrice);
        priceFormat = parseInt(valuePrice.replace(".",""))
    }
   totalPay = totalItem + priceFormat;

    $('#span_total_price_payment').text(FormatToVNDCustom(totalPay));
}
//Load list fee ship
function LoadListFeeShip() {
    let countryId = $('#input_addressie_country_id').val();
    let provinceId = $('#input_addressie_province_id').val();
    ShowOverlayLoadingButton('#div_shipping_fee_list');
    /* $btnPlaceOrder.attr('disabled', true);*/
    //supplierCarrierId = 0 DEFAULT
    //supplierCarrierId = 1 GHTK
    if (CARRIER_CODE == "DEFAULT") {
        $.ajax({
            type: 'GET',
            url: '/Checkout/GetListFeeShip',
            data: {
                countryId: countryId,
                provinceId: provinceId,
            },
            dataType: "json",
            success: function (response) {
                HideOverlayLoadingButton('#div_shipping_fee_list');
                if (!CheckResponseIsSuccess(response)) {
                    return
                };
                document.getElementById("span_transport_fee").innerHTML = '(chưa tính)'; 
                //Has data
                if (response.data != null && response.data.length > 0) {
                    $btnPlaceOrder.attr('disabled', false);
                    let listData = response.data.filter(x => x.status === 1);
                    if (listData.length === 0) {

                        RefreshTotalPay();
                        //No data
                        document.getElementById("div_shipping_fee_list").innerHTML = MESSAGE_NOT_FOUND_FEESHIP;
                        return false;
                    }
                    if (listData[0].shippingPriceObj.length === 0) {

                        RefreshTotalPay();
                        //No data
                        document.getElementById("div_shipping_fee_list").innerHTML = MESSAGE_NOT_FOUND_FEESHIP;
                        return false;
                    }

                    let html = '';
                    listData[0].shippingPriceObj.forEach(function (item, index) {
                        html += `<div class="col-xxl-6 mt-4">
                                      <div class="delivery-option" style="background-image: linear-gradient(25deg,#5a5a5a,#67b8a7 50%);position: relative">
                                          <div class="delivery-category">
                                              <div class="shipment-detail">
                                                  <div
                                                      class="form-check custom-form-check hide-check-box">
                                                      <input name="input_fee_ship" class="form-check-input" type="radio" data-feeship="${item.feeShip ?? 0}" value="${item.id}" id="shipping_method_${index}">
                                                     
                                                         <label data-toggle="tooltip" title="${item.name}" class="form-check-label text-white feeship_clamp_description"
                                                          for="shipping_method_${index}" style="font-size: 15px">${item.name ?? ''}</label>
                                                          <span class="mx-5 text-white" style="position: absolute;right: 0">${item.feeShip != null ? FormatToVND(item.feeShip) : 0}</span>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>`;
                    });
                    document.getElementById("div_shipping_fee_list").innerHTML = `<div class="col-12 border_bottom section over-hide z-bigger row" style="padding:4px;">${html}</div>`;



                    $('[name="input_fee_ship"]').on('change', function () {
                        let feeShip = parseInt($('[name="input_fee_ship"]:checked').attr('data-feeship'));
                        $('#span_transport_fee').html(FormatToVNDCustom(feeShip));
                        $('#input_feeship_calculate').val(feeShip);
                        RefreshTotalPay();
                    });

                    $(`#shipping_method_0`).click();
                    return;
                } else {

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
    else if (CARRIER_CODE == "GHTK") {
        /* $btnPlaceOrder.attr('disabled', 'disabled');*/
        let data = ParamFeeShipGHTK(CARRIER_TOKEN);
        if (data == null) return false;
        try {
            if (xhrGetFeeShip_GHTK) {
                xhrGetFeeShip_GHTK.abort();
            }
        } catch (e) {
            console.log('abort err: ' + e.message);
        }
        $.ajax({
            type: 'GET',
            url: '/Checkout/GetFeeShip_GHTK',
            data: data,
            dataType: "json",
            success: function (response) {
                HideOverlayLoadingButton('#div_shipping_fee_list');

                if (response.result != 1) {
                    RawUIDeliveryOption(0, [], `LoadListFeeShip('${token}')`);
                    CheckResponseIsSuccess(response);
                    return;
                }
                if (!response.data.delivery) {
                    $('#div_shipping_fee_list').html('<p class="text-center pt-4 text-danger">GTHK chưa hỗ trợ giao đến khu vực này.</p>');
                    return false;
                }

                let arr = [
                    {
                        name: "Tiêu chuẩn",
                        serviceOption: "none",
                        fee: response.data.fee,
                        deliveryDate: ""
                    }
                ];
                RawUIDeliveryOption(0, arr);
            },
            error: function (err) {
                HideOverlayLoadingButton('#div_shipping_fee_list');
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    }
}

function RawUIDeliveryOption(isRefresh, arr, funcReload = "") {
    if (isRefresh === 1) {
        $('#div_shipping_fee_list').html('<p class="text-center">Đang tải...</p>');
        LoadTotalFeeShip();
        return;
    }

    let html = '';
    if (arr != null && arr.length > 0) {
        arr.forEach(function (item, index) {
            html +=
                //`${index === 0 ? '<p class="mb-2 color-default">Chọn phương thức vận chuyển</p>' : ''}
                //    <input class="checkbox-tools deliveryPackingInput" onclick="LoadTotalFeeShip()" type="radio" name="delivery_package" data-carrierid="${CARRIER_ID}" data-carrier-code="${CARRIER_CODE}" data-service-option="${item.serviceOption}" value="${item.fee}" id="delivery_${index}" />
                //        <label class="for-checkbox-tools" for="delivery_${index}">
                //        <b>${item.name}</b> <br />
                //        <span>${NumberWithCommas(item.fee, ',')}đ</span> <br />
                //        <span>${item.deliveryDate}</span>
                //    </label>`
                `  ${index === 0 ? '<p class="mb-2 color-default"></p>' : ''} 
                     <div class="col-xxl-6 mt-4">
                        <div class="delivery-option" style="background-image: linear-gradient(25deg,#5a5a5a,#67b8a7 50%);position: relative">
                            <div class="delivery-category">
                                <div class="shipment-detail">
                                    <div
                                        class="form-check custom-form-check hide-check-box">
                                        <input class="form-check-input" onclick="LoadTotalFeeShip()" type="radio" name="delivery_package" data-carrierid="${CARRIER_ID}" data-carrier-code="${CARRIER_CODE}" data-service-option="${item.serviceOption}" value="${item.fee}" id="delivery_${index}"">
                                       
                                           <label data-toggle="tooltip" title="${item.name}" class="form-check-label text-white feeship_clamp_description"
                                          for="delivery_${index}" style="font-size: 15px">${item.name}</label>
                                            <span class="mx-5 text-white" style="position: absolute;right: 0">${NumberWithCommas(item.fee, ',')}đ</span>
                                              <span>${item.deliveryDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>`
                ;
        });
    } else {
        html = `<p class="text-center">Không có dữ liệu. <a href="javascript:void(0)" onclick="${funcReload}">Tải lại...</a></p>`;
    }
    $('#div_shipping_fee_list').html(html);
    $(`#delivery_0`).click(); // Choose first option delivery
    LoadTotalFeeShip();
}

//Load total fee ship
function LoadTotalFeeShip() {
    let feeShip = 0;
    let isNotCounted = true;
    cartItemData.forEach(function (item, index) {
        feeShip += IsNullOrEmty($(`input[name="delivery_package"]:checked`).val()) ? 0 : parseInt($(`input[name="delivery_package"]:checked`).val());
        if ($(`[name="delivery_package"]:checked`).length > 0)
            isNotCounted = false;
    });
    $('#span_transport_fee').text(NumberWithCommas(feeShip, ',') + 'đ')
    //Check if not choose shipping to show text (chưa tính)
    if (isNotCounted) {
        $('#transportFee').text('(chưa tính)');
    } else {
        $('#transportFee').text(NumberWithCommas(feeShip, ',') + 'đ');
    }
}

function ParamFeeShipGHTK(token) {
    let cartItem = cartItemData[0];
    let totalWeight = cartItem.productItem.map(function (i) {
        return parseFloat((i.weight ?? 0) * i.quantity);
    }).reduce((a, b) => a + b, 0);
    let totalPrice = cartItem.productItem.map(function (i) {
        return (i.price - (i.discount != null ? i.discount : 0)) * i.quantity;
    }).reduce((a, b) => a + b, 0);
    //var pickAddressObj = cartItem.addressObj;
    //if (!IsNullOrEmty(pickAddressObj)) {
    //    pickAddressObj = JSON.parse(pickAddressObj);
    //}
    var pickAddressObj = SUPPLIER_ADDRESS;
    let tags = [];
    cartItem.productItem.map(function (i) {
        if (i.feeTagProductObjs != null && i.feeTagProductObjs.length > 0) {
            i.feeTagProductObjs.forEach(function (item) {
                if (item.feeTagsObj.carrierId === parseInt(carrierId) && tags.indexOf(parseInt(item.feeTagsObj.tagValue)) === -1) {
                    tags.push(parseInt(item.feeTagsObj.tagValue));
                }
            });
        }
    });


    if (IsNullOrEmty($('#addressDeliveryProvinceName').val())) {
        return null;
    }

    if (totalWeight > MAX_TOTAL_WEIGHT_DELIVERY_GHTK) {
        ShowToastNoti('warning', 'Đơn hàng vượt quá khối lượng tối đa của GHTK', `Khối lượng ước tính của đơn hàng: ${totalWeight}kg<br/>Khối lượng tối đa của GHTK: ${MAX_TOTAL_WEIGHT_DELIVERY_GHTK}kg`, 5000);
        $btnPlaceOrder.attr('disabled', 'disabled');
        return null;
    }

    if (totalPrice > MAX_COST_DELIVERY_GHTK) {
        ShowToastNoti('warning', 'Đơn hàng vượt quá số tiền tối đa của GHTK', `Tiền hàng của bạn: ${NumberWithCommas(totalPrice, ',')}đ<br/>Tiền hàng tối đa của GHTK: ${NumberWithCommas(MAX_COST_DELIVERY_GHTK, ',')}đ`, 5000);
        $btnPlaceOrder.attr('disabled', 'disabled');
        return null;
    }

    let dataItem = {
        token: token,
        pick_address_id: '',
        pick_address: IsNullOrEmty(pickAddressObj.addressText) ? "" : pickAddressObj.addressText,
        pick_province: IsNullOrEmty(pickAddressObj.provinceObj?.name) ? "" : pickAddressObj.provinceObj?.name,
        pick_district: IsNullOrEmty(pickAddressObj.districtObj?.name) ? "" : pickAddressObj.districtObj?.name,
        pick_ward: IsNullOrEmty(pickAddressObj.wardObj?.name) ? "" : pickAddressObj.wardObj?.name,
        address: $('#input_addressie_address_text').val(),
        province: $('#input_addressie_province_name').val(),
        district: $('#input_addressie_district_name').val(),
        ward: $('#input_addressie_ward_name').val(),
        weight: totalWeight * 1000, //Gram
        value: totalPrice,
        transport: "road", //road,fly
        deliver_option: 'none', //xteam,none
        tagsString: JSON.stringify(tags),
    };
    return dataItem;
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

function ChooseAddressShipping(elm) {
    var location = !IsNullOrEmty($(elm).attr("data-addressText")) ? $(elm).attr("data-addressText") : '' + "," + !IsNullOrEmty($(elm).attr("data-ward")) ? $(elm).attr("data-ward") : '' + "," + $(elm).attr("data-district") + "," + $(elm).attr("data-province");

    var data = {

        name: $(elm).attr("data-name"),
        location: location,
        phoneNumber: $(elm).attr("data-phoneNumber"),
        latitude: $(elm).attr("data-latitude"),
        longitude: $(elm).attr("data-longitude"),
        addressText: $(elm).attr("data-addressText"),

        countryId: $(elm).attr("data-country"),
        provinceId: $(elm).attr("data-province"),
        districtId: $(elm).attr("data-district"),
        wardId: $(elm).attr("data-ward"),

        wardName: $(elm).attr("data-wardName"),
        districtName: $(elm).attr("data-districtName"),
        provinceName: $(elm).attr("data-provinceName")
    };
    RawDataAddressInView(data);
}
