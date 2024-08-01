var $categoryIdEl = $('#input_category_id'),
    $newsIdEl = $('#input_news_id');

const dataParms = function () {
    return {
        newsId: IsNullOrEmty($newsIdEl.val()) ? null : parseInt($newsIdEl.val()),
        c: IsNullOrEmty($categoryIdEl.val()) ? null : parseInt($categoryIdEl.val()),
    }
}



$(document).ready(function () {
    LoadListRelatedNews();
});

//Load list related news
function LoadListRelatedNews() {
    try {
        ShowOverlayLoadingButton("#div_news_related");
        $.ajax({
            type: 'GET',
            url: '/News/GetListRelatedNews',
            data: dataParms(),
            dataType: "json",
            success: function (response) {
                HideOverlayLoadingButton("#div_news_related");
                if (response.result !== 1) {
                    document.getElementById("div_news_related").innerHTML = ` 
                    <div class="text-center p-2" >
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadListRelatedNews();$(this).remove();">
                        </i>
                    </div>`;
                    return;
                }

                var listData = response.data;
                var tmpHtml = '';
                if (listData != null && listData.length > 0) {
                    $.each(listData, function (key, value) {
                        var date = moment(value.createdAt).format('DD-MM-YYYY');
                        tmpHtml +=
                            ` <div>
                                <div class="blog-box new_blog_section">
                                    <div class="blog-box-image">
                                        <a href="/tin-tuc/${value.titleSlug}-${value.id}" class="blog-image">
                                            <img data-src="${IsNullOrEmty(value.imageObj?.mediumUrl) ? "/img_dev/error/product.png" : value.imageObj?.mediumUrl}"
                                            class="bg-img blur-up lazyload w-100 h-100" alt="${value.title}"
                                                 onerror="this.onerror=null;this.src='/img_dev/error/product.png';">
                                        </a>
                                    </div>

                                    <a href="/tin-tuc/${value.titleSlug}-${value.id}" class="blog-detail">
                                        <h6 title="${IsNullOrEmty(value.title) ? "" : value.title}">${value.title}</h6>
                                        <h5>${date}</h5>
                                    </a>
                                </div>
                            </div>`;
                    });
                    document.getElementById("div_news_related").innerHTML = tmpHtml;
                    //Init Slick Js
                    $('#div_news_related').slick({
                        infinite: true,
                        slidesToScroll: 1,
                        slidesToShow: 5,
                        arrows: false,
                        responsive: [{
                            breakpoint: 1500,
                            settings: {
                                slidesToShow: 4,
                            }
                        },
                        {
                            breakpoint: 1215,
                            settings: {
                                slidesToShow: 3,
                            }
                        },
                        {
                            breakpoint: 876,
                            settings: {
                                slidesToShow: 2,
                            }
                        },
                        {
                            breakpoint: 576,
                            settings: {
                                slidesToShow: 1,
                            }
                        },
                        ]
                    });
                }
                else {
                    document.getElementById("div_news_related").innerHTML = _imgNotFoundHtml;
                }
            },
            error: function (error) {
                HideOverlay("#div_news_related");
                $("#new_ishot_js").hide();
                //document.getElementById("div_news_related").innerHTML = ` 
                //    <div class="text-center p-2">
                //        <i type="button" class="fa fa-refresh" 
                //            style="border-radius:4px;font-size:24px;" 
                //            onclick="LoadListRelatedNews();$(this).parent().remove();">
                //        </i>
                //    </div>`;
                console.log("Error when load related news!");
            }
        });
    } catch (e) {
        HideOverlayLoadingButton("#div_news_related");
        document.getElementById("div_news_related").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh" 
                            style="border-radius:4px;font-size:24px;" 
                            onclick="LoadListRelatedNews();$(this).parent().remove();">
                        </i>
                    </div>`;
        console.log("Error when load related news!");
    }
}
