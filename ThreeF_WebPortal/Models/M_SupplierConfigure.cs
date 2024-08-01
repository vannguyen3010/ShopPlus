using System;

namespace ThreeF_WebPortal.Models
{
    public class M_SupplierConfigure
    {
        public string id { get; set; }
        public int supplierId { get; set; }
        public DateTime? expirationDate { get; set; }
        public string domainName { get; set; }
        public int? domainType { get; set; }
        public int? isPrivate { get; set; }
        public int? status { get; set; }
    }
}
