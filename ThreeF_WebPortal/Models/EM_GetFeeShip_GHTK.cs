using System.ComponentModel.DataAnnotations;

namespace ThreeF_WebPortal.Models
{
    public class EM_GetFeeShip_GHTK
    {
        [Required(ErrorMessage = "Số nhà/ngõ/ngách người nhận hàng không được để trống")]
        [StringLength(100, ErrorMessage = "Số nhà/ngõ/ngách người nhận hàng tối đa 100 ký tự!")]
        public string address { get; set; }

        [Required(ErrorMessage = "Tỉnh/thành phố người nhận hàng không được để trống")]
        [StringLength(50, ErrorMessage = "Tỉnh/thành phố người nhận hàng tối đa 50 ký tự!")]
        public string province { get; set; }

        [Required(ErrorMessage = "Quận/huyện người nhận hàng không được để trống")]
        [StringLength(50, ErrorMessage = "Quận/huyện người nhận hàng tối đa 50 ký tự!")]
        public string district { get; set; }

        [StringLength(50, ErrorMessage = "Phường/xã người nhận hàng tối đa 50 ký tự!")]
        public string ward { get; set; }

        [StringLength(50, ErrorMessage = "Phường/xã người nhận hàng tối đa 50 ký tự!")]
        public string street { get; set; }

        [StringLength(50, ErrorMessage = "Phường/xã người nhận hàng tối đa 50 ký tự!")]
        public string hamlet { get; set; }

        [Required(ErrorMessage = "SĐT người liên hệ lấy hàng không được để trống")]
        [StringLength(20, ErrorMessage = "SĐT người liên hệ lấy hàng tối đa 20 ký tự!")]
        public string pick_tel { get; set; }

        [Required(ErrorMessage = "Tên người liên hệ lấy hàng không được để trống")]
        [StringLength(100, ErrorMessage = "Tên người liên hệ lấy hàng tối đa 100 ký tự!")]
        public string pick_name { get; set; }

        public string pick_address_id { get; set; }

        [Required(ErrorMessage = "Số nhà/ngõ/ngách nơi lấy hàng không được để trống")]
        [StringLength(100, ErrorMessage = "Số nhà/ngõ/ngách nơi lấy hàng tối đa 100 ký tự!")]
        public string pick_address { get; set; }

        [Required(ErrorMessage = "Tỉnh/thành phố nơi lấy hàng không được để trống")]
        [StringLength(50, ErrorMessage = "Tỉnh/thành phố nơi lấy hàng tối đa 50 ký tự!")]
        public string pick_province { get; set; }

        [Required(ErrorMessage = "Quận/huyện nơi lấy hàng không được để trống")]
        [StringLength(50, ErrorMessage = "Quận/huyện nơi lấy hàng tối đa 50 ký tự!")]
        public string pick_district { get; set; }

        [StringLength(50, ErrorMessage = "Phường/xã nơi lấy hàng tối đa 50 ký tự!")]
        public string pick_ward { get; set; }

        [StringLength(50, ErrorMessage = "Đường/phố nơi lấy hàng tối đa 50 ký tự!")]
        public string pick_street { get; set; }

        [StringLength(5)]
        public string deliver_option { get; set; } = "none"; //xteam,none

        public int weight { get; set; }

        public int? value { get; set; } //Gram

        [StringLength(4)]
        public string transport { get; set; } //fly,road. This is default transport if actual_transfer_method is not valid

        public string tagsString { get; set; }
        public List<int> tags { get; set; } //1:dễ vỡ | 7:nông sản/thực phẩm khô
    }
}
