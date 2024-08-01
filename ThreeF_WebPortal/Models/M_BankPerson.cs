namespace ThreeF_WebPortal.Models
{
    public class M_BankPerson
    {
        public int? id { get; set; }
        public string nameCard { get; set; }
        public string number { get; set; }
        public string bankId { get; set; }
        public string personId { get; set; }
        public M_Bank bankObj { get; set; }
        public M_Person personObj { get; set; }
    }
}
