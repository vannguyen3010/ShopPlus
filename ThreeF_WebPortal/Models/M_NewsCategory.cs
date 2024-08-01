namespace ThreeF_WebPortal.Models
{
    public class M_NewsCategory
    {
        public int? id { get; set; }
        public int? parentId { get; set; }
        public string name { get; set; }
        public string nameSlug { get; set; }
    }
}
