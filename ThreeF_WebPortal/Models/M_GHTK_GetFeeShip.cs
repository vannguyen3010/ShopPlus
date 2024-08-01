namespace ThreeF_WebPortal.Models
{
    public class M_GHTK_GetFeeShip
    {
        public string name { get; set; }
        public int? fee { get; set; }
        public int? ship_fee_only { get; set; }
        public int? insurance_fee { get; set; }
        public string delivery_type { get; set; }
        public string a { get; set; }
        public string dt { get; set; }
        public List<ExtFees> extFees { get; set; }
        public bool? delivery { get; set; }
        public class ExtFees
        {
            public string display { get; set; }
            public string title { get; set; }
            public int? amount { get; set; }
            public string type { get; set; }
        }
    }
}
