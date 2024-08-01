$(document).ready(function () {

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

});

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
                            <img src="${!IsNullOrEmty(item.imageUrl) ? item.imageUrl : '/img_dev/error/avatar.png'}" onerror="this.onerror=null;this.src='/assets/images/icon/404-error.png';"
                                    class="img-fluid me-2" alt="" />
                            ${!IsNullOrEmty(item.name) ? item.name : ''}
                        </a>
                        ${ulChildProductCategory}
                </li>`;
        });

        //Menu Top New
     /*   res.data.categorys.forEach(function (item) {
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
                    <div class="container>
                      <div class="row" ">
                            <div class="link-section">
                        <a href="/san-pham?c1=${item.id}">
                            <img src="${!IsNullOrEmty(item.imageUrl) ? item.imageUrl : '/assets/images/icon/404-error.png'}" onerror="this.onerror=null;this.src='/assets/images/icon/404-error.png';"
                                    class="img-fluid me-2" alt="" />
                            ${!IsNullOrEmty(item.name) ? item.name : ''}
                        </a>
                        ${ulChildProductCategory}
                         </div>
                      </div>
                    </div>
                </li>`;
        });*/

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
