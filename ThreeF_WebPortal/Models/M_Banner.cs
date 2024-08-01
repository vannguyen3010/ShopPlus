using System.Collections.Generic;

namespace ThreeF_WebPortal.Models
{
    public class M_Banner
    {
        public int? id { get; set; }
        public int? supplierId { get; set; }
        public string title { get; set; }
        public string descShort { get; set; }
        public string titleColor { get; set; }
        public string descShortColor { get; set; }
        public string url { get; set; }
        public int? reOrder { get; set; }
        public int? locationId { get; set; }
        public M_Image imageObj { get; set; }
    }
    public class M_BannerLocation
    {
        public int location { get; set; }
        public List<M_Banner> dataObj { get; set; }
    }
    public class VM_Banner
    {
        public int? id { get; set; }
        public string title { get; set; }
        public string descShort { get; set; }
        public string titleColor { get; set; }
        public string descShortColor { get; set; }
        public string url { get; set; }
        public string imageUrl { get; set; }
    }
}