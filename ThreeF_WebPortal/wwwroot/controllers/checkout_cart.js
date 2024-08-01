var $btnConfrim = $('#btn_confirm');
var taskUpdateQuantity, flagQuantityId;
const MIN_QUANTITY_ITEM_IN_CART = 5;

function tableDataHtml(data) {
    //Get header
    let thead =
        `
                    <thead>
                        <tr>
                            <th style="padding-left:0;">
                                <label class="mb-0 mx-1" for="input_check_all_table" style="font-weight: 700;color: black">  <input class="mx-1" id="input_check_all_table" type="checkbox" />Tất cả</label>
                            </th>
                            <th style="font-weight: 700;color: black">Tên sản phẩm</th>    
                            <th style="font-weight: 700;color: black">Đơn giá</th>    
                            <th style="font-weight: 700;color: black">Số lượng</th>
                            <th style="font-weight: 700;color: black">Tạm tính</th>
                            <th style="font-weight: 700;color: black;display: flex">
                                Thao tác
                                 <a href="javascript:void(0)" class="icon mx-1" onclick="DeleteMulti()" title="Xoá mục đã chọn">
                                    <i class="fa-solid fa-trash-can" style="color: #f44d15;"></i>
                                </a>
                            </th>
                        </tr>
                    </thead>`;

    //Get record
    var shopItem = '';
    var productItem = '';
    var shopUrl = '', shopId = 0;
    $.each(data, function (key, value) {
        productItem = '';
        shopUrl = value.shopUrl;
        shopId++;
        value.productItem.forEach(function (item, index) {
            let outOfStock = '', typeNameTmp = '', priceDiscount = 0, priceTmp = '', discountTmp = '', totalPriceTmp = '', isClose = false;
            priceDiscount = item.discount > 0 ? (item.price - item.discount) : item.price;
            if (item.productPriceStatus !== 1) {
                priceTmp = '<span class="text-danger">Đã đóng</span>'; isClose = true;
            } else {
                priceTmp = item.discount > 0 ? CalDiscountPrice(item.price, item.discount) : FormatToVNDCustom(item.price);
                discountTmp = item.discount > 0 ? `<del class="fs-18">${FormatToVNDCustom(item.price)}</del>` : "";
            }
            if (item.availableQuantity === 1) {
                if (item.availableQuantity === 0 || item.availableQuantity == null)
                    outOfStock = '<span class="col-auto badge bg-danger">Hết hàng</span>'; //Quantity in stock is empty
                else if (item.quantity > item.availableQuantity)
                    outOfStock = `<span class="col-auto badge bg-warning">Hàng không đủ (còn ${item.availableQuantity})</span>`; //Quantity in stock is not enough
            } else
                outOfStock = ''; //Quantity in stock is enough or not use stock

            /*       totalPriceTmp = FormatToVNDCustom(priceDiscount * item.quantity);*/
            totalPriceTmp = FormatToVNDCustom(priceDiscount * item.quantity);
            typeNameTmp = item.typeName != null && item.typeName.length > 30 ? item.typeName.substring(0, 30) + "..." : item.typeName;
            sizeTmp = item.sizeName != null && item.sizeName.length > 30 ? item.sizeName.substring(0, 30) + "..." : item.sizeName;
            colorTmp = item.colorName != null && item.colorName.length > 30 ? item.colorName.substring(0, 30) + "..." : item.colorName;
            productItem +=
                ` <tbody class="">
                        <tr class="${isClose ? 'is_close' : ''}" data-id="${item.cartId}">
                            <th scope="col" style="padding-left:0">
                               <label class="stardust-checkbox">
                                <input class="stardust-checkbox__input input_item_cart input_item_cart_${item.cartId} input_check_shop_${shopId} mx-1" data-id="${item.cartId}" data-total="${totalPriceTmp}" type="checkbox" data-is-warehouse="${item.productPriceIsWarehouse}"
                                data-quantity-stock="${item.productPriceQuantity}" id="input_product_${item.cartId}" type="checkbox" ${isClose ? 'disabled' : ''}/>
                                  <div class="mx-1" href="/san-pham/${item.nameSlug}-${item.id}" style="width: 70px;height: 70px;">
                                    <img src="${item.imageUrl}" class="img-fluid blur-up lazyload mx-1" alt="${item.name}" style="object-fit: cover;aspect-ratio: 1/1;vertical-align: middle;border-radius: 10px;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;"
                                    onerror="this.onerror=null;this.src='/img_dev/error/product.png';">
                                </div>

                            </label>
                            </th>
                            <td data-title="" class="mobile_css_custom p-0" style="vertical-align: middle;" >
                              <div style="display: inline-grid">
                                 <div class="product_clamp_description" style="float:left" data-toggle="tooltip">${IsNullOrEmty(item.name) ? "" : item.name}</div>
                                ${!IsNullOrEmty(typeNameTmp) ? `<span class="col-auto badge bg-success mx-2" style="float:left;width: fit-content;">${typeNameTmp}</span>` : ""}
                                ${outOfStock}
                              </div>
                             
                                   <div class="buttons_added css_mobile_none d-md-none">
                               <div id="div_quantity_mobile_${item.cartId}" data-id="${item.cartId}" class="qty-box" style="display: flex; float: right;justify-content: space-between;">
                                    <div class="input-group group-quantity-custom" style="border: 1px solid #339538;">
                                        <span class="input-group-prepend" >
                                            <button onclick="HandleClickButtonMinus(this, 'mobile', '${item.cartId}')" type="button" class="btn btn-sm btn_quantity_left_minus p-1" data-id="${item.cartId}" data-type="minus" data-field="${isClose ? 'disabled' : ''}" style="background: #339538;">
                                                <i class="fas fa-minus text-white"></i>
                                            </button>
                                        </span>
                                        <input type="text" name="quantity" data-id="${item.cartId}" style="width: 8px;" max="999" old-value="${item.quantity}" ${isClose ? 'readonly' : ''}
                                                class="qty-input-card form-control form-control-sm input_quantity_number input_quantity_${item.cartId}" onchange="OnChangeRangeQuantityWithMinMax(this)" onkeypress="return IsNumberKey(event)" value="${item.quantity}" />
                                        <span class="input-group-prepend">
                                            <button onclick="HandleClickButtonPlus(this, 'mobile', '${item.cartId}')" type="button" class="btn btn-sm btn_quantity_right_plus p-1" data-id="${item.cartId}" data-type="plus" data-field="" ${isClose ? 'disabled' : ''} style="background: #339538;">
                                                <i class="fas fa-plus text-white"></i>
                                            </button>
                                        </span>
                                    </div>
                                     <div style="padding: 0 13px;">
                                      <h5 class="h5_total_item_${item.cartId}" data-id="${item.cartId}" style="color: #ee4d2d">${totalPriceTmp}</h5>
                            
                                       <a class="remove close_button mx-4" style="cursor: pointer;color: #ee4d2d;" onclick="Delete(${item.cartId})"><i class="fas fa-trash-alt"></i></a>
                                   </div>
                                   </div>
                            </td>
                           
                            <td class="css_mobile_custom" data-title="Đơn giá" style="vertical-align: middle;">
                                <h5 class="mb-0 text-danger" id="price_${item.cartId}">${priceTmp}</h5>
                                 ${discountTmp}
                            </td>
                            <td class="css_mobile_custom" data-title="Số lượng" style="vertical-align: middle;">
                                <div class="buttons_added d-flex">
                                   <div id="div_quantity_desktop_${item.cartId}" data-id="${item.cartId}" class="qty-box">
                                        <div class="input-group group-quantity-custom" style="border: 1px solid #339538;">
                                            <span class="input-group-prepend">
                                                <button onclick="HandleClickButtonMinus(this, 'desktop', '${item.cartId}')" type="button" class="btn btn-sm btn_quantity_left_minus p-1" data-id="${item.cartId}" data-type="minus" data-field="${isClose ? 'disabled' : ''}" style="background: #339538;">
                                                    <i class="fas fa-minus text-white"></i>
                                                </button>
                                            </span>
                                            <input onchange="HandleChangeQuantity(this, 'desktop', '${item.cartId}')" type="text" name="quantity" data-id="${item.cartId}" style="width: 8px;" max="999" old-value="${item.quantity}" ${isClose ? 'readonly' : ''}
                                                    class="qty-input-card form-control form-control-sm input_quantity_number input_quantity_${item.cartId}" onchange="OnChangeRangeQuantityWithMinMax(this)" onkeypress="return IsNumberKey(event)" value="${item.quantity}" />
                                            <span class="input-group-prepend">
                                                <button onclick="HandleClickButtonPlus(this, 'desktop', '${item.cartId}')" type="button" class="btn btn-sm btn_quantity_right_plus p-1" data-id="${item.cartId}" data-type="plus" data-field="" ${isClose ? 'disabled' : ''} style="background: #339538;">
                                                    <i class="fas fa-plus text-white"></i>
                                                </button>
                                            </span>
                                        </div>
                                   </div>
                                </div>
                             </td>
                           
                            <td class="css_mobile_custom div_price_desktop" data-title="Giá" style="vertical-align: middle;">
                                <h5 class="h5_total_item_${item.cartId}" style="color: #ee4d2d" >${totalPriceTmp}</h5>
                            
                            </td>
                            <td class="css_mobile_custom" data-title="Xóa" style="vertical-align: middle;">
                                <a class="remove close_button mx-4" style="cursor: pointer;color: #ee4d2d;" onclick="Delete(${item.cartId})"><i class="fas fa-trash-alt"></i></a>
                            </td>
                        </tr>

                    </tbody>
`;

        });

        shopItem +=
            `<div class="col-sm-12 table-responsive-xs div_cart_checkout_custom div_zone_shop">
                <div style="padding:6px 12px 6px 12px;border-bottom:1px solid #209e004f;" hidden>
                    <input type="checkbox" class="checkbox-effect checkbox-effect-1 input_check_all_in_shop" data-id="${shopId}" id="input_check_all_in_shop_${shopId}" />
                    <label class="mb-0" for="input_check_all_in_shop_${shopId}"><b class="text-success">${value.shopName}</b><a style="padding-left:6px;" href="${shopUrl}"><i class="fa fa-link"></i></a></label>
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

            //Check min quantity of item in cart < 5
            let isFailQuantity = false;
            var list = document.querySelectorAll('#section_cart table tbody tr.tr_product_item .checkbox-effect:checked')
            list.forEach(function myfunction(item, key) {
                if (parseInt($(item).parents('.tr_product_item').find('[name="quantity"]').val()) < MIN_QUANTITY_ITEM_IN_CART) {
                    isFailQuantity = true; return false;
                }
            });
            if (isFailQuantity) {
                swal.fire('Vui lòng chọn số lượng tối thiểu của từng sản phẩm là 5 sản phẩm !!', '', 'info');
                return false;
            }
            var valueTotalPriceCart = $('#total_price_cart').val();
            localStorage.setItem('totalPriceForGetListProductGift', valueTotalPriceCart);
            location.href = "/checkout/check?i=" + JSON.stringify(checkedData);
            //location.href = `/checkout/check?i=${JSON.stringify(checkedData)}&sup=${sup}`;
        } else {
            swal.fire('Bạn chưa chọn sản phẩm để mua', '', 'info')
            //ShowToastNoti('info', '', 'Bạn chưa chọn sản phẩm để mua');
        }
    });
}

//DESKTOP
function HandleClickButtonMinus(elm, type, cartId) {
    if (type === "desktop") {
        let idDivQuantity = "div_quantity_desktop"
        MinusQuantity(elm, cartId, idDivQuantity, type)
    } else {
        let idDivQuantity = "div_quantity_mobile"
        MinusQuantity(elm, cartId, idDivQuantity, type)
    }
}

function HandleClickButtonPlus(elm, type, cartId) {

    if (type === "desktop") {
        let idDivQuantity = "div_quantity_desktop"
        PLusQuantity(elm, cartId, idDivQuantity, type)
    } else {
        let idDivQuantity = "div_quantity_mobile"
        PLusQuantity(elm, cartId, idDivQuantity, type)
    }
}

function MinusQuantity(elm, cartId, idDivQuantity, type) {
    var $qty = $(`#${idDivQuantity}_${cartId}`).find(`.input_quantity_${cartId}`);
    if (parseInt($qty.val()) === 1)
        return;
    var value = parseInt($qty.val()) - 1;
    var currentVal = parseInt($qty.val(), 10);
    if (!isNaN(currentVal) && currentVal > 1) {
        $qty.val(currentVal - 1);
    }

    if (flagQuantityId == cartId) {
        clearTimeout(taskUpdateQuantity);
    }
    flagQuantityId = cartId;
    UpdateQuantity(cartId, value, type, idDivQuantity);
}

function PLusQuantity(elm, cartId, idDivQuantity, type) {
    var $qty = $(`#${idDivQuantity}_${cartId}`).find(`.input_quantity_${cartId}`);

    if (parseInt($qty.val()) === parseInt($qty.attr('max')))
        return;
    var value = parseInt($qty.val()) + 1;
    var currentVal = parseInt($qty.val(), 10);
    if (!isNaN(currentVal)) {
        $qty.val(currentVal + 1);
    }

    if (flagQuantityId == cartId) {
        clearTimeout(taskUpdateQuantity);
    }
    flagQuantityId = cartId;
    UpdateQuantity(cartId, value, type, idDivQuantity)
}

function HandleChangeQuantity(elm, type, cartId) {
    if (type === "desktop") {
        let value = $(elm).val();
        let id = cartId;
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
        let id = cartId;
        let idDivQuantity = "div_quantity_mobile"
        MinusQuantity(elm, id, idDivQuantity, type)

        $('.input_quantity_' + id).val(value);

        if (flagQuantityId == id) {
            clearTimeout(taskUpdateQuantity);
        }
        flagQuantityId = id;
        /* UpdateQuantity(id, value, type, idDivQuantity)*/
        var taskUpdateQuantity = setTimeout(function () {
            UpdateQuantity(id, value, type, idDivQuantity)
        }, 600);

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
    $btnConfrim.attr('disabled', 'disabled');
}

//Load list cart
function LoadListCart() {
    try {
        ShowOverlayLoadingButton('#div_zone_cart');
        $.ajax({
            type: 'GET',
            url: '/Checkout/GetCartData',
            dataType: "json",
            success: function (response) {
                HideOverlayLoadingButton('#div_zone_cart');
                //Check error code
                if (response.result !== 1) {
                    document.getElementById("div_zone_cart").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListCart();$(this).remove();">
                        </i>
                    </div>`;
                    CheckResponseIsSuccess(response);
                    return;
                }

                //Success
                var listData = response.data;
                //$("#cart_item_count").text(cartItemCount);
                //itemCountBadge.innerText = cartItemCount; 
               
                if (listData != null && listData.length > 0) {
                    document.getElementById("div_zone_cart").innerHTML = tableDataHtml(listData);
                    RefreshTotalPay();
                    RunJs();
                }
                else {
                    NoneRecord();
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
                console.log("Error when load cart!");
            }
        });
    } catch (e) {
        HideOverlayLoadingButton('#div_zone_cart');
        document.getElementById("div_zone_cart").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListCart();$(this).remove();">
                        </i>
                    </div>`;
        console.log("Error when load cart!");
    }
}

//Update quantity

function UpdateQuantity(cartId, quantity, type, idDivQuantity) {
    var oldValue = 0;
    if (type === "desktop") {
        oldValue = $(`#${idDivQuantity}_${cartId}`).find(`.input_quantity_${cartId}`).attr('old-value');
    } else {
        oldValue = $(`#${idDivQuantity}_${cartId}`).find(`.input_quantity_${cartId}`).attr('old-value');
    }

    if (oldValue == quantity)
        return;
    $.ajax({
        type: 'POST',
        url: '/Checkout/UpdateQuantity',
        data: {
            id: cartId,
            quantity: quantity
        },
        dataType: 'json',
        success: function (response) {
            if (!CheckResponseIsSuccess(response)) {
                if (type === "desktop") {
                    oldValue = $(`#${idDivQuantity}_${cartId}`).find(`.input_quantity_${cartId}`).val(oldValue);
                } else {
                    oldValue = $(`#${idDivQuantity}_${cartId}`).find(`.input_quantity_${cartId}`).val(oldValue);
                }
                return false;
            }
            //Set new pay
            if (type === "desktop") {
                newValue = $(`#${idDivQuantity}_${cartId}`).find(`.input_quantity_${cartId}`).val();
                $(`.input_quantity_${cartId}`).val(newValue)
            } else {
                newValue = $(`#${idDivQuantity}_${cartId}`).find(`.input_quantity_${cartId}`).val()
                $(`.input_quantity_${cartId}`).val(newValue)
            }
            CalPayOneItem(cartId, quantity);

        },
        error: function (err) {
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });

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
                $.ajax({
                    type: 'POST',
                    url: '/Checkout/Delete',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    success: function (response) {
                        if (!CheckResponseIsSuccess(response)) {
                            resolve();
                            return false;
                        }
                        RemoveRowUI([id]);
                        CountShoppingCartItem();
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
                $.ajax({
                    type: 'POST',
                    url: '/Checkout/DeleteMultiple',
                    data: {
                        id: JSON.stringify(dataId)
                    },
                    dataType: 'json',
                    success: function (response) {
                        if (!CheckResponseIsSuccess(response)) {
                            resolve();
                            return false;
                        }
                        RemoveRowUI(dataId);
                        CountShoppingCartItem();
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

// Tính lại giá tiền cho một sản phẩm

function CalPayOneItem(cartId, quantity) {
    let priceValue = $('#price_' + cartId).text();
    let cal = FormatToVNDCustom(FormatToNumerCustom(priceValue) * parseInt(quantity));
    $(`.h5_total_item_${cartId}`).text(cal);
    $(`#input_product_${cartId}`).attr("data-total", FormatToVNDCustom(FormatToNumerCustom(priceValue) * parseInt(quantity)))
    $(`.input_item_cart_${cartId}`).attr("data-total", FormatToVNDCustom(FormatToNumerCustom(priceValue) * parseInt(quantity)))
    RefreshTotalPay()
}

function CalDiscountPrice(num1, num2) {
    return FormatToVNDCustom(num1 - num2);
}

// Cập nhật tổng số tiền
function RefreshTotalPay() {
    var totalPay = 0;
    $('#section_cart .input_item_cart:checked').each(function (key, item) {
        totalPay += FormatToNumerCustom($(item).attr('data-total'))
    });
    $('#h2_total_pay').html(FormatToVNDCustom(totalPay));
    $('#total_price_cart').val(totalPay)
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















