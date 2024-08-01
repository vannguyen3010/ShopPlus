namespace ThreeF_WebPortal.Models
{
    public class M_Carrier
    {
        public int? id { get; set; }
        public string carrierCode { get; set; }
        public string name { get; set; }
        public string nameSlug { get; set; }
        public string imageUrl { get; set; }
        public string remark { get; set; }
        public int? status { get; set; }
        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
        public DateTime? timer { get; set; }
    }
}
