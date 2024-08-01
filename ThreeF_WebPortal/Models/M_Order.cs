using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ThreeF_WebPortal.Models
{
    public class M_Order : M_BaseModel.BaseCustom
    {
        public string id { get; set; }
        public int? parentId { get; set; }
        public int? supplierId { get; set; }
        public int? customerId { get; set; }
        public DateTime? deliveredAt { get; set; }
        public int? paymentId { get; set; }
        public int? shipmethodId { get; set; }
        public string receiverFullname { get; set; }
        public string receiverPhoneNumber { get; set; }
        public string addressText { get; set; }
        public string remark { get; set; }
        public int? shoppingCartId { get; set; }
        public M_Supplier supplierObj { get; set; }
    }
    public class M_OrderGetList
    {
        public string id { get; set; }
        public int? feeShip { get; set; }
        public DateTime? createdAt { get; set; }
        public List<M_OrderItem> orderItemObjs { get; set; }
        public M_OrderProcess orderProcessObj { get; set; }
    }
    public class M_OrderDetail
    {
        public string id { get; set; }
        public int? status { get; set; }
        public int? feeShip { get; set; }
        public int? carrierId { get; set; }
        public string receiverFullname { get; set; }
        public string receiverPhoneNumber { get; set; }
        public string addressText { get; set; }
        public string remark { get; set; }
        public DateTime? createdAt { get; set; }
        public M_BaseModel.SupplierCustom supplierObj { get; set; }
        public M_SupplierConfigure supplierConfigureObj { get; set; }
        public M_Payment paymentObj { get; set; }
        public M_Shipmethod shipmethodObj { get; set; }
        public List<M_OrderItem> orderItemObj { get; set; }
        public M_OrderProcess orderProcessObj { get; set; }
    }
    public class VM_OrderList
    {
        public string id { get; set; }
        public int processStatus { get; set; }
        public DateTime? createdAt { get; set; }
        public List<VM_OrderItem> orderItem { get; set; }
    }
    public class VM_OrderView
    {
        public string id { get; set; }
        public string receiverFullname { get; set; }
        public string addressText { get; set; }
        public string receiverPhoneNumber { get; set; }
        public string shopId { get; set; }
        public string shopName { get; set; }
        public string shopUrl { get; set; }
        public string paymentMethodId { get; set; }
        public string paymentMethodName { get; set; }
        public string shipMethodName { get; set; }
        public string reasonName { get; set; }
        public int? reasonType { get; set; }
        public int? carrierId { get; set; }
        public string reasonDescription { get; set; }
        public string remark { get; set; }
        public int? feeship { get; set; }
        public int processStatus { get; set; }
        public DateTime? createdAt { get; set; }
        public DateTime? doneAt { get; set; }
        public List<VM_OrderItem> orderItem { get; set; }
    }
    public class VM_OrderItem
    {
        public int id { get; set; }
        public int? productId { get; set; }
        public string productName { get; set; }
        public string productNameSlug { get; set; }
        public string productImage { get; set; }
        public string typeName { get; set; }
        public string sizeName { get; set; }
        public string colorName { get; set; }
        public int price { get; set; } = 0;
        public int discount { get; set; } = 0;
        public int quantity { get; set; } = 0;
        public int processStatus { get; set; }
        public string reasonName { get; set; }
        public int? reasonType { get; set; }
        public string reasonDescription { get; set; }
    }
    public class EM_Order
    {
        public string sequenceShoppingCartItemId { get; set; }
        public int paymentId { get; set; } = 0;
        [StringLength(50, ErrorMessage = "Tên người nhận hàng có độ dài tối đa 50 ký tự")]
        public string receiverFullName { get; set; }
        [StringLength(12, ErrorMessage = "Điện thoại có độ dài tối đa 12 ký tự")]
        public string receiverPhoneNumber { get; set; }
        [StringLength(200, ErrorMessage = "Địa chỉ nhận hàng có độ dài tối đa 200 ký tự")]
        public string addressText { get; set; }
        [StringLength(100, ErrorMessage = "Số nhà/tổ/phu phố có độ dài tối đa 100 ký tự")]
        public string addressIeText { get; set; }
        public int countryId { get; set; } = 1;
        public int provinceId { get; set; } = 0;
        public int districtId { get; set; } = 0;
        public int wardId { get; set; } = 0;
        [StringLength(100, ErrorMessage = "Tên công ty có độ dài tối đa 100 ký tự")]
        public string companyName { get; set; }
        [StringLength(20, ErrorMessage = "Mã số thuế có độ dài tối đa 20 ký tự")]
        public string companyTaxNumber { get; set; }
        [StringLength(150, ErrorMessage = "Địa chỉ công ty có độ dài tối đa 150 ký tự")]
        public string companyAddress { get; set; }
        [StringLength(250, ErrorMessage = "Ghi chú có độ dài tối đa 250 ký tự")]
        public string remark { get; set; }
        public string shippingPriceId { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
        public string productGiftId { get; set; }
        public int? FeeShip { get; set; }
    }
    public class EM_OrderCustom //EM with out login
    {
        public string sequenceProductProductPriceQuantity { get; set; } //id product:id product price:quantity
        public int? paymentId { get; set; } = 0;
        [StringLength(50, ErrorMessage = "Tên người nhận hàng có độ dài tối đa 50 ký tự")]
        public string receiverFullName { get; set; }
        [StringLength(12, ErrorMessage = "Điện thoại có độ dài tối đa 12 ký tự")]
        public string receiverPhoneNumber { get; set; }
        [StringLength(200, ErrorMessage = "Địa chỉ nhận hàng có độ dài tối đa 200 ký tự")]
        public string addressText { get; set; }
        [StringLength(100, ErrorMessage = "Số nhà/tổ/phu phố có độ dài tối đa 100 ký tự")]
        public string addressIeText { get; set; }
        public int? countryId { get; set; } = 1;
        public int? provinceId { get; set; } = 0;
        public int? districtId { get; set; } = 0;
        public int? wardId { get; set; } = 0;
        [StringLength(100, ErrorMessage = "Tên công ty có độ dài tối đa 100 ký tự")]
        public string companyName { get; set; }
        [StringLength(20, ErrorMessage = "Mã số thuế có độ dài tối đa 20 ký tự")]
        public string companyTaxNumber { get; set; }
        [StringLength(150, ErrorMessage = "Địa chỉ công ty có độ dài tối đa 150 ký tự")]
        public string companyAddress { get; set; }
        [StringLength(250, ErrorMessage = "Ghi chú có độ dài tối đa 250 ký tự")]
        public string remark { get; set; }
        public string shippingPriceId { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
        public string productGiftId { get; set; }
    }
}
