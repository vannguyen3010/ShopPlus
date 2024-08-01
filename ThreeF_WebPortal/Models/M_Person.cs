using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static ThreeF_WebPortal.ExtensionMethods.ValidationAttribute;

namespace ThreeF_WebPortal.Models
{
    public class M_Person
    {
        public int? id { get; set; }
        public M_Supplier supplierObj { get; set; }
        public string personType { get; set; }
        public string qrCode { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string firstNameSlug { get; set; }
        public string lastNameSlug { get; set; }
        public DateTime? birthday { get; set; }
        public int? gender { get; set; }
        public string email { get; set; }
        public int? addressId { get; set; }
        public string addressList { get; set; }
        public int? imageId { get; set; }
        public int? imageSerialId { get; set; }
        public M_Image imageObj { get; set; }
        public M_Telephone telephoneObj { get; set; }
        public M_Address addressObj { get; set; }
        public List<M_DeliveryAddress> deliveryAddressObj { get; set; }
        public M_Account accountObj { get; set; }
    }
    public class EM_Person : M_BaseModel.BaseCustom
    {
        public string id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập họ")]
        [StringLength(30, ErrorMessage = "Họ có độ dài tối đa 30 ký tự")]
        public string firstName { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tên")]
        [StringLength(30, ErrorMessage = "Tên có độ dài tối đa 30 ký tự")]
        public string lastName { get; set; }
        [DataType(DataType.Date, ErrorMessage = "Ngày sinh không hợp lệ!")]
        public DateTime? birthday { get; set; }
        public int gender { get; set; }
        [StringLength(50, ErrorMessage = "Email có độ dài tối đa 50 ký tự")]
        [RegularExpression(@"^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$", ErrorMessage = "Email không hợp lệ!")]
        public string email { get; set; }
        public int? imageId { get; set; }
        public int? imageSerialId { get; set; }
        [DataType(DataType.Upload)]
        [MaxFileSize(maxFileSize: Lib.CommonConstants.MAX_FILE_SIZE_IMAGE_UPLOAD * 1024 * 1024, errorMessage: "Dung lượng ảnh tối đa 5MB!")]
        [AllowedExtensions(extensions: new string[] { ".jpg", ".jpeg", ".png" }, errorMessage: "Ảnh không hợp lệ!")]
        public IFormFile imageFile { get; set; }
        public string imageUrl { get; set; }
    }
}
