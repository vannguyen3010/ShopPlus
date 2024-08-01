var $categoryIdEl = $('#input_category_id'),
    $pageEl = $('#input_page'),
    $recordEl = $('#input_record');

const dataParms = function () {
    return {
        c: IsNullOrEmty($categoryIdEl.val()) ? null : parseInt($categoryIdEl.val()),
        page: parseInt($pageEl.val()),
        record: parseInt($recordEl.val())
    }
}

$(document).ready(function () {
    LoadListMainData();
    LoadListNewProductItem();
});

//Load list main data
function LoadListMainData() {
    var data = dataParms();
    try {
        ShowOverlay("#div_main_data");
        $.ajax({
            type: 'GET',
            url: '/About/GetList',
            data: data,
            dataType: "json",
            success: function (response) {
                HideOverlay("#div_main_data");
                if (response.result !== 1) {
                    document.getElementById("div_main_data").innerHTML = ` 
                    <div class="text-center p-2">
                        <h4>Kết nối không ổn định</h4>
                        <button type="button" class="btn btn-primary" 
                            style="width:200px;height:45px;border-radius:4px;" 
                            onclick="LoadListMainData();$(this).parent().remove();">Tải lại
                        </button>
                    </div>`;
                    return;
                }

                var listData = response.data;
                var tmpHtml = '';
                if (listData != null && listData.length > 0) {
                    $.each(listData, function (key, value) {
                        tmpHtml +=
                            ` <div class="col-12">
                            <div class="blog-box blog-list wow fadeInUp">
                                <a class="blog-image" href="/gioi-thieu/${value.titleSlug}-${value.id}" style="height: 300px;">
                                    <img src="${IsNullOrEmty(value.imageObj?.mediumUrl) ? "/assets/images/error/news.png" : value.imageObj?.mediumUrl}"" class="blur-up lazyload w-100 h-100" alt="${value.title}"
                                    onerror="this.onerror=null;this.src='/img_dev/error/avatar.png';" style="object-fit: cover">
                                </a>

                                <div class="blog-contain blog-contain-2">
                                    <div class="blog-label">
                                        <span class="time"><i data-feather="clock"></i> <p>${moment(value.createdAt).format("DD-MM-YYYY") }</p></span>
                                        <span class="super">
                                            <i data-feather="user"></i> <span style="font-weight: 600;color: #192;">
                                                ${value.categoryObj?.name}
                                            </span>
                                        </span>
                                    </div>
                                    <a href="/gioi-thieu/${value.titleSlug}-${value.id}">
                                        <h3 title="${IsNullOrEmty(value.title) ? "" : value.title}">${IsNullOrEmty(value.title) ? "" : value.title}</h3>
                                    </a>
                                    <p class="des_css_clamp" title="${IsNullOrEmty(value.description) ? "" : value.description}">
                                        ${IsNullOrEmty(value.description) ? "" : value.description}
                                    </p>
                                    <a href="/gioi-thieu/${value.titleSlug}-${value.id}" class="blog-button" style="width: 140px">
                                        Xem thêm <i class="fa-solid fa-right-long"></i>
                                    </a>
                                </div>
                            </div>
                        </div>`
                    });
                    document.getElementById("div_main_data").innerHTML = tmpHtml;

                    //Style js
                    $(".bg-top").parent().addClass('b-top');
                    $(".bg-bottom").parent().addClass('b-bottom');
                    $(".bg-center").parent().addClass('b-center');
                    $(".bg_size_content").parent().addClass('b_size_content');
                    $(".bg-img").parent().addClass('bg-size');
                    $(".bg-img.blur-up").parent().addClass('blur-up lazyload');
                    jQuery('.bg-img').each(function () {
                        var el = $(this),
                            src = el.attr('src'),
                            parent = el.parent();
                        parent.css({
                            'background-image': 'url(' + src + ')',
                            'background-size': 'cover',
                            'background-position': 'center',
                            'display': 'block'
                        });
                        el.hide();
                    });
                }
                else {
                    document.getElementById("div_main_data").innerHTML = _imgNotFoundHtml;
                }

                var totalRecord = parseInt(response.data2nd);
                var currentPage = parseInt(data.page);
                var pageSize = parseInt(data.record);
                var pagination = LoadPagination(totalRecord, pageSize, currentPage);
                $('#ul_main_pagination').html(pagination);
            },
            error: function (error) {
                HideOverlay("#div_main_data");
                document.getElementById("div_main_data").innerHTML = ` 
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListMainData();$(this).parent().remove();">
                        </i>
                    </div>`;
                console.log("Error when load list!");
            }
        });
    } catch (e) {
        HideOverlay("#div_main_data");
        document.getElementById("div_main_data").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListMainData();$(this).parent().remove();">
                        </i>
                    </div>`;
        console.log("Error when load list!");
    }
}

//When click pagination 
function ChangePageNews(page, e, elm) {
    e.preventDefault();
    ScrollToTop('.header-news', 70, 500);
    $pageEl.val(page);

    //Change Link
    var newHref = $(elm).attr("href");
    ChangeURLWithOut("", newHref);

    //Get List
    LoadListMainData();
}

//Load Pagination Page
function LoadPagination(totalRecords, pageSize = 12, currentPage) {
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

    if (totalPage > 1) {
        var html = '';
        let link = GetLink();
        if (currentPage > 1) {
            html += `
                <li class="page-item">
                    <a class="page-link" href="${link}record=${pageSize}&page=${currentPage - 1}" title="Trang trước" onclick="ChangePageNews(${currentPage - 1},event,this)"
                    aria-label="Previous">
                        <span aria-hidden="true">
                            <i class="fa fa-chevron-left" aria-hidden="true"></i>
                        </span> 
                        <span class="sr-only">Previous</span>
                    </a>
                </li>`;
        }
        for (var i = startPage; i <= endPage; i++) {
            if (currentPage == i) {
                html += `<li class="page-item active">
                            <a class="page-link">${currentPage}</a>
                        </li>`;
            }
            else {
                html += `<li class="page-item">
                            <a class="page-link" href="${link}record=${pageSize}&page=${i}" onclick="ChangePageNews(${i},event,this)" title="Trang ${i}">${i}</a>
                        </li>`;
            }
        }
        if (currentPage < totalPage) {
            html += `<li class="page-item">
                        <a class="page-link"  href="${link}record=${pageSize}&page=${currentPage + 1}" title="Trang kế tiếp"  onclick="ChangePageNews(${currentPage + 1},event,this)"
                            aria-label="Next">
                            <span aria-hidden="true">
                                <i class="fa fa-chevron-right" aria-hidden="true"></i>
                            </span> 
                            <span class="sr-only">Next</span>
                        </a>
                    </li>`;
        }
        return html;
    }

    else {
        //NoData
        return "";
    }
    $('#ul_main_pagination').html(html);
}

//Get Url Link
function GetLink() {
    var str = window.location.search.substring(1);
    var res = str.split("&");
    var test = res.splice(-2, 2);
    var link = "";
    if (test[0].indexOf("record") > -1 && test[1].indexOf("page") > -1) {
        res.forEach(function (item, index) {
            link += item + "&";
        });
    }
    else {
        if (str == "") {
            link = str;
        }
        else {
            link = str + "&";
        }
    }
    return window.location.pathname + "?" + link;
}

function LoadListNewProductItem() {
    try {
        $.ajax({
            type: 'GET',
            url: '/About/GetListNewProduct',
            dataType: "json",
            success: function (response) {
                if (response.result !== 1) {
                    document.getElementById("div_load_list_news_product").innerHTML = `
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
                        <div class="accordion-body">
                                        <ul class="product-list product-list-2 border-0 p-0">

                                            <li class="mb-0">
                                                <div class="offer-product">
                                                    <a href="/san-pham/${value.nameSlug}-${value.id}" class="offer-image">
                                                        <img data-src="${value.imageObj?.smallUrl}"
                                                             class="blur-up lazyload" alt="${value.name}"
                                                             onerror="this.onerror=null;this.src='/img_dev/error/avatar.png';">
                                                    </a>

                                                    <div class="offer-detail">
                                                        <div>
                                                            <a href="/san-pham/${value.nameSlug}-${value.id}">
                                                                <h6 class="name">${value.name}</h6>
                                                            </a>
                                                              <div class="price-product">${RawListProductPrice(value.productPriceObjs)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>`;
                    });
                    document.getElementById("div_load_list_news_product").innerHTML = tmpHtml;
                    $('#div_load_list_news_product').slick({
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
                    document.getElementById("div_load_list_news_product").innerHTML = `  <div class="d-flex align-items-center flex-column">
                            <img class="w-auto d-flex m-auto" src="/img_dev/error/datanull.jpg" style="width:80px; height:80px;">
                            <span class="text-muted">Không có dữ liệu!</span>
                        </div>`;
                }
            },
            error: function (error) {
                document.getElementById("div_load_list_news_product").innerHTML = `
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

function CalDiscountPrice(num1, num2) {
    return num1 - num2;
}

function CalDiscountPriceRatio(num1, num2) {
    if (num1 == null || num1 === 0) return 0;
    let result = parseInt(num1 * 100 / num2);
    return result > 0 ? result : 1;
}

function RawListProductPrice(priceObj) {
    let html = '';
    if (priceObj == undefined || priceObj == null || priceObj.length === 0) {
        html = `<h5 class="price_normal text-danger">${_textOhterResource.contact}</h5>`;
    } else {
        if (priceObj.length === 1) {
            html = `<div class="${priceObj[0].discount > 0 ? "price_discount" : "price_normal"} price_product_popular text-danger"><del style="color: #8c6f6f;">${priceObj[0].discount > 0 ? FormatToVND(priceObj[0].priceOut) : ""}</del> ${priceObj[0].priceOut === 0 ? _textOhterResource.contact : (priceObj[0].discount > 0 ? FormatToVND(CalDiscountPrice(priceObj[0].priceOut, priceObj[0].discount)) : FormatToVND(priceObj[0].priceOut))}</div>
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