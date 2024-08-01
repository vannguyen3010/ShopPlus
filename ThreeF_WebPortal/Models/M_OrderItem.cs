namespace ThreeF_WebPortal.Models
{
    public class M_OrderItem
    {
        public int? id { get; set; }
        public int? quantity { get; set; }
        public int? price { get; set; }
        public int? discount { get; set; }
        public int? processStatus { get; set; }
        public int? productPriceId { get; set; }
        public int? reasonId { get; set; }
        public string remark { get; set; }
        public M_BaseModel.ProductCustom productObj { get; set; }
        public M_Image imageObj { get; set; }
        public M_TypeColor typeColorObj { get; set; }
        public M_TypeSize typeSizeObj { get; set; }
        public M_Reason reasonObj { get; set; }
        public M_ProductPrice productPriceObj { get; set; }
    }
    public class M_OrderItemDeleteHub : M_BaseModel
    {
        public int? id { get; set; }
        public string orderId { get; set; }
        public int? supplierProductId { get; set; }
        public int? supplierId { get; set; }
        public int? productId { get; set; }
        public int? quantity { get; set; }
        public int? price { get; set; }
        public int? discount { get; set; }
        public int? processStatus { get; set; }
        public int? typeSizeId { get; set; }
        public int? typeColorId { get; set; }
        public int? isBigshop { get; set; }
        public int? reasonId { get; set; }
        public string remark { get; set; }
    }
}
