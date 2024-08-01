var $productPrice = $('#product_price');

try {
    var laddaAddToCart = Ladda.create(document.querySelector('#btn_add_to_cart'));
} catch (e) {

}

$(document).ready(function () { //quantity




    $('.image-link').magnificPopup({ type: 'image' });
    $('input.input-number').each(function () {
        var $this = $(this),
            qty = $this.parent().find('.is-form'),
            min = Number($this.attr('min')),
            max = Number($this.attr('max'))
        if (min == 0) {
            var d = 0
        } else d = min
        $(qty).on('click', function () {
            if ($(this).hasClass('minus')) {
                if (d > min) d += -1
            } else if ($(this).hasClass('plus')) {
                var x = Number($this.val()) + 1
                if (x <= max) d += 1
            }
            $this.attr('value', d).val(d)
        })
    })

    $('#btn_copy_link').on('click', function () {
        console.log("1");
        navigator.clipboard.writeText(window.location.href);
        ShowToastNoti('success', '', 'Đã sao chép liên kết đến bài viết này.');
    })


    $('#btn_share_to_facebook').on('click', function () {
        var x = window.location.href
        var url = "https://www.facebook.com/sharer/sharer.php?u="
        window.open(url + x)
        ShowToastNoti('success', '', 'Đang chuyển hướng');
    })

    //Init js plugin image
    $('.div_image_product_slick').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: true,
        asNavFor: '.div_slider_nav'
    });
    $('.div_slider_nav').slick({
        vertical: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.div_image_product_slick',
        arrows: false,
        dots: false,
        focusOnSelect: true
    });

    LoadListRelatedProduct(); //Load related product
    RawPrice();//Raw price
    /*LoadListProductNew();*/

    //Add to card evnet click
    $('#btn_add_to_cart').on('click', function (e) {
        var isValid = true;
        //Check isvalid
        let priceId = $('input[name="typeProduct"]:checked').val();
        if (priceId == undefined || priceId == null) {
            swal.fire('Bạn chưa chọn loại sản phẩm!', '', 'warning');
            return false;
        }
        if (!isValid) return false;

        //When validate success
        var data = {
            productId: $('#input_product_id').val(),
            productPriceId: priceId,
            quantity: $('#input_quantity').val(),
        };

        if (ISLOGIN == 'False') {
            ShowModalDimissCreateAccount('1');

        } else {
            AddToCart(data);
            /*RefreshTotalPay();*/
        }
        
    });

    //Raw menu
    if (typeof (Storage) !== "undefined") {
        //Code for localStorage/sessionStorage.
        let resMenuData = localStorage.getItem('mainMenuData');
        let resMenuTimeout = parseInt(localStorage.getItem('mainMenuTimeOut'));
        if (IsNullOrEmty(resMenuData) || isNaN(resMenuTimeout) || resMenuTimeout < ConvertDateTimeToUnixTimestamp(new Date)) {
            //create or refresh
            $.ajax({
                type: 'GET',
                url: '/Home/GetMenu',
                dataType: 'json',
                success: function (response) {
                    if (!CheckResponseIsSuccess(response)) return false;
                    localStorage.setItem('mainMenuData', JSON.stringify(response));
                    localStorage.setItem('mainMenuTimeOut', ConvertDateTimeToUnixTimestamp(AddMinutes(new Date(), 10)));
                    RawMenu(response);
                }, error: function (err) {
                    CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
                }
            });
        } else {
            //reuse localStorage
            RawMenu(JSON.parse(resMenuData));
        }
    } else {
        console.log('Sorry! No Web Storage support...');
        $.ajax({
            type: 'GET',
            url: '/Home/GetMenu',
            dataType: 'json',
            success: function (response) {
                if (!CheckResponseIsSuccess(response)) return false;
                RawMenu(response);
            }, error: function (err) {
                CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
            }
        });
    }

    $('#input_dismiss_modal_create').on('change', function () {
        var bool = $('#input_dismiss_modal_create').is(':checked') ? 1 : 0
        localStorage.setItem('isDismiss', JSON.stringify(bool));
    })

});


/* /account/register */
function CreateAccountCustomer() {
    window.location.href = "/account/register";
}

/*Raw price html*/
function RawPrice() {
    if (productPriceArr == null || productPriceArr.length === 0) {
        $productPrice.html('Liên hệ');
        $('#div_view_price_addtocart_panel').hide();
        $('#div_view_quantity').hide();
        return false;
    }
    let html = '';
    let isDisable = false;
    for (var i = 0; i < productPriceArr.length; i++) {
        if (productPriceArr[i].isWarehouse === 1 && (productPriceArr[i].quantity === 0 || productPriceArr[i].quantity == null))

            isDisable = true;
        else
            isDisable = false;
        html +=
            `<div class="col-6 col-md-6 col-lg-4 px-1 mb-2 text-center custom_radio_with_image">
                <input type="radio" id="input_type_product_${i}" title="${IsNullOrEmty(productPriceArr[i].typeName) ? '' : productPriceArr[i].typeName}" name="typeProduct" value="${productPriceArr[i].id}" ${isDisable ? 'disabled' : ''} />
                <label for="input_type_product_${i}" title="${IsNullOrEmty(productPriceArr[i].typeName) ? '' : productPriceArr[i].typeName}">
                    <span class="mx-auto">${IsNullOrEmty(productPriceArr[i].typeName) ? '' : productPriceArr[i].typeName}</span>
                </label>
                ${isDisable ? '<span class="out_of_stock"><span class="text">Hết hàng</span></span>' : ''}
            </div>`;
    }
    $('#div_type_product_list').html(html);
    LoadPriceWhenClick();
    $(`input[name="typeProduct"][value="${productPriceArr[0].id}"]`).trigger('click');
}

//Load price item when click radio input
function LoadPriceWhenClick() {
    $('input[name="typeProduct"]').on('change', function () {
        let priceId = parseInt($('input[name="typeProduct"]:checked').val());
        let productPriceObj = productPriceArr.find(x => x.id === priceId);
        let discountRatio = "";
        var tmpRatio = 0;
        if (productPriceObj.discount > 0) {
            tmpRatio = CalDiscountPriceRatio(productPriceObj.discount, productPriceObj.priceOut);
            discountRatio = `<span class="badge text-white" style="background: #ff6900 !important">-${tmpRatio < 10 ? "0" + tmpRatio : tmpRatio}% Giảm</span>`;
            $('#input_product_price').val(CalDiscountPrice(productPriceObj.priceOut, productPriceObj.discount))
            $('#input_product_discount').val(parseInt(productPriceObj.discount))
            $('#div_view_quantity').slideDown(200);
        }
        else if (productPriceObj.priceOut > 0) {
            $('#div_view_quantity').slideDown(200);
            $('#input_product_price').val(parseInt(productPriceObj.priceOut))
            $('#input_product_discount').val(parseInt(0))
        }
        else {
            $('#div_view_quantity').slideUp(200);
        }
        $('#product_price').html(`${productPriceObj.priceOut === 0 ? _textOhterResource.contact : (productPriceObj.discount > 0 ? FormatToVND(CalDiscountPrice(productPriceObj.priceOut, productPriceObj.discount)) : FormatToVND(productPriceObj.priceOut))}
                    <del style="color: #929292">${productPriceObj.discount > 0 ? FormatToVND(productPriceObj.priceOut) : ""}</del>
                    ${discountRatio}`);
    });
}

//Load list related product
function LoadListRelatedProduct() {
    try {
        ShowOverlayLoadingButton("#div_list_related_product");
        $.ajax({
            type: 'GET',
            url: '/Product/GetListProductById',
            data: {
                productId: $('#input_product_id').val(),
                c2: $('#input_category_id').val()
            },
            dataType: "json",
            success: function (response) {
                HideOverlayLoadingButton("#div_list_related_product");
                //Check Error code
                if (response.result !== 1) {
                    document.getElementById("div_list_related_product").innerHTML = `
                        <div class="text-center p-2" >
                            <i type="button" class="fa fa-refresh"
                                style="border-radius:4px;font-size:24px;"
                                onclick="LoadListRelatedProduct();$(this).remove();">
                            </i>
                        </div >`;
                    return;
                }
                var listData = response.data;

                var tmpHtml = ``;
                if (listData != null && listData.length > 0) {
                    $.each(listData, function (key, value) {
                        tmpHtml += ` <div class="product-box wow product_css fadeIn ">
                            <div class="product_image_1 pb-2">
                                <div class="img__wrapper-2">
                                     <a class="sold_out-1 ${(!IsNullOrEmty(value.productPriceObjs) && value.productPriceObjs.length > 0 && (value.productPriceObjs[0].discount > 0 || value.productPriceObjs.pop().discount > 0)) ? '' : 'd-none'}" href="https://abc.com/">${RawListProductRatioDiscount(value.productPriceObjs)}</a>
                                     <div class="spotlight">
                                        <a href="/san-pham/${value.nameSlug}-${value.id}">
                                            <img data-src="${value.imageObj?.smallUrl}" class="img-fluid blur-up lazyload product_img_2" alt="${value.name}" href="/san-pham/${value.nameSlug}-${value.id}"
                                            onerror="this.onerror=null;this.src='/img_dev/error/avatar.png';">
                                        </a>
                                    </div>
                              
                                 </div>
                            <div class="product-detail pt-2">
                                <small class="categoryName product_clamp_description">${value.categoryObj?.name}</small>
                                <a data-toggle="tooltip" data-placement="top" title="${value.name ?? ''}" href="/san-pham/${value.nameSlug}-${value.id}">
                                    <div class="name name-2 h-100 name_product_popular product_clamp_description" title="${value.name ?? ''}">${IsNullOrEmty(value.name) ? "" : value.name}</div>
                                </a>
                                
                            </div>
                            </div>
                        </div>`;
                    });
                    document.getElementById("div_list_related_product").innerHTML = tmpHtml;
                    $('[data-toggle="tooltip"]').tooltip()
                    $('#div_list_related_product').slick({
                        arrows: true,
                        infinite: true,
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        autoplay: false,
                        mobile: true,
                        dots: true,
                        rows: 1,
                        autoplaySpeed: 3500,
                        responsive: [{
                            breakpoint: 1648,
                            settings: {
                                slidesToShow: 5,
                                infinite: true,
                            }
                        },
                        {
                            breakpoint: 1300,
                            settings: {
                                slidesToShow: 5,
                                infinite: true,
                            }
                        },
                        {
                            breakpoint: 991,
                            settings: {
                                slidesToShow: 3,
                            }
                        },
                        {
                            breakpoint: 680,
                            settings: {
                                slidesToShow: 2,
                            }
                        },
                        {
                            breakpoint: 400,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 320,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        ]
                    }).trigger("resize");
                }
                else {
                    document.getElementById("div_list_related_product").innerHTML = _imgNotFoundHtml;
                }
            },
            error: function (error) {
                HideOverlay("#div_list_related_product");
                document.getElementById("div_list_related_product").innerHTML = `
                        <div class="text-center p-2" >
                            <i type="button" class="fa fa-refresh"
                                style="border-radius:4px;font-size:24px;"
                                onclick="LoadListRelatedProduct();$(this).remove();">
                            </i>
                        </div >`;
                console.log("Error when load latest news!");
            }
        });
    } catch (e) {
        HideOverlayLoadingButton("#div_list_related_product");
        document.getElementById("div_list_related_product").innerHTML = `
                        <div class="text-center p-2" >
                            <i type="button" class="fa fa-refresh"
                                style="border-radius:4px;font-size:24px;"
                                onclick="LoadListRelatedProduct();$(this).remove();">
                            </i>
                        </div >`;
        console.log("Error when load related product!");
    }
}

//Caculate discount price
function CalDiscountPrice(num1, num2) {
    return num1 - num2;
}

//Caculate ratio discount price
function CalDiscountPriceRatio(num1, num2) {
    if (num1 == null || num1 === 0) return 0;
    let result = parseInt(num1 * 100 / num2);
    return result > 0 ? result : 1;
}

//Add to cart
function AddToCart(dataObj) {
    let formData = new FormData();
    formData.append("productId", dataObj.productId);
    formData.append("productPriceId", dataObj.productPriceId);
    formData.append("quantity", dataObj.quantity);
    laddaAddToCart.start();
    $.ajax({
        url: '/Checkout/AddToCart',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            laddaAddToCart.stop();
            if (!CheckResponseIsSuccess(response)) return false;
            $('#btn_checkout').fadeIn();
            $('.added-notification').addClass("show");
            setTimeout(function () {
                $('.added-notification').removeClass("show"); //show notificate add success
                laddaAddToCart.stop();
            }, 3000);
            CountShoppingCartItem();
        }, error: function (err) {
            laddaAddToCart.stop();
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

//Onchange quantity rang mix max value
function OnChangeRangeQuantityWithMinMax(elm) {
    let min = 1;
    let max = 9999;
    if ($(elm).val() > max) {
        $(elm).val(max);
    } else if ($(elm).val() < min) {
        $(elm).val(min);
    }
}

function RawListProductPrice(priceObj) {
    let html = '';
    if (priceObj == undefined || priceObj == null || priceObj.length === 0) {
        html = `<h4>${_textOhterResource.contact}</h4>`;
    } else {
        if (priceObj.length === 1) {
            html = `<h4>${priceObj[0].priceOut === 0 ? _textOhterResource.contact : (priceObj[0].discount > 0 ? FormatToVND(CalDiscountPrice(priceObj[0].priceOut, priceObj[0].discount)) : FormatToVND(priceObj[0].priceOut))}</h4>
                    <del>${priceObj[0].discount > 0 ? FormatToVND(priceObj[0].priceOut) : ""}</del>`;
        } else {
            let price = priceObj.map(x => x.priceOut);
            let discount = priceObj.map(x => x.discount);
            let priceDiscount = priceObj.map(x => x.priceOut - x.discount);
            let priceIsAllEqual = price.every((val, i, arr) => val === arr[0]);
            let discountIsAllEqual = discount.every((val, i, arr) => val === arr[0]);
            let priceDiscountIsAllEqual = priceDiscount.every((val, i, arr) => val === arr[0]);
            if (priceIsAllEqual && discountIsAllEqual) {
                html = `<h4>${priceObj[0].priceOut === 0 ? _textOhterResource.contact : (priceObj[0].discount > 0 ? FormatToVND(CalDiscountPrice(priceObj[0].priceOut, priceObj[0].discount)) : FormatToVND(priceObj[0].priceOut))}</h4>
                        <del>${priceObj[0].discount > 0 ? FormatToVND(priceObj[0].priceOut) : ""}</del>`;
            } else if (priceDiscountIsAllEqual) {
                html = `<h4>${FormatToVND(priceDiscount[0])}</h4>`;
            } else {
                let min = GetArrayMin(priceDiscount);
                let max = GetArrayMax(priceDiscount);
                html = `<h4>${FormatToVND(min)} ~ ${FormatToVND(max)}</h4>`;
            }
        }
    }
    return html;
}

function RawListProductRatioDiscount(priceObj) {
    let html = '';
    if (priceObj == undefined || priceObj == null || priceObj.length === 0) {
    } else {
        if (priceObj.length === 1) {
            if (priceObj[0].discount > 0) {
                tmpRatio = CalDiscountPriceRatio(priceObj[0].discount, priceObj[0].priceOut);
                html = `<div class="lable-block">
                            <span class="lable3">-${tmpRatio < 10 ? "0" + tmpRatio : tmpRatio}%</span> <span class="lable4"></span>
                        </div>`;
            }
        } else {
            let price = priceObj.map(x => x.priceOut);
            let discount = priceObj.map(x => x.discount);
            let ratioDiscount = priceObj.map(x => CalDiscountPriceRatio(x.discount, x.priceOut));
            let priceIsAllEqual = price.every((val, i, arr) => val === arr[0]);
            let discountIsAllEqual = discount.every((val, i, arr) => val === arr[0]);
            if (priceIsAllEqual && discountIsAllEqual) {
                if (priceObj[0].discount > 0) {
                    tmpRatio = CalDiscountPriceRatio(priceObj[0].discount, priceObj[0].priceOut);
                    html = `<div class="lable-block">
                            <span class="lable3">-${tmpRatio < 10 ? "0" + tmpRatio : tmpRatio}%</span> <span class="lable4"></span>
                        </div>`;
                }
            } else {
                let max = GetArrayMax(ratioDiscount);
                if (max > 0) {
                    tmpRatio = max;
                    html = `<div class="lable-block">
                                <span class="lable3">-${tmpRatio < 10 ? "0" + tmpRatio : tmpRatio}%</span> <span class="lable4"></span>
                            </div>`;
                }
            }
        }
    }
    return html;
}

function RawMenu(res) {
    //product category
    let productCategoryHtml = '';
    let liChildProductCategory = '';
    let ulChildProductCategory = '';
    if (res.data.categorys != null && res.data.categorys.length > 0) {
        //Menu Top old
        res.data.categorys.forEach(function (item) {
            ulChildProductCategory = '';
            if (item.childMenu != null && item.childMenu.length > 0) {
                liChildProductCategory = '';
                item.childMenu.forEach(function (child) {
                    liChildProductCategory += `<li><a href="/san-pham?c1=${item.id}&c2=${child.id}">${!IsNullOrEmty(child.name) ? child.name : ''}</a></li>`;
                });
                ulChildProductCategory = `<ul>${liChildProductCategory}</ul>`;
            }
            productCategoryHtml +=
                `<li>
                        <a href="/san-pham?c1=${item.id}">
                            <img src="${!IsNullOrEmty(item.imageUrl) ? item.imageUrl : '/assets/images/icon/404-error.png'}" onerror="this.onerror=null;this.src='/assets/images/icon/404-error.png';"
                                    class="img-fluid me-2" alt="" />
                            ${!IsNullOrEmty(item.name) ? item.name : ''}
                        </a>
                        ${ulChildProductCategory}
                </li>`;
        });
    }
    //news category
    let liNewsCategory = '';
    if (res.data.newsCategorys != null && res.data.newsCategorys.length > 0) {
        res.data.newsCategorys.forEach(function (item) {
            liNewsCategory +=
                `<li>
                        <a href="/tin-tuc?c=${item.id}" style="white-space:inherit;">${!IsNullOrEmty(item.name) ? item.name : ''}</a>
                    </li>`;
        });
    }

    ////Init smartmenus
    //$('.ul_menu_product_category').html(productCategoryHtml);
    //$('.ul_menu_news_category').html(liNewsCategory);
    //if ($(window).width() > '1200') {
    //    $('.ul_menu_product_category > li').hover(
    //        function () {
    //            if ($(this).children().hasClass('has-submenu')) {
    //                $(this).parents().find('nav').addClass('sidebar-unset');
    //            }
    //        },
    //        function () {
    //            $(this).parents().find('nav').removeClass('sidebar-unset');
    //        }
    //    )
    //}
    //$('#ul_main_memnu').smartmenus({
    //    subMenusSubOffsetX: 1,
    //    subMenusSubOffsetY: -8
    //});
    //$('.ul_menu_product_category').smartmenus({
    //    subMenusSubOffsetX: 1,
    //    subMenusSubOffsetY: -8
    //});
}

function ShowModalDimissCreateAccount(type) {
    if (JSON.parse(localStorage.getItem('isDismiss')) == 1) {
        var isValid = true;
        //Check isvalid
        let priceId = $('input[name="typeProduct"]:checked').val();
        if (priceId == undefined || priceId == null) {
            swal.fire('Bạn chưa chọn loại sản phẩm!', '', 'warning');
            return false;
        }
        if (!isValid) return false;
        var dataLocalStorage = {
            productId: $('#input_product_id').val(),
            productPriceId: priceId,
            nameSlug: $('#input_name_slug').val(),
            quantity: $('#input_quantity').val(),
            imageUrl: $('#input_imageUrl').val(),
            productName: $('#product_name').text().trim(),
            productPrice: $('#input_product_price').val(),
            discount: $('#input_product_discount').val(),
            typeName: $('#div_type_product_list input:checked').attr("title")
        };
        AddToCartLocalStorage(dataLocalStorage);
        $('#modal_dismiss_create_account').modal('hide')

    } else {
        if (type == 1) {
            //type 1: button btn_add_to_cart
            //type 2: button btn_add_to_cart_modal
            $('#modal_dismiss_create_account').modal('show')
        } else {
            var isValid = true;
            //Check isvalid
            let priceId = $('input[name="typeProduct"]:checked').val();
            if (priceId == undefined || priceId == null) { 
                swal.fire('Bạn chưa chọn loại sản phẩm!', '', 'warning');
                return false;
            }
            if (!isValid) return false;
            var dataLocalStorage = {
                productId: $('#input_product_id').val(),
                productPriceId: priceId,
                nameSlug: $('#input_name_slug').val(),
                quantity: $('#input_quantity').val(),
                imageUrl: $('#input_imageUrl').val(),
                productName: $('#product_name').text().trim(),
                productPrice: $('#input_product_price').val(),
                discount: $('#input_product_discount').val(),
                typeName: $('#div_type_product_list input:checked').attr("title")
            };
            AddToCartLocalStorage(dataLocalStorage);
            $('#modal_dismiss_create_account').modal('hide')
        }
    }
}

