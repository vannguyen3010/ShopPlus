using System.ComponentModel.DataAnnotations;

namespace ThreeF_WebPortal.Models
{
    public class M_ShippingPolicy : M_BaseModel.BaseCustom
    {
        public int? id { get; set; }
        public string name { get; set; }
        public string nameSlug { get; set; }
        public int? isDefault { get; set; }
        public string remark { get; set; }
    }
}
