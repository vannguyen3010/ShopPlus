namespace ThreeF_WebPortal.Models
{
    public class M_SupplierProduct
    {
        public int? id { get; set; }
        public int? supplierId { get; set; }
        public int? productId { get; set; }
        public int? categoryId { get; set; }
        public int? price { get; set; }
        public int? discount { get; set; }
        public int? unitId { get; set; }
        public int? tradeMarkId { get; set; }
        public double? viewNumber { get; set; }
    }
}
