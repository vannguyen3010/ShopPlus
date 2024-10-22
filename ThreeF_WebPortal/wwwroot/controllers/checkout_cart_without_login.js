﻿var $btnConfrim = $('#btn_confirm');
var taskUpdateQuantity, flagQuantityId;
const MIN_QUANTITY_ITEM_IN_CART = 5;

function tableDataHtml(data) {
    //Get header
    let thead =
        `
           <thead>
             <tr>
                 <th style="padding-left:0;">
                     <label class="mb-0" for="input_check_all_table" style="font-weight: 700;color: black"> <input class="mx-1" id="input_check_all_table" type="checkbox" />Tất cả</label>
                 </th>
                 <th style="font-weight: 700;color: black">Tên sản phẩm</th>    
                 <th style="font-weight: 700;color: black">Đơn giá</th>    
                 <th style="font-weight: 700;color: black">Số lượng</th>
                 <th style="font-weight: 700;color: black">Tạm tính</th>
                 <th style="font-weight: 700;color: black">
                     Thao tác
                       <a href="javascript:void(0)" class="icon" onclick="DeleteMulti()" title="Xoá mục đã chọn">
                         <i class="fa-solid fa-trash-can" style="color: #f44d15;"></i>
                       </a>
                 </th>
             </tr>
            </thead>`;

    //Get record
    var shopItem = '';
    var productItem = '';
    var shopUrl = '', shopId = 0;
    $.each(data, function (key, item) {

        var priceTmp = '';
        shopUrl = item.shopUrl;
        /*value.productItem.forEach(function (item, index) {*/
        let outOfStock = '', sizeTmp = '', colorTmp = '', typeNameTmp = '', totalPriceTmp = '',isClose = false;
        priceDiscount = item.discount > 0 ? (item.productPrice /*- item.discount*/) : item.productPrice;
        /*priceDiscount = item.discount > 0 ? (item.price - item.discount) : item.price;*/

        if (parseInt(item.discount) > 0) {
            const originalPrice = parseInt(item.productPrice); // Giá gốc
            const discountAmount = parseInt(item.discount); // Số tiền được giảm giá
            const discountedPrice = originalPrice - discountAmount; // Giá sau khi được giảm giá

            priceTmp = `<span class="span_price_product">${FormatToVNDCustom(originalPrice)}</span>`;
        } else if (parseInt(item.productPrice) > 0) {
            priceTmp = `<span class="span_price_product">${FormatToVNDCustom(parseInt(item.productPrice))}</span>`;
        } else {
            priceTmp = `<span class="fw-bolder">Đã đóng</span>`;
        }


        /*       totalPriceTmp = FormatToVNDCustom(priceDiscount * item.quantity);*/
        
        totalPriceTmp = FormatToVNDCustom(parseInt(priceDiscount) * parseInt(item.quantity));
        typeNameTmp = item.typeName != null && item.typeName.length > 30 ? item.typeName.substring(0, 30) + "..." : item.typeName;
        sizeTmp = item.sizeName != null && item.sizeName.length > 30 ? item.sizeName.substring(0, 30) + "..." : item.sizeName;
        colorTmp = item.colorName != null && item.colorName.length > 30 ? item.colorName.substring(0, 30) + "..." : item.colorName;
        productItem +=
            ` <tbody class="">
                        <tr data-id="${item.productPriceId}">
                            <th scope="col" style="padding-left:0">
                               <label class="stardust-checkbox">
                                    <input class="stardust-checkbox__input input_item_cart input_item_cart_${item.productPriceId} input_check_shop_${shopId} mx-1" data-id="${item.productPriceId}" data-total="${totalPriceTmp}" type="checkbox" data-is-warehouse="${item.productPriceIsWarehouse}"
                                    data-quantity-stock="${item.productPriceQuantity}" id="input_product_${item.productPriceId}" type="checkbox" ${isClose ? 'disabled' : ''}/>
                                        <div href="/san-pham/${item.nameSlug}-${item.id}" style="width: 70px;height: 70px;">
                                            <img src="${item.imageUrl}" class="img-fluid blur-up lazyload mx-1" alt="${item.productName}" style="object-fit: cover;aspect-ratio: 1/1;vertical-align: middle;border-radius: 10px;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;"
                                            onerror="this.onerror=null;this.src='/img_dev/error/product.png';">
                                        </div>
                                </label>
                            </th>
                            <td data-title="" class="mobile_css_custom p-0" style="vertical-align: middle;" >
                              <div>
                                 <div class="product_clamp_description" style="float:left" data-toggle="tooltip">${IsNullOrEmty(item.productName) ? "" : item.productName}</div>
                                    ${!IsNullOrEmty(typeNameTmp) ? `<span class="col-auto badge badge-default mx-2" style="background: #ee4d2d;float:left;width: fit-content;">${typeNameTmp}</span>` : ""}
                                </div>
                             
                                <div class="buttons_added css_mobile_none d-md-none">
                                    <div id="div_quantity_mobile_${item.productPriceId}" data-id="${item.productPriceId}" class="qty-box" style="display: flex; float: right;justify-content: space-between;">
                                        <div class="input-group group-quantity-custom" style="border: 1px solid #339538;">
                                            <span class="input-group-prepend" >
                                                <button onclick="HandleClickButtonMinus(this, 'mobile', '${item.productPriceId}')" type="button" class="btn btn-sm btn_quantity_left_minus p-1" data-id="${item.productPriceId}" data-type="minus" data-field="${isClose ? 'disabled' : ''}" style="background: #339538;">
                                                    <i class="fas fa-minus text-white"></i>
                                                </button>
                                            </span>
                                            <input type="text" name="quantity" data-id="${item.productPriceId}" style="width: 8px;" max="999" old-value="${item.quantity}" ${isClose ? 'readonly' : ''}
                                                    class="qty-input-card form-control form-control-sm input_quantity_number input_quantity_${item.productPriceId}" onchange="OnChangeRangeQuantityWithMinMax(this)" onkeypress="return IsNumberKey(event)" value="${item.quantity}" />
                                            <span class="input-group-prepend">
                                                <button onclick="HandleClickButtonPlus(this, 'mobile', '${item.productPriceId}')" type="button" class="btn btn-sm btn_quantity_right_plus p-1" data-id="${item.productPriceId}" data-type="plus" data-field="" ${isClose ? 'disabled' : ''} style="background: #339538;">
                                                    <i class="fas fa-plus text-white"></i>
                                                </button>
                                            </span>
                                        </div>
                                     <div style="padding: 0 13px;">
                                      <h5 class="h5_total_item_${item.productPriceId}" data-id="${item.productPriceId}" style="color: #ee4d2d">${totalPriceTmp}</h5>
                            
                                       <a class="remove close_button mx-4" style="cursor: pointer;color: #ee4d2d;" onclick="Delete(${item.productPriceId})"><i class="fas fa-trash-alt"></i></a>
                                   </div>
                                 </div>
                            </td>
                           
                            <td class="css_mobile_custom" data-title="Đơn giá" style="vertical-align: middle;">
                                <h5 class="mb-0 text-danger" id="price_${item.productPriceId}">${priceTmp}</h5>
                            </td>
                            <td class="css_mobile_custom" data-title="Số lượng" style="vertical-align: middle;">
                                <div class="buttons_added d-flex">
                                   <div id="div_quantity_desktop_${item.productPriceId}" data-id="${item.productPriceId}" class="qty-box">
                                        <div class="input-group group-quantity-custom" style="border: 1px solid #339538;">
                                            <span class="input-group-prepend">
                                                <button onclick="HandleClickButtonMinus(this, 'desktop', '${item.productPriceId}')" type="button" class="btn btn-sm btn_quantity_left_minus p-1" data-id="${item.productPriceId}" data-type="minus" data-field="${isClose ? 'disabled' : ''}" style="background: #339538;">
                                                    <i class="fas fa-minus text-white"></i>
                                                </button>
                                            </span>
                                            <input onchange="HandleChangeQuantity(this, 'desktop', '${item.productPriceId}')" type="text" name="quantity" data-id="${item.productPriceId}" style="width: 8px;" max="999" old-value="${item.quantity}" ${isClose ? 'readonly' : ''}
                                                    class="qty-input-card form-control form-control-sm input_quantity_number input_quantity_${item.productPriceId}" onchange="OnChangeRangeQuantityWithMinMax(this)" onkeypress="return IsNumberKey(event)" value="${item.quantity}" />
                                            <span class="input-group-prepend">
                                                <button onclick="HandleClickButtonPlus(this, 'desktop', '${item.productPriceId}')" type="button" class="btn btn-sm btn_quantity_right_plus p-1" data-id="${item.productPriceId}" data-type="plus" data-field="" ${isClose ? 'disabled' : ''} style="background: #339538;">
                                                    <i class="fas fa-plus text-white"></i>
                                                </button>
                                            </span>
                                        </div>
                                   </div>
                                </div>
                             </td>
                           
                            <td class="css_mobile_custom div_price_desktop" data-title="Giá" style="vertical-align: middle;">
                                <h5 class="h5_total_item_${item.productPriceId}" style="color: #ee4d2d" >${totalPriceTmp}</h5>
                            
                            </td>
                            <td class="css_mobile_custom" data-title="Xóa" style="vertical-align: middle;">
                                <a class="remove close_button mx-4" style="cursor: pointer;color: #ee4d2d;" onclick="Delete(${item.productPriceId})"><i class="fas fa-trash-alt"></i></a>
                            </td>
                        </tr>

                    </tbody>`;

        /* });*/

        shopItem =
            `<div class="col-sm-12 table-responsive-xs div_cart_checkout_custom div_zone_shop">
                <div style="padding:6px 12px 6px 12px;border-bottom:1px solid #209e004f;" hidden>
                    <input type="checkbox" class="checkbox-effect checkbox-effect-1 input_check_all_in_shop" data-id="${shopId}" id="input_check_all_in_shop_${shopId}" />
                    <label class="mb-0" for="input_check_all_in_shop_${shopId}"><b class="text-success">${item.shopName}</b><a style="padding-left:6px;" href="${shopUrl}"><i class="fa fa-link"></i></a></label>
                </div>
                <table class="table cart-table">
                
                            ${productItem}
                   
                </table>
            </div>`;
    });


    return `${thead} ${shopItem}`;
}

$(document).ready(function () {

    LoadListCart();
   

});

function RunJs() {

    //On check box
    //$('.checkbox-effect').change(function (e) {
    //    RefreshTotalPay();
    //});

    /*   $('.stardust-checkbox__input').change(function (e) {
           RefreshTotalPay();
       });*/

    //Check all item
    $('#input_check_all_table').change(function (e) {
        var $this = $(this);
        if ($this.is(':checked')) {
            $('.stardust-checkbox__input:not([disabled])').prop('checked', true);
        } else {
            $('.stardust-checkbox__input').prop('checked', false);
        }
        RefreshTotalPay();
    });

    //Check all in shop
    $('.input_check_all_in_shop').change(function (e) {
        var $this = $(this);
        let id = $this.data('id');
        if ($this.is(':checked')) {
            $('.input_check_shop_' + id + ':not([disabled])').prop('checked', true);
        } else {
            $('.input_check_shop_' + id).prop('checked', false);
        }
        RefreshTotalPay();
    });

    //Check all in shop
    $('.input_item_cart').change(function (e) {
        RefreshTotalPay();
    });


    //Button submit cart
    $btnConfrim.on('click', function () {
        var checkedData = getCheckedRow();
        if (checkedData.length > 0) {
            let isFail = false;
            $('#section_cart table tbody tr.tr_product_item').each(function (i) {
                if ($(this).find('.checkbox-effect').is(':checked')) {
                    let isWarehouse = parseInt($(this).find('.checkbox-effect').data('is-warehouse'));
                    let quantityStock = parseInt($(this).find('.checkbox-effect').data('quantity-stock'));
                    let currentQuantity = parseInt($(this).find('[name="quantity"]').val());
                    if (isWarehouse === 1 && (quantityStock === 0 || currentQuantity > quantityStock))
                        isFail = true;
                }
            });
            if (isFail) {
                swal.fire('Không thể mua hàng!', 'Giỏ hàng bạn chọn có sản phẩm đã hết hàng hoặc không đủ số lượng, hãy kiểm tra lại.', 'info')
                return false;
            }

            var valueTotalPriceCart = $('#total_price_cart').val();
            localStorage.setItem('listIdCartSelectedLocalStorage', JSON.stringify(checkedData)); //LIST PRODUCT PRICEID SELECTED
            localStorage.setItem('totalPriceForGetListProductGift', valueTotalPriceCart); //Tong tien
            location.href = "/checkoutwithoutlogin/payment"
        } else {
            swal.fire('Bạn chưa chọn sản phẩm để mua', '', 'info')
            //ShowToastNoti('info', '', 'Bạn chưa chọn sản phẩm để mua');
        }
    
    });
}
//DESKTOP

function HandleClickButtonMinus(elm, type, productPriceId) {
    if (type === "desktop") {
        let idDivQuantity = "div_quantity_desktop"
        MinusQuantity(elm, productPriceId, idDivQuantity, type)
    } else {
        let idDivQuantity = "div_quantity_mobile"
        MinusQuantity(elm, productPriceId, idDivQuantity, type)
    }

    // Cập nhật giá trị (value) của input sau khi đã giảm số lượng.
    var $qty = $(`#div_quantity_${type}_${productPriceId}`).find(`.input_quantity_${productPriceId}`);
    var newValue = parseInt($qty.val());
    $qty.attr('value', newValue);

}

function HandleClickButtonPlus(elm, type, productPriceId) {

    if (type === "desktop") {
        let idDivQuantity = "div_quantity_desktop"
        PLusQuantity(elm, productPriceId, idDivQuantity, type)
    } else {
        let idDivQuantity = "div_quantity_mobile"
        PLusQuantity(elm, productPriceId, idDivQuantity, type)
    }
    var $qty = $(`#div_quantity_${type}_${productPriceId}`).find(`.input_quantity_${productPriceId}`);
    var newValue = parseInt($qty.val());
    $qty.attr('value', newValue);
}

function MinusQuantity(elm, productPriceId, idDivQuantity, type) {
    var $qty = $(`#${idDivQuantity}_${productPriceId}`).find(`.input_quantity_${productPriceId}`);
    if (parseInt($qty.val()) === 1)
        return;
    var value = parseInt($qty.val()) - 1;
    var currentVal = parseInt($qty.val(), 10);
    if (!isNaN(currentVal) && currentVal > 1) {
        $qty.val(currentVal - 1);
    }

    if (flagQuantityId == productPriceId) {
        clearTimeout(taskUpdateQuantity);
    }
    flagQuantityId = productPriceId;
    FindItemInArray(myData, 'productPriceId', productPriceId).quantity = parseInt($qty.val())
    localStorage.setItem('listCartLocalStorage', JSON.stringify(myData));
    UpdateQuantity(productPriceId, value, type, idDivQuantity);
}

function PLusQuantity(elm, productPriceId, idDivQuantity, type) {
    var $qty = $(`#${idDivQuantity}_${productPriceId}`).find(`.input_quantity_${productPriceId}`);

    if (parseInt($qty.val()) === parseInt($qty.attr('max')))
        return;
    var value = parseInt($qty.val()) + 1;
    var currentVal = parseInt($qty.val(), 10);
    if (!isNaN(currentVal)) {
        $qty.val(currentVal + 1);
    }

    if (flagQuantityId == productPriceId) {
        clearTimeout(taskUpdateQuantity);
    }
    /*flagQuantityId = cartId;*/
    FindItemInArray(myData, 'productPriceId', productPriceId).quantity = parseInt($qty.val());

    localStorage.setItem('listCartLocalStorage', JSON.stringify(myData));
    taskUpdateQuantity = setTimeout(function () {
        UpdateQuantity(productPriceId, value, type, idDivQuantity)
    }, 600);
    UpdateQuantity(productPriceId, value, type, idDivQuantity)
}

function HandleChangeQuantity(elm, type, productPriceId) {
    if (type === "desktop") {
        let value = $(elm).val();
        let id = productPriceId;
        let idDivQuantity = "div_quantity_desktop"
        MinusQuantity(elm, id, idDivQuantity, type)

        $('.input_quantity_' + id).val(value);


        if (flagQuantityId == id) {
            clearTimeout(taskUpdateQuantity);
        }
        flagQuantityId = id;
        var taskUpdateQuantity = setTimeout(function () {
            UpdateQuantity(id, value, type, idDivQuantity)
        }, 600);
        CalPayOneItem(id, value);

    } else {
        let value = $(elm).val();
        let id = productPriceId;
        let idDivQuantity = "div_quantity_mobile"
        MinusQuantity(elm, id, idDivQuantity, type)

        $('.input_quantity_' + id).val(value);

        if (flagQuantityId == id) {
            clearTimeout(taskUpdateQuantity);
        }
        flagQuantityId = id;
        UpdateQuantity(id, value, type, idDivQuantity)

        CalPayOneItem(id, value);
    }
}
//Get data checked
function getCheckedRow() {
    var data = [];
    /*  $('#section_cart table tbody tr').each(function (i) {
          if ($(this).find('.input_item_cart').is(':checked')) {
              data.push($(this).data('id'));
          }
      });*/
    $('#section_cart table tbody tr .input_item_cart').each(function (i) {
        if ($(this).is(':checked')) {
            data.push($(this).data('id'));
        }
    });
    return data;
}

//Raw html no data
function NoneRecord() {
    var html = `<div class="col-sm-12 text-center">
                    <img src="/img_dev/cartdata.png" style="width:150px;" alt="No data" />
                    <p>Không có sản phẩm nào trong giỏ hàng của bạn.</p>
                </div>`;
    $('#div_zone_cart').html(html);
    /* $btnConfrim.attr('disabled', 'disabled');*/
    $btnConfrim.on('click', function () {
        swal.fire('Bạn vui lòng thêm sản phẩm vào giỏ hàng', '', 'info')
    })
}

//Load list cart
function LoadListCart() {
    ShowOverlayLoadingButton('#div_zone_cart');
    if (myData != null && myData.length > 0) {
        document.getElementById("div_zone_cart").innerHTML = tableDataHtml(myData);
        RefreshTotalPay();
        RunJs();
    }
    else {
        NoneRecord();
    }
}

function UpdateQuantity(productPriceId, quantity) {
    CalPayOneItem(productPriceId, quantity);
    RefreshTotalPay();
}
//Delete
function Delete(id) {
    swal.fire({
        title: "Bạn có muốn xóa sản phẩm này?",
        text: "",
        type: "question",
        showCancelButton: !0,
        confirmButtonText: "Xóa",
        cancelButtonText: "Không",
        confirmButtonClass: "btn btn-danger mt-2",
        cancelButtonClass: "btn btn-light ml-2 mt-2",
        buttonsStyling: !1,
        showLoaderOnConfirm: true,
        preConfirm: function () {
            return new Promise(function (resolve, reject) {
                RemoveItemInArray(myData, FindItemInArray(myData, 'productPriceId', id))
                localStorage.setItem('listCartLocalStorage', JSON.stringify(myData));
                RemoveRowUI([id]);
                countShoppingCartWithoutLogin();
                resolve();
            });

        }
    });
}
//DeleteMulti
function DeleteMulti() {
    var dataId = getCheckedRow();
    if (dataId.length === 0) {
        ShowToastNoti("info", "", "Vui lòng chọn sản phẩm để xóa");
        return;
    }
    swal.fire({
        title: "Bạn có muốn xóa sản phẩm đã chọn?",
        text: "",
        type: "question",
        showCancelButton: !0,
        confirmButtonText: "Xóa",
        cancelButtonText: "Không",
        confirmButtonClass: "btn btn-danger mt-2",
        cancelButtonClass: "btn btn-light ml-2 mt-2",
        buttonsStyling: !1,
        showLoaderOnConfirm: true,
        preConfirm: function () {
            return new Promise(function (resolve, reject) {
                dataId.forEach(function (item) {
                    RemoveItemInArray(myData, FindItemInArray(myData, 'productPriceId', item))
                    localStorage.setItem('listCartLocalStorage', JSON.stringify(myData));
                })
                RemoveRowUI(dataId);
                /*CountShoppingCartItem();*/
                countShoppingCartWithoutLogin();
                resolve();
            });
        }
    });
}
// Tính lại giá tiền cho một sản phẩm
function CalPayOneItem(productPriceId, quantity) {
    let priceValue = $(`#price_${productPriceId} .span_price_product`).html().trim().split('đ')[0].replace(/\./g, '');

    let cal = FormatToVNDCustom(parseInt(priceValue) * parseInt(quantity));
    $(`.h5_total_item_${productPriceId}`).text(cal);
    /*$(`#input_product_${productPriceId}`).attr("data-total", FormatToVNDCustom(FormatToNumerCustom(priceValue) * parseInt(quantity)))*/
    $(`.input_item_cart_${productPriceId}`).attr("data-total", FormatToVNDCustom(FormatToNumerCustom(priceValue) * parseInt(quantity)))

    RefreshTotalPay()
}

function CalDiscountPrice(num1, num2) {
    return FormatToVNDCustom(num1 - num2);
}
// Cập nhật tổng số tiền
function RefreshTotalPay() {
    var totalPay = 0;
    $('#section_cart .input_item_cart:checked').each(function (key, item) {
        totalPay += FormatToNumerCustom($(item).attr('data-total'));
    });
    $('#h2_total_pay').html(FormatToVNDCustom(totalPay));
    $('#total_price_cart').val(totalPay);
}

function RemoveRowUI(arrId) {
    //Remove row
    $('#section_cart table tbody tr').each(function (i) {
        if (arrId.indexOf($(this).data('id')) > -1) {
            $(this).remove();
        }
    });

    //Check shop zone
    $('#section_cart .div_zone_shop').each(function (i) {
        let productItem = $(this).find('.tr_product_item');
        if (productItem.length === 0) {
            $(this).remove();
        }
    });

    //Check all cart
    if ($('#section_cart table tbody tr').length === 0) {
        NoneRecord();
    }

    RefreshTotalPay();
}

function FormatToVNDCustom(value) {
    if (IsNullOrEmty(value))
        return "NaN";
    return value.toLocaleString('vi', { style: 'currency', currency: 'VND' }).replace(/\s₫/g, 'đ');
}

function FormatToNumerCustom(value) {
    return Number(value.replace(/[^0-9,-]+/g, ""));
}

function OnChangeRangeQuantityWithMinMax(elm) {
    let min = 1;
    let max = parseInt($(elm).attr('max'));
    if ($(elm).val() > max) {
        $(elm).val(max);
    } else if ($(elm).val() < min) {
        $(elm).val(min);
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











