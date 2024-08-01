namespace ThreeF_WebPortal.Models
{
    public class M_ProductPrice
    {
        public int? id { get; set; }
        public int? productId { get; set; }
        public int? unitId { get; set; }
        public int? priceOut { get; set; }
        public int? discount { get; set; }
        public int? isWarehouse { get; set; }
        public long? quantity { get; set; }
        public double? weight { get; set; }
        public string typeName { get; set; }
        public int? status { get; set; }
        //public M_Unit unitObj { get; set; }
    }
}
