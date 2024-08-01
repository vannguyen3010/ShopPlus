using System.Collections.Generic;

namespace ThreeF_WebPortal.Models
{
    public class M_Product
    {
        public int? id { get; set; }
        public int? supplierId { get; set; }
        public string name { get; set; }
        public string nameSlug { get; set; }
        public string productCode { get; set; }
        public string qrCode { get; set; }
        public int? categoryId { get; set; }
        public string summaryInfo { get; set; }
        public string detail { get; set; }
        public string metaTitle { get; set; }
        public string metaKeyword { get; set; }
        public string metaDescription { get; set; }
        public int? price { get; set; }
        public int? discount { get; set; }
        public int? imageId { get; set; }
        public int? tradeMarkId { get; set; }
        public int? viewNumber { get; set; }
        public M_Category categoryObj { get; set; }
        public M_Image imageObj { get; set; }
        public List<M_Image> imageListObj { get; set; }
        public M_TradeMark trademarkObj { get; set; }
        public List<M_ProductPropertyFilter> productPropertyFilterObj { get; set; }
        public List<M_ProductPrice> productPriceObjs { get; set; }
        public List<M_ProductPrice> productPriceObj { get; set; }
    }
    public class VM_ProductList
    {
        public int id { get; set; }
        public string name { get; set; }
        public string categoryName { get; set; }
        public string nameSlug { get; set; }
        public string imageUrl { get; set; }
        public string summaryInfo { get; set; }
        public int price { get; set; } = 0;
        public int discount { get; set; } = 0;
        public List<M_ProductPrice> productPriceObjs { get; set; }
    }
    public class VM_ProductDetail
    {
        public int id { get; set; }
        public int supplierId { get; set; }
        public string qrCode { get; set; }
        public string name { get; set; }
        public string nameSlug { get; set; }
        public int? categoryId { get; set; } = 0;
        public int? categoryParentId { get; set; } = 0;
        public string categoryName { get; set; } = "";
        public string categoryParentName { get; set; } = "";
        public int price { get; set; } = 0;
        public int discount { get; set; } = 0;
        public string summaryInfo { get; set; }
        public string detail { get; set; }
        public int? tradeMarkId { get; set; }
        public int? unitId { get; set; }
        public string tradeMarkName { get; set; }
        public string unitName { get; set; }
        public double? viewNumber { get; set; }
        public M_Image imageObj { get; set; }
        public List<M_Image> imageListObj { get; set; }
        public M_TradeMark trademarkObj { get; set; }
        public List<M_ProductPropertyFilter> productPropertyFilterObj { get; set; }
        public List<M_ProductPrice> productPriceObjs { get; set; }
    }
    public class VM_CheckoutCreateOrder
    {
        public string id { get; set; }
        public string supplierId { get; set; }
    }
}
