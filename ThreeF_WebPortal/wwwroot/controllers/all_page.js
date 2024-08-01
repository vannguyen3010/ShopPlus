var myData = JSON.parse(localStorage.getItem('listCartLocalStorage'));
$(document).ready(function () {

    if (ISLOGIN) {
        CountShoppingCartItem();
    } else {
        $('#cart_item_count').hide();
    }
  
    $('#div_product_discount_discount').click(function () {
        if (window.location.pathname === '/') {
            window.location.href = '#div_product_discount';
        } else {
            window.location.href = '/#div_product_discount';
        }
    })
    //close search productISLOGIN
    $('#btn_close_sigout_modal').click(function () {
        $('#modal_signout').fadeOut(100);
        $(".modal-backdrop").removeClass("show");
    })
    //search order
    // Hiển thị modal khi click vào nút "show"
    $("#showButton").on("click", function () {
        $(".modal").fadeIn();
    });

    // Ẩn modal khi click vào nút đóng hoặc bên ngoài modal
    $(".close-button, .modal").on("click", function () {
        $(".modal").fadeOut();
    });

    // Ngăn sự kiện click trong modal lan ra ngoài modal
    $(".modal-content").on("click", function (event) {
        event.stopPropagation();
    });

    //$('.slider_banner_mid').slick({
    //    dots: true,
    //    infinite: true,
    //    speed: 1200,
    //    cssEase: 'linear',
    //    slidesToShow: 1,
    //    autoplay: 5000,
    //    fade: true,
    //    slidesToScroll: 1,
    //    responsive: [
    //        {
    //            breakpoint: 1024,
    //            settings: {
    //                slidesToShow: 1,
    //                slidesToScroll: 1,
    //                infinite: true,
    //                dots: false
    //            }
    //        },
    //        {
    //            breakpoint: 600,
    //            settings: {
    //                slidesToShow: 1,
    //                slidesToScroll: 1
    //            }
    //        },
    //        {
    //            breakpoint: 480,
    //            settings: {
    //                slidesToShow: 1,
    //                slidesToScroll: 1,
    //                prevArrow: false,
    //                nextArrow: false,
    //            }
    //        }
    //    ]
    //});
    $('.slider_banner_mid_heder').slick({
        dots: false,
        infinite: true,
        speed: 1200,
        cssEase: 'linear',
        fade: true,
        slidesToShow: 1,
        autoplay: 5000,
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
          
        //]
    });
    $('.slider_banner_top').slick({
        dots: false,
        infinite: true,
        speed: 500,
        cssEase: 'linear',
        fade: true,
        slidesToShow: 1,
        autoplay: 5000,
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

        //]
    });
});

//Check data list cart

function CountShoppingCartItem() {
    $.ajax({
        type: 'GET',
        url: '/Checkout/CountShoppingCartItem',
        dataType: 'json',
        success: function (response) {
            if (response.result === 1) {
                if (response.data === 0) {
                    $('#cart_item_count').text(0).fadeOut(100);
                } else if (response.data > 0 && response.data < 10) {
                    $('#cart_item_count').text(response.data).fadeIn(100);
                } else {
                    $('#cart_item_count').text('9+').fadeIn(100);
                }
            } else {
                // Ẩn kết quả khi không có dữ liệu
                $('#cart_item_count').fadeOut(100);
            }
        },
        //error: function () {
        //    console.log('Error when counting shopping cart items');
        //}
    });
}
//function countShoppingCartWithoutLogin() {
//    var myData = JSON.parse(localStorage.getItem('listCartLocalStorage'));
//    if (myData != null) {
//        const count = myData.length;
//        if (count === 0) {
//            $('.cart_item_count').text(0).fadeOut(100);
//        } else if (count > 0 && count < 10) {
//            $('.cart_item_count').text(count).fadeIn(100);
//        } else {
//            $('.cart_item_count').text('9+').fadeIn(100);
//        }
//    } else {
//        $('.cart_item_count').text(0).fadeOut(100);
//    }
//}


