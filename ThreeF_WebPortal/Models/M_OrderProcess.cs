namespace ThreeF_WebPortal.Models
{
    public class M_OrderProcess : M_BaseModel.BaseCustom
    {
        public string id { get; set; }
        public string orderId { get; set; }
        public int? processStatus { get; set; }
        public int? reasonId { get; set; }
        public string remark { get; set; }
        public M_Reason reasonObj { get; set; }
    }
}
