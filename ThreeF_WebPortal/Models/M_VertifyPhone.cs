namespace ThreeF_WebPortal.Models
{
    public class M_VertifyPhone : M_BaseModel.BaseCustom
    {
        public int? id { get; set; }
        public int? activeId { get; set; }
        public string activeCode { get; set; }
        public int? timesLimitFail { get; set; }
        public int? timesFail { get; set; }
        public string phoneNumber { get; set; }
        public int? vertifyType { get; set; }
    }
}
