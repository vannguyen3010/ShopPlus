$(document).ready(function () {
    LoadProductPopular();
    LoadListNewDiscount();
    LoadListNews();
    LoadListNewProductItem();
    LoadProductDiscount();
    LoadProductSelling();
    LoadProductHightlight();
    LoadListIntroductData();
    //Banner top
    $('.banner_top_v2').slick({
        dots: false,
        infinite: false,
        speed: 1200,
        cssEase: 'linear',
        slidesToShow: 1,
        autoplay: true,
        rows: 4,
        fade: true,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    //Banner_Mid

    $('.slider_banner_mid').slick({
        dots: false,
        rows: 1,
        infinite: true,
        speed: 1200,
        cssEase: 'linear',
        slidesToShow: 1,
        autoplay: true,
        fade: true,
        slidesToScroll: 1,
        //responsive: [
        //    {
        //        breakpoint: 1024,
        //        settings: {
        //            slidesToShow: 1,
        //            slidesToScroll: 1,
        //            infinite: true,
        //            dots: false
        //        }
        //    },
        //    {
        //        breakpoint: 600,
        //        settings: {
        //            slidesToShow: 1,
        //            slidesToScroll: 1
        //        }
        //    },
        //    {
        //        breakpoint: 480,
        //        settings: {
        //            slidesToShow: 1,
        //            slidesToScroll: 1,
        //            prevArrow: false,
        //            nextArrow: false,
        //        }
        //    }
        //]
    });
   
    $('.slider_banner_header').slick({
        dots: false,
        infinite: true,
        speed: 2200,
        cssEase: 'linear',
        slidesToShow: 1,
        autoplay: true, // Tự động trượt qua các ảnh
        autoplaySpeed: 3000, // Thời gian hiển thị mỗi ảnh trước khi chuyển sang ảnh tiếp theo (đơn vị: milliseconds)
        fade: true,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    prevArrow: false,
                    nextArrow: false,
                }
            }
        ]
    });

    $('.slider_banner_header_mid').slick({
        dots: false,
        infinite: true,
        speed: 2200,
        cssEase: 'linear',
        slidesToShow: 1,
        rows: 1,
        autoplay: true, // Tự động trượt qua các ảnh
        autoplaySpeed: 3000, // Thời gian hiển thị mỗi ảnh trước khi chuyển sang ảnh tiếp theo (đơn vị: milliseconds)
        fade: true,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    prevArrow: false,
                    nextArrow: false,
                }
            }
        ]
    });

  

})

function LoadProductPopular() {
    try {
        $.ajax({
            type: 'GET',
            url: '/Home/GetProductPopular',
            dataType: "json",
            success: function (response) {
                if (response.result !== 1) {
                    document.getElementById("div_popular_product").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductPopular();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                    return false;
                }

                //Success
                var listData = response.data;
                var tmpHtml = '';
                if (listData != null && listData.length > 0) {
                    $.each(listData, function (key, value) {
                        tmpHtml += `
                          <div class="product-box wow product_css col_2_4_custom fadeIn col-6 col-md-4 col-lg-4 ">
                            <div class="product_image_1 pb-2">
                                <div class="img__wrapper-1">
                                     <a class="sold_out-1 ${(!IsNullOrEmty(value.productPriceObjs) && value.productPriceObjs.length > 0 && (value.productPriceObjs[0].discount > 0 || value.productPriceObjs[value.productPriceObjs.length - 1].discount > 0)) ? '' : 'd-none'}" href="">${RawListProductRatioDiscount(value.productPriceObjs)}</a>
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
                                ${RawListProductPrice(value.productPriceObjs)}

                                <div class="counter-box">

                                    <div class="addtocart_btn">
                                        <a href="/san-pham/${value.nameSlug}-${value.id}" class="position-relative add-button addcart-button btn buy-button text-light" style="    background: linear-gradient(to right, #ec1a17, #ffad00);">
                                            <span>Xem thêm</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            
                            </div>
                        </div>`;
                    });
                    document.getElementById("div_popular_product").innerHTML = tmpHtml;
                    $('[data-toggle="tooltip"]').tooltip()
                    $('.slider_product').slick({
                        arrows: true,
                        infinite: true,
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        autoplay: false,
                        mobile: true,
                        dots: true,
                        rows: 2,
                        autoplaySpeed: 3500,
                        responsive: [
                            {
                                breakpoint: 1648,
                                settings: {
                                    slidesToShow: 5,
                                }
                            },
                            {
                                breakpoint: 1300,
                                settings: {
                                    slidesToShow: 4,
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
                                    slidesToShow: 2,
                                }
                            },
                        ]
                    })

                }
                else {
                    document.getElementById("div_popular_product").innerHTML = ` 
                   <div class="d-flex align-items-center flex-column">
                            <img class="w-auto d-flex m-auto" src="/img_dev/error/datanull.jpg" style="width:80px; height:80px;">
                            <span class="text-muted">Không có dữ liệu!</span>
                        </div>`;
                }
            },
            error: function (error) {
                document.getElementById("div_popular_product").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductPopular();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                console.log("Error when load product popular!");
            }
        });
    } catch (e) {
        document.getElementById("div_popular_product").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductPopular();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
        console.log("Error when load product popular!");
    }
}

function LoadListNewDiscount() {
    try {
        $.ajax({
            type: 'GET',
            url: '/Home/GetProductDiscount',
            dataType: "json",
            success: function (response) {
                if (response.result !== 1) {
                    document.getElementById("slider_product_new").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductPopular();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                    return false;
                }

                //Success
                var listData = response.data;
                var tmpHtml = '';
                if (listData != null && listData.length > 0) {
                   
                    $.each(listData, function (key, value) {
                        tmpHtml += `
                          <div class="product-box wow product_css fadeIn ">
                            <div class="product_image_1 pb-2">
                                <div class="img__wrapper-2">
                                     <a class="sold_out-1 ${!IsNullOrEmty(value.productPriceObjs[0]?.discount) && value.productPriceObjs[0]?.discount > 0 ? '' : 'd-none'}" href="">${RawListProductRatioDiscount(value.productPriceObjs)}</a>
                                     <div class="spotlight">
                                        <a href="/san-pham/${value.nameSlug}-${value.id}">
                                            <img data-src="${value.imageObj.smallUrl}" class="img-fluid blur-up lazyload product_img_2" alt="${value.name}" href="/san-pham/${value.nameSlug}-${value.id}"
                                            onerror="this.onerror=null;this.src='/img_dev/error/avatar.png';">
                                        </a>
                                    </div>
                              
                                 </div>
                            <div class="product-detail pt-2">
                                <small class="categoryName product_clamp_description">${value.categoryObj.name}</small>
                                <a data-toggle="tooltip" data-placement="top" title="${value.name ?? ''}" href="/san-pham/${value.nameSlug}-${value.id}">
                                    <div class="name name-2 h-100 name_product_popular product_clamp_description" title="${value.name ?? ''}">${IsNullOrEmty(value.name) ? "" : value.name}</div>
                                </a>
                                ${RawListProductPrice(value.productPriceObjs)}
                                 <div class="counter-box">

                                    <div class="addtocart_btn">
                                        <a href="/san-pham/${value.nameSlug}-${value.id}" class="position-relative add-button addcart-button btn buy-button text-light" style="background: linear-gradient(to right, #ec1a17, #ffad00);">
                                            <span>Xem thêm</span>
                                        </a>
                                    </div>
                                </div>
                              
                            </div>
                            </div>
                        </div>`;
                    });
                    document.getElementById("slider_product_new").innerHTML = tmpHtml;
                    $('[data-toggle="tooltip"]').tooltip()
                    $('#slider_product_new').slick({
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
                                slidesToShow: 2,
                            }
                        },
                        ]
                    }).trigger("resize");
                }
                else {
                    document.getElementById("slider_product_new").innerHTML =
                        // `
                        //<div class="d-flex align-items-center flex-column">
                        //         <img class="w-auto d-flex m-auto" src="/img_dev/error/datanull.jpg" style="width:80px; height:80px;">
                        //         <span class="text-muted">Không có dữ liệu!</span>
                        //     </div>`;
                    $("#div_product_discount").hide();
                }
            },
            error: function (error) {
                document.getElementById("slider_product_new").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductPopular();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                console.log("Error when load product popular!");
            }
        });
    } catch (e) {
        document.getElementById("div_popular_product").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductPopular();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
        console.log("Error when load product popular!");
    }
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

function RawListProductPrice(priceObj) {

    let html = '';
    if (priceObj == undefined || priceObj == null || priceObj.length === 0) {
        html = `<h5 class="price_normal text-danger">${_textOhterResource.contact}</h5>`;
    } else {
        if (priceObj.length === 1) {
            html = `<div class="${priceObj[0].discount > 0 ? "price_discount" : "price_normal"} price_product_popular"><del>${priceObj[0].discount > 0 ? FormatToVND(priceObj[0].priceOut) : ""}</del> ${priceObj[0].priceOut === 0 ? _textOhterResource.contact : (priceObj[0].discount > 0 ? FormatToVND(CalDiscountPrice(priceObj[0].priceOut, priceObj[0].discount)) : FormatToVND(priceObj[0].priceOut))}</div>
                    `;
        } else {
            let price = priceObj.map(x => x.priceOut);
            let discount = priceObj.map(x => x.discount);
            let priceDiscount = priceObj.map(x => x.priceOut - x.discount);
            let priceIsAllEqual = price.every((val, i, arr) => val === arr[0]);
            let discountIsAllEqual = discount.every((val, i, arr) => val === arr[0]);
            let priceDiscountIsAllEqual = priceDiscount.every((val, i, arr) => val === arr[0]);
            if (priceIsAllEqual && discountIsAllEqual) {
                html = `<div class="${priceObj[0].discount > 0 ? "price_discount" : "price_normal"}" >${priceObj[0].priceOut === 0 ? _textOhterResource.contact : (priceObj[0].discount > 0 ? FormatToVND(CalDiscountPrice(priceObj[0].priceOut, priceObj[0].discount)) : FormatToVND(priceObj[0].priceOut))}</div>
                        <del>${priceObj[0].discount > 0 ? FormatToVND(priceObj[0].priceOut) : ""}</del>`;
            } else if (priceDiscountIsAllEqual) {
                html = `<h4 >${FormatToVND(priceDiscount[0])}</h4>`;
            } else {
                let min = GetArrayMin(priceDiscount);
                let max = GetArrayMax(priceDiscount);
                html = `<h6 class="price_css_div" style="color:red !important">${FormatToVND(min)} ~ ${FormatToVND(max)}</h6>`;
            }
        }
    }
    return html;
}

function IsNullOrEmty(string) {
    return string == null || string === "";
}

function CalDiscountPrice(num1, num2) {
    return num1 - num2;
}

function CalDiscountPriceRatio(num1, num2) {
    if (num1 == null || num1 === 0) return 0;
    let result = parseInt(num1 * 100 / num2);
    return result > 0 ? result : 1;
}

function LoadListNewProductItem() {
    try {
        $.ajax({
            type: 'GET',
            url: '/Product/GetListNewProduct',
            dataType: "json",
            success: function (response) {
                if (response.result !== 1) {
                    document.getElementById("div_item_list_product").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadListNewProductItem();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                    return false;
                }

                //Success
                var listData = response.data;
                var tmpHtml = '';
                if (listData != null && listData.length > 0) {
                    $.each(listData, function (key, value) {
                        tmpHtml += `
                         <div class="top-selling-contain wow d-flex mb-2 fadeInUp">
                                    <a href="/san-pham/${value.nameSlug}-${value.id}" class="top-selling-image">
                                        <img data-src="${value.imageObj?.smallUrl}"
                                             class="img-fluid blur-up lazyload" alt="${value.name}"
                                              onerror="this.onerror=null;this.src='/img_dev/error/avatar.png';">
                                    </a>

                                    <div class="top-selling-detail">
                                        <a href="/san-pham/${value.nameSlug}-${value.id}">
                                            <h5 title="${IsNullOrEmty(value.name) ? "" : value.name}">${IsNullOrEmty(value.name) ? "" : value.name}</h5>
                                        </a>
                                        <div class="price-product">${RawListProductPrice(value.productPriceObjs)}</div>
                                    </div>
                                </div>`;
                    });
                    document.getElementById("div_item_list_product").innerHTML = tmpHtml;
                    $('#div_item_list_product').slick({
                        arrows: false,
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: false,
                        rows: 4,
                        mobile: true,
                        autoplaySpeed: 3500,
                        responsive: [{
                            breakpoint: 1648,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 1300,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 991,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 770,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        ]
                    })
                }
                else {
                    document.getElementById("div_no_data_Item").style.display = "none";
                    //document.getElementById("div_item_list_product").innerHTML = `  <div class="d-flex align-items-center flex-column">
                    //        <img class="w-auto d-flex m-auto" src="/img_dev/error/datanull.jpg" style="width:80px; height:80px;">
                    //        <span class="text-muted">Không có dữ liệu!</span>
                    //    </div>`;
                }
            },
            error: function (error) {
                document.getElementById("div_item_list_product").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductPopular();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                console.log("Error when load product popular!");
            }
        });
    } catch (e) {
        document.getElementById("div_item_list_product").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadListNewProductItem();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
        console.log("Error when load product popular!");
    }
}

function LoadProductDiscount() {
    try {
        $.ajax({
            type: 'GET',
            url: '/Home/GetProductDiscount',
            dataType: "json",
            success: function (response) {
                if (response.result !== 1) {
                    document.getElementById("div_discount_product_slide").innerHTML = `
                    <div class="text-center p-2">
                    
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductDiscount();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                    return false;
                }

                //Success
                var listData = response.data;
                var tmpHtml = '';
                if (listData != null && listData.length > 0) {
                    $.each(listData, function (key, value) {
                        tmpHtml += `
                        <div class="top-selling-contain d-flex wow mb-2 fadeInUp">
                                    <a href="/san-pham/${value.nameSlug}-${value.id}" class="top-selling-image">
                                        <img data-src="${value.imageObj.smallUrl}"
                                             class="img-fluid blur-up lazyload" alt="${value.name}" style="aspect-ratio: 1/1;"
                                              onerror="this.onerror=null;this.src='/img_dev/error/avatar.png';">
                                    </a>

                                    <div class="top-selling-detail">
                                        <a href="/san-pham/${value.nameSlug}-${value.id}">
                                            <h5 class="product-clamp-description" title="${IsNullOrEmty(value.name) ? "" : value.name}">${IsNullOrEmty(value.name) ? "" : value.name}</h5>
                                        </a>
                                        ${RawListProductPrice(value.productPriceObjs)}
                                    </div>
                                </div>`;
                    });
                    document.getElementById("div_discount_product_slide").innerHTML = tmpHtml;
                    $('#div_discount_product_slide').slick({
                        arrows: false,
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: false,
                        rows: 4,
                        mobile: true,
                        autoplaySpeed: 3500,
                        responsive: [{
                            breakpoint: 1648,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 1300,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 991,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 770,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        ]
                    })
                }
                else {
                    //document.getElementById("div_discount_product_slide").innerHTML = `    <div class="d-flex align-items-center flex-column">
                    //        <img class="w-auto d-flex m-auto" src="/img_dev/error/datanull.jpg" style="width:80px; height:80px;">
                    //        <span class="text-muted">Không có dữ liệu!</span>
                    //    </div>`;
                    document.getElementById("div_no_data_discount").style.display = "none";
                }
            },
            error: function (error) {
                document.getElementById("div_discount_product_slide").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductDiscount();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                console.log("Error when load product popular!");
            }
        });
    } catch (e) {
        document.getElementById("div_discount_product_slide").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductDiscount();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
        console.log("Error when load product popular!");
    }
}

function LoadProductSelling() {
    try {
        $.ajax({
            type: 'GET',
            url: '/Home/GetProductSelling',
            dataType: "json",
            success: function (response) {
                if (response.result !== 1) {
                    document.getElementById("slider_div_selling_products").innerHTML = `
                    <div class="text-center p-2">
                         <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductSelling();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                    return false;
                }

                //Success
                var listData = response.data;
                var tmpHtml = '';
                if (listData != null && listData.length > 0) {
                    $.each(listData, function (key, value) {
                        tmpHtml += `
                         <div class="top-selling-contain wow d-flex mb-2 fadeInUp">
                                    <a href="/san-pham/${value.nameSlug}-${value.id}" class="top-selling-image">
                                        <img data-src="${value.imageObj?.smallUrl}" style="aspect-ratio: 1;object-fit: cover"
                                             class="img-fluid blur-up lazyload"
                                             onerror="this.onerror=null;this.src='/img_dev/error/product.png';"alt="${value.name}">
                                    </a>

                                    <div class="top-selling-detail">
                                        <a href="/san-pham/${value.nameSlug}-${value.id}">
                                            <h5 title="${IsNullOrEmty(value.name) ? "" : value.name}">${IsNullOrEmty(value.name) ? "" : value.name}</h5>
                                        </a>
                                        <div class=".price-product">${RawListProductPrice(value.productPriceObjs)}</div>
                                    </div>
                                </div>`;
                    });
                    document.getElementById("slider_div_selling_products").innerHTML = tmpHtml;
                    $('#slider_div_selling_products').slick({
                        arrows: false,
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: false,
                        rows: 4,
                        mobile: true,
                        autoplaySpeed: 3500,
                        responsive: [{
                            breakpoint: 1648,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 1300,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 991,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 770,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        ]
                    })
                }
                else {
                    document.getElementById("div_no_data").style.display = "none";
                    //document.getElementById("slider_div_selling_products").innerHTML = `  <div class="d-flex align-items-center flex-column">
                    //        <img class="w-auto d-flex m-auto" src="/img_dev/error/datanull.jpg" style="width:80px; height:80px;">
                    //        <span class="text-muted">Không có dữ liệu!</span>
                    //    </div>`;
                }

            },
            error: function (error) {
                document.getElementById("slider_div_selling_products").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductSelling();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                console.log("Error when load product popular!");
            }
        });
    } catch (e) {
        document.getElementById("slider_div_selling_products").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductSelling();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
        console.log("Error when load product popular!");
    }
}

function LoadProductHightlight() {
    try {
        $.ajax({
            type: 'GET',
            url: '/Home/GetProductPopular',
            dataType: "json",
            success: function (response) {
                if (response.result !== 1) {
                    document.getElementById("slider_div_highlight_products").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductHightlight();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                    return false;
                }

                //Success
                var listData = response.data;
                var tmpHtml = '';
                if (listData != null && listData.length > 0) {
                    $.each(listData, function (key, value) {
                        tmpHtml += `

                           <div class="top-selling-contain mb-2 d-flex wow fadeInUp">
                                    <a href="/san-pham/${value.nameSlug}-${value.id}" class="top-selling-image">
                                        <img data-src="${value.imageObj?.smallUrl}"
                                             class="img-fluid blur-up lazyload" alt="${value.name}" style="aspect-ratio: 1/1;"
                                              onerror="this.onerror=null;this.src='/img_dev/error/avatar.png';">
                                    </a>

                                    <div class="top-selling-detail">
                                        <a href="/san-pham/${value.nameSlug}-${value.id}">
                                            <h5 title="${IsNullOrEmty(value.categoryObj?.name) ? "" : value.categoryObj?.name}">${IsNullOrEmty(value.name) ? "" : value.categoryObj?.name}</h5>
                                        </a>
                                       ${RawListProductPrice(value.productPriceObjs)}
                                    </div>
                                </div>`;
                    });
                    document.getElementById("slider_div_highlight_products").innerHTML = tmpHtml;
                    $('#slider_div_highlight_products').slick({
                        arrows: false,
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: false,
                        rows: 4,
                        mobile: true,
                        autoplaySpeed: 3500,
                        responsive: [{
                            breakpoint: 1648,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 1300,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 991,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        {
                            breakpoint: 770,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        ]
                    })
                }
                else {
                    //document.getElementById("slider_div_highlight_products").innerHTML = `  <div class="d-flex align-items-center flex-column">
                    //        <img class="w-auto d-flex m-auto" src="/img_dev/error/datanull.jpg" style="width:80px; height:80px;">
                    //        <span class="text-muted">Không có dữ liệu!</span>
                    //    </div>`;
                    document.getElementById("slider_div_highlight_products").style.display = "none";
                }
            },
            error: function (error) {
                document.getElementById("slider_div_highlight_products").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductHightlight();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                console.log("Error when load product popular!");
            }
        });
    } catch (e) {
        document.getElementById("slider_div_highlight_products").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductHightlight();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
        console.log("Error when load product popular!");
    }
}

function LoadListNews() {

    try {
        $.ajax({
            type: 'GET',
            url: '/Home/GetListNews',
            dataType: "json",
            success: function (response) {
                //Check Error code
                if (response.result !== 1) {
                    document.getElementById("div_latest_news").innerHTML = ` 
                       <div class="text-center p-2" >
                                <i type="button" class="fa fa-refresh"
                                    style="border-radius:4px;font-size:24px;"
                                    onclick="LoadListNews();ShowOverlayLoadingButton(this);">
                                </i>
                        </div >`;
                    return;
                }

                var listData = response.data;
                var tmpHtml = ``;
                if (listData != null && listData.length > 0) {
                    $.each(listData, function (key, value) {

                        var date = moment(value.createdAt).format('DD-MM-YYYY');
                        tmpHtml +=
                            `
                        <div class="product-slider list_news wow fadeInUp">
                            <div class="product-image-3">
                                 <a href="/tin-tuc/${value.titleSlug}-${value.id}" class="product-slider-image">
                                <img data-src="${IsNullOrEmty(value.imageObj?.mediumUrl) ? "/assets/images/error/news.png" : value.imageObj?.mediumUrl}" class="w-100 blur-up lazyload rounded-3 product-img-4"
                                   onerror="this.onerror=null;this.src='/img_dev/error/product.png';" alt="${value.title}">
                            </a>

                            <div class="product-slider-detail">
                                <div>
                                    <h4>${date}</h4>
                                    <a href="/tin-tuc/${value.titleSlug}-${value.id}" title="${IsNullOrEmty(value.title) ? "" : value.title}" class="d-block">
                                        <h3 class="text-title">${IsNullOrEmty(value.title) ? "" : value.title}</h3>
                                    </a>
                                    <h5 class="new-description" title="${IsNullOrEmty(value.description) ? "" : value.description}">${IsNullOrEmty(value.description) ? "" : value.description}</h5>
                                   
                                </div>
                            </div>
                            </div>
                           
                        </div>`;
                    });
                    document.getElementById("div_latest_news").innerHTML = tmpHtml;
                    $('#div_latest_news').slick({
                        arrows: false,
                        infinite: true,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        autoplay: false,
                        mobile: true,
                        autoplaySpeed: 3500,
                        responsive: [{
                            breakpoint: 1648,
                            settings: {
                                slidesToShow: 3,
                            }
                        },
                        {
                            breakpoint: 1300,
                            settings: {
                                slidesToShow: 3,
                            }
                        },
                        {
                            breakpoint: 991,
                            settings: {
                                slidesToShow: 2,
                            }
                        },
                        {
                            breakpoint: 770,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        ]
                    }).trigger("resize");

                }
                else {
                    //document.getElementById("div_latest_news").innerHTML = `

                    //     <section id="div_show_new_lated" class="d-none">

                    //     </section>
                    //`;
                    document.getElementById("div_show_new_lated").style.display = "none";
                }
            },
            error: function (error) {
                document.getElementById("div_latest_news").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListNews();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                console.log("Error when load latest news!");
            }
        });
    } catch (e) {
        document.getElementById("div_latest_news").innerHTML = `
                        <div class="text-center p-2" >
                            <i type="button" class="fa fa-refresh"
                                style="border-radius:4px;font-size:24px;"
                                onclick="LoadListNews();ShowOverlayLoadingButton(this);">
                            </i>
                        </div >`;
        console.log("Error when load latest news!");
    }
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

    //Init smartmenus
    $('.ul_menu_product_category').html(productCategoryHtml);
    $('.ul_menu_news_category').html(liNewsCategory);
    if ($(window).width() > '1200') {
        $('.ul_menu_product_category > li').hover(
            function () {
                if ($(this).children().hasClass('has-submenu')) {
                    $(this).parents().find('nav').addClass('sidebar-unset');
                }
            },
            function () {
                $(this).parents().find('nav').removeClass('sidebar-unset');
            }
        )
    }
    $('#ul_main_memnu').smartmenus({
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8
    });
    $('.ul_menu_product_category').smartmenus({
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8
    });
}

//Load list main data
function LoadListIntroductData() {

    try {
        $.ajax({
            type: 'GET',
            url: '/Home/GetListIntroduce',
            dataType: "json",
            success: function (response) {
                //Check Error code
                if (response.result !== 1) {
                    document.getElementById("div_list_introduce_js").innerHTML = ` 
                       <div class="text-center p-2" >
                                <i type="button" class="fa fa-refresh"
                                    style="border-radius:4px;font-size:24px;"
                                    onclick="LoadListIntroductData();ShowOverlayLoadingButton(this);">
                                </i>
                        </div >`;
                    return;
                }

                var listData = response.data;
                var tmpHtml = ``;
                if (listData != null && listData.length > 0) {
                    $.each(listData, function (key, value) {

                        var date = moment(value.createdAt).format('DD-MM-YYYY');
                        tmpHtml +=
                            `
                                <div class="col-xl-4">
                                <div class="offer-banner hover-effect" style="height: 300px;">
                                    <img style="object-fit: cover" data-src="${value.imageObj?.smallUrl}" class="img-fluid bg-img blur-up lazyload w-100 h-100"
                                         alt="${value.name}" onerror="this.onerror=null;this.src='/img_dev/error/avatar.png';">
                                    <div class="banner-detail">
                                        <h5 class="theme-color">${value.categoryObj?.name}</h5>
                                        <h6 class="div_introduce_clamp">${IsNullOrEmty(value.title) ? "" : value.title}</h6>
                                    </div>
                                    <div class="offer-box">
                                        <a href="/gioi-thieu/${value.titleSlug}-${value.id}" class="btn-category btn theme-bg-color text-white">
                                            Xem thêm
                                        </a>
                                    </div>
                                </div>
                            </div>`;
                    });
                    document.getElementById("div_list_introduce_js").innerHTML = tmpHtml;
                    $('#div_list_introduce_js').slick({
                        arrows: true,
                        infinite: true,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        dots: true,
                        responsive: [{
                            breakpoint: 1450,
                            settings: {
                                slidesToShow: 2,
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 1,
                                fade: true,
                            }
                        },
                        ]
                    })

                }
                else {
                    //document.getElementById("div_list_introduce_js").innerHTML =
                    //`

                    //     <section id="div_show_new_lated" class="d-none">

                    //     </section>
                    //`;
                    document.getElementById("js_introduce").style.display = "none";
                }
            },
            error: function (error) {
                document.getElementById("div_latest_news").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListNews();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                console.log("Error when load latest news!");
            }
        });
    } catch (e) {
        document.getElementById("div_list_introduce_js").innerHTML = `
                        <div class="text-center p-2" >
                            <i type="button" class="fa fa-refresh"
                                style="border-radius:4px;font-size:24px;"
                                onclick="LoadListIntroductData();ShowOverlayLoadingButton(this);">
                            </i>
                        </div >`;
        console.log("Error when load latest news!");
    }
}
