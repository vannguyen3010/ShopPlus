using System;
using System.ComponentModel.DataAnnotations;

namespace ThreeF_WebPortal.Models
{
    public class M_DeliveryAddress : M_BaseModel.AddressCustom
    {
        public int? typeId { get; set; }
        public int? customerId { get; set; }
        public int? isDefault { get; set; }
        public string name { get; set; }
        public string phoneNumber { get; set; }
        public DateTime? createdAt { get; set; }
        public int? createdBy { get; set; }
        public DateTime? updatedAt { get; set; }
        public int? updatedBy { get; set; }
        public DateTime? timer { get; set; }
    }
    public class EM_DeliveryAddress : M_BaseModel.BaseCustom
    {
        public int id { get; set; }
        public string customerId { get; set; }
        public string countryId { get; set; } = "1";
        [Required(ErrorMessage = "Vui lòng nhập tỉnh/thành phố")]
        [RegularExpression("(.*[1-9].*)|(.*[.].*[1-9].*)", ErrorMessage = "Vui lòng chọn tỉnh/thành phố")]
        public string provinceId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập quận/huyện")]
        [RegularExpression("(.*[1-9].*)|(.*[.].*[1-9].*)", ErrorMessage = "Vui lòng chọn quận/huyện")]
        public string districtId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập phường/xã")]
        [RegularExpression("(.*[1-9].*)|(.*[.].*[1-9].*)", ErrorMessage = "Vui lòng chọn phường/xã")]
        public string wardId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tên")]
        [StringLength(50, ErrorMessage = "Tên có độ dài tối đa 50 ký tự")]
        public string name { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
        [StringLength(12, ErrorMessage = "Điện thoại có độ dài tối đa 12 ký tự")]
        [RegularExpression("^[0-9]{0,12}$", ErrorMessage = "Điện thoại không hợp lệ!")]
        public string phoneNumber { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập địa chỉ")]
        [StringLength(100, ErrorMessage = "Địa chỉ có độ dài tối đa 100 ký tự")]
        public string addressText { get; set; }
        [StringLength(100, ErrorMessage = "Số nhà có độ dài tối đa 100 ký tự")]
        public string addressNumber { get; set; }
        public double? latitude { get; set; } = 0;
        public double? longitude { get; set; } = 0;
        public bool isAddNew { get; set; } = false;
        public bool isDefault { get; set; } = false;
        public int typeId { get; set; } = 0;
    }
    public class VM_DeliveryAddress
    {
        public int? id { get; set; }
        public int? typeId { get; set; }
        public int? isDefault { get; set; }
        public string name { get; set; }
        public string phoneNumber { get; set; }
        public string addressNumber { get; set; }
        public int countryId { get; set; } = 1;
        public int provinceId { get; set; } = 0;
        public int districtId { get; set; } = 0;
        public int wardId { get; set; } = 0;
        public double? latitude { get; set; }
        public double? longitude { get; set; }
        public string addressText { get; set; }
        public string provinceName { get; set; }
        public string districtName { get; set; }
        public string wardName { get; set; }
    }
}