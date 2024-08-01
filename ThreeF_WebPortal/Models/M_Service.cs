namespace ThreeF_WebPortal.Models
{
    public class M_Service
    {
        public int id { get; set; }
        public string name { get; set; }
        public int status { get; set; }
        public int price { get; set; }
        public string description { get; set; }
        public string serviceCode { get; set; }
        public M_PackageService packageServiceObj { get; set; }
    }
}
