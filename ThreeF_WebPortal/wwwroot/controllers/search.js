
$(document).ready(function () {
    $('#input_keyword_product').on("keyup", function () {
        $('#list_product_quick_search').html(" ")
        setTimeout(function () {
            QuickSearchProduct();
        },2000)
    })

  

});

//-------------------
//Init voice search
function QuickSearchProduct() {
    let keyword = $('#input_keyword_product').val().trim()
    try {
        $.ajax({
            type: 'GET',
            url: "/Product/QuickSearch",
            data: {
                keyword: keyword
            },

            dataType: "json",
            success: function (response) {
                if (response.result !== 1) {
                    document.getElementById("list_product_quick_search").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductPopular();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
                    return false;
                }
                let listData = response.data;
                var htmlQuickSearch = ``;
                if (listData != null && listData.length > 0) {
                    for (var i = 0; i < listData.length; i++) {
                        htmlQuickSearch += `
                            <div class="product-item d-flex" style="align-items: center;padding: 10px;">
                                <img data-src="${listData[i].imageObj.smallUrl}" class="img-fluid blur-up lazyload image_css" style="width: 60px;height: 60px;object-fit: cover;border-radius: 28px" alt="${listData[i].name}">
                                <a href="/san-pham/${listData[i].nameSlug}-${listData[i].id}" class="list-group-item" style="flex-grow: 1;border-radius: 15px;font-size: 20px" onclick="onClickProduct(${listData[i].id})">${listData[i].name}</a>
                            </div>
                        `;



                    }
                    $('#list_product_quick_search').html(htmlQuickSearch)

                } else {
                    $('#list_product_quick_search').html(`<p class="text-danger mx-auto pt-2">Không tìm thấy sản phẩm phù hợp!</p>`)
                }
            },
            error: function (error) {
                document.getElementById("list_product_quick_search").innerHTML = `
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
        document.getElementById("list_product_quick_search").innerHTML = `
                    <div class="text-center p-2">
                        <i type="button" class="fa fa-refresh"
                            style="border-radius:4px;font-size:24px;"
                            onclick="LoadProductPopular();ShowOverlayLoadingButton(this);">
                        </i>
                    </div>`;
        console.log("Error when load product popular!");
    }
}