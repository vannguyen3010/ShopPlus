using System.ComponentModel.DataAnnotations;

namespace ThreeF_WebPortal.Models
{
    public class M_ShippingPrice : M_BaseModel.BaseCustom
    {
        public string id { get; set; }
        public int? supplierId { get; set; }
        public int? shippingAreaId { get; set; }
        public int? shippingPolicyId { get; set; }
        public string name { get; set; }
        public string nameSlug { get; set; }
        public int? priceFrom { get; set; }
        public int? priceTo { get; set; }
        public double? weightFrom { get; set; }
        public double? weightTo { get; set; }
        public double? unitId { get; set; }
        public int? totalBill { get; set; }
        public int? feeShip { get; set; }
        public M_ShippingPolicy shippingPolicyObj { get; set; }
        public M_ShippingArea shippingAreaObj { get; set; }
    }
}
