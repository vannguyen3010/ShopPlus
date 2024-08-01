using System.Collections.Generic;

namespace ThreeF_WebPortal.Models
{
    public class M_Category
    {
        public int? id { get; set; }
        public int? parentId { get; set; }
        public string name { get; set; }
        public string nameSlug { get; set; }
        public string categoryCode { get; set; }
        public string remark { get; set; }
        public M_Image imageObj { get; set; }
        public M_CategoryParent parentObj { get; set; }
        public List<M_Category> childMenu { get; set; }
    }
    public class M_CategoryParent
    {
        public int? id { get; set; }
        public string name { get; set; }
        public string nameSlug { get; set; }
    }
}
