var listCartGlobal = [];
var myData = JSON.parse(localStorage.getItem('listCartLocalStorage'));
$(document).ready(function () {
    /*    DeleteLocalStorage()*/

    countShoppingCartWithoutLogin();

    LoadListOrderWithoutAccount();

    $('#form_search_order_without_account').on('submit', function (e) {
        e.preventDefault();
        $('#btn_search_order_without_account').click();
    });
})
function AddToCartLocalStorage(data) {
    var myData = JSON.parse(localStorage.getItem('listCartLocalStorage'));
    //Check data in list localStorage
    if (myData != null && myData.length > 0) {
        if (data.productId == FindItemInArray(myData, 'productId', data.productId).productId) {
            if (data.productPriceId == FindItemInArray(myData, 'productPriceId', data.productPriceId).productPriceId) {
                var quantity = FindItemInArray(myData, 'productPriceId', data.productPriceId).quantity
                FindItemInArray(myData, 'productPriceId', data.productPriceId).quantity = parseInt(quantity) + parseInt(data.quantity)
            } else {
                myData.push(data)
            }
        } else {
            myData.push(data)
        }

    } else {
        listCartGlobal.push(data)
    }

    //Set value for localStorage
    if (myData != null && myData.length > 0) {
        localStorage.setItem('listCartLocalStorage', JSON.stringify(myData));
        ShowToastNoti('success', '', 'Đã thêm sản phẩm vào giỏ hàng');
    }
    else {
        localStorage.setItem('listCartLocalStorage', JSON.stringify(listCartGlobal));
        ShowToastNoti('success', '', 'Đã thêm sản phẩm vào giỏ hàng');
    }
    countShoppingCartWithoutLogin();
}

function countShoppingCartWithoutLogin() {
    var myData = JSON.parse(localStorage.getItem('listCartLocalStorage'));
    if (myData != null) {
        const count = myData.length;
        if (count === 0) {
            $('#cart_item_count').text(0).fadeOut(100);
        } else if (count > 0 && count < 10) {
            $('#cart_item_count').text(count).fadeIn(100);
        } else {
            $('#cart_item_count').text('9+').fadeIn(100);
        }
    } else {
        $('#cart_item_count').text(0).fadeOut(100);
    }
}
//Check exists key-value in array object
function FindItemInArray(arr, key, value) {
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] == value) return arr[i];
        }
    }
    return false;
}

function DeleteLocalStorage() {
    var hours = 1; // Reset when storage is more than 24hours
    var now = new Date().getTime();
    /*  * 60 * 60 * 1000*/
    var setupTime = localStorage.getItem('setupTime');
    if (setupTime == null) {
        localStorage.setItem('setupTime', now)
    } else {
        if (now - setupTime > hours) {
            localStorage.clear()
            localStorage.setItem('setupTime', now);
        }
    }
}

function LoadListOrderWithoutAccount() {
    $('#btn_load_order_without_account_desktop').on('click', function () {
        $('#modal_list_order_without_account').modal("show")
    })

    $('#btn_search_order_without_account').off('click').on('click', function () {

        var orderId = $('#input_order_id_without_account').val()
        if (IsNullOrEmty(orderId)) {
            ShowToastNoti('warning', '', 'Vui lòng nhập mã đơn hàng bạn nhé!', 4000, 'topCenter');
            return false;
        }
        ShowOverlay('#div_table_order_without_account');
        try {
            $.ajax({
                type: 'GET',
                url: '/CheckoutWithoutLogin/LoadListOrder',
                data: {
                    orderId: orderId
                },
                dataType: "json",
                success: function (response) {
                    HideOverlay('#div_table_order_without_account');
                    //Success
                    var data = response.data;
                    var listOrder = '';
                    var listGift = '';
                    var totalMustPay = 0;
                    var feeShip = 0;
                    var trHtml = '';
                    var trGiftHtml = '';

                    //Product gift
                    if (data != null) {
                        trHtml = ''
                        listGift = ''
                        if (data.orderItemObjs && data.orderItemObjs.length > 0) {
                            totalMustPay = 0;
                            feeShip = data.feeShip;
                            $.each(data.orderItemObjs, function (index, value) {
                                if (IsNullOrEmty(value.remark)) {
                                    totalMustPay += parseInt(((value.price - (value.discount > 0 ? value.discount : 0)) * value.quantity))
                                    trHtml += `  
                                     <tr>
                                             <th class="text-success" scope="row">
                                                ${value.productObj?.name}
                                                <small class="badge" style="background: #ff4a00">${value.productPriceObj?.typeName}</small>
                                             </th>
                                             <td><div style="width: 70px;"><img style="width: 100%;" src="${!IsNullOrEmty(value.imageObj?.smallUrl) ? value.imageObj?.smallUrl : '/img_dev/error/product.png'}" /></div></td>
                                             <td>${FormatToVNDCustom(parseInt((value.price - (value.discount > 0 ? value.discount : 0))))}</td>
                                             <td >${value.quantity}</td>
                                             <td style="color:orange">${FormatToVNDCustom(parseInt(((value.price - (value.discount > 0 ? value.discount : 0)) * value.quantity)) + (value.feeShip > 0 ? value.feeShip : 0))}</td>
                                    </tr> `
                                }
                                else {
                                    trGiftHtml += `  
                                     <tr>
                                             <th class="text-success" scope="row">${value.productObj?.name}</th>
                                             <td><div style="width: 70px;"><img style="width: 100%;" src="${!IsNullOrEmty(value.imageObj?.smallUrl) ? value.imageObj?.smallUrl : '/img_dev/error/product.jpg'}" /></div></td>
                                             <td>${value.quantity}</td>
                                    </tr> `
                                }

                            })
                        }
                        if (trGiftHtml != null && trGiftHtml.length > 0) {
                            listGift = `
                        <p class="pt-3 mt-5 fw-bolder text-primary div_gift" style="border-top: 1px solid #209e00;">Quà tặng kèm</p>
                              <table class="table center">
                                  <thead class="thead-dark">
                                      <tr>
                                          <th scope="col">Quà tặng</th>
                                          <th scope="col">Ảnh</th>
                                          <th scope="col">Số lượng</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                     ${trGiftHtml}
                                  </tbody>
                             </table>
                             
                        `
                        }


                        listOrder = `
                            <p class="pt-3 fw-bolder text-primary d-flex" style="border-top: 1px solid #209e00;">Đơn hàng : #${data.id}
                            <button type="button" class="btn btn-sm p-0 color-default mx-2 text-danger" onclick="CopyText('${data.id}')" title="Sap chép">
                                         <i class="fa fa-clone"></i> <span class="mx-1" style="text-transform:none;font-weight:normal;">Sao chép</span>
                                    </button></p>
                             <table class="table center">
                                  <thead class="thead-dark">
                                      <tr>
                                          <th scope="col">Tên</th>
                                          <th scope="col">Ảnh</th>
                                          <th scope="col">Đơn giá</th>
                                          <th scope="col">Số lượng</th>
                                          <th scope="col">Thành tiền</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                  <tr>
                                     ${trHtml}
                                  </tbody>
                                    <div class="mb-4">
                                 <i>
                                    <span class="fw-bolder">
                                        <i class="fa-solid fa-truck mx-2" style="color: #357ebd;"></i>
                                            Phí vận chuyển:
                                    </span>
                                    <span style="color:orange">${(feeShip > 0 ? FormatToVNDCustom(feeShip) : 'Chưa tính')}<span></i>
                                <br />
                                <i>
                                    <span class="fw-bolder">
                                        <i class="fa-solid fa-circle-dollar-to-slot mx-2" style="color: #357ebd;font-size: 20px;"></i>
                                        Tổng tiền đơn hàng:
                                    </span>
                                    <span style="color:#357ebd">${FormatToVNDCustom(totalMustPay + (feeShip > 0 ? feeShip : 0))}<span></i>
                               </div>
                             </table>
                         ${listGift}`

                        if (!IsNullOrEmty(listOrder)) {
                            document.getElementById("div_table_order_without_account").innerHTML = listOrder;
                        } else {
                            NoneRecordCustom();
                        }
                    }
                    else {
                        NoneRecordCustom();
                    }
                },
                error: function (error) {
                    HideOverlay('#div_table_order_without_account');
                    document.getElementById("div_table_order_without_account").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListOrderWithoutAccount();$(this).remove();">
                        </i>
                    </div>`;
                    $btnPlaceOrder.attr('disabled', 'disabled');
                }
            })
        }
        catch (e) {
            HideOverlay('#div_table_order_without_account');
            document.getElementById("div_table_order_without_account").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListOrderWithoutAccount()LoadListOrderWithoutAccount();$(this).remove();">
                        </i>
                    </div>`;
        }
    })
}

function NoneRecordCustom() {
    var html = `<div class="col-sm-12 text-center p-2">
                    <img src="/img_dev/cartdata.png" style="width:150px;" alt="No data" />
                    <p>Bạn không có đơn hàng nào.</p>
                    <a href="/san-pham" class="btn btn-solid">Tiếp tục mua sắm</a>
                </div>`;
    $('#div_table_order_without_account').html(html);
}

function FormatToVNDCustom(value) {
    if (IsNullOrEmty(value))
        return "NaN";
    return value.toLocaleString('vi', { style: 'currency', currency: 'VND' }).replace(/\s₫/g, 'đ');
}