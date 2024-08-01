using System.ComponentModel.DataAnnotations;

namespace ThreeF_WebPortal.Models
{
    public class M_ShippingArea : M_BaseModel.BaseCustom
    {
        public int? id { get; set; }
        public int? countryId { get; set; }
        public int? provinceId { get; set; }
        public string remark { get; set; }
        public M_Country countryObj { get; set; }
        public M_Province provinceObj { get; set; }
        public List<M_ShippingPrice> shippingPriceObj { get; set; }
    }
}
