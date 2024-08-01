using System.Collections.Generic;

namespace ThreeF_WebPortal.Models
{
    public class M_Supplier
    {
        public int id { get; set; }
        public string qrIdentityCode { get; set; }
        public string supplierType { get; set; }
        public string name { get; set; }
        public string nameEn { get; set; }
        public string refCode { get; set; }
        public string token { get; set; }
        public string contactName { get; set; }
        public string description { get; set; }
        public string taxNumber { get; set; }
        public string accountNumber { get; set; }
        public string email { get; set; }
        public string hotlineNumber { get; set; }
        public string telephoneNumber { get; set; }
        public string fax { get; set; }
        //public string postCode { get; set; }
        //public string siteUrl { get; set; }
        public string facebook { get; set; }
        public M_Carrier carrierObj { get; set; }
        public string twitter { get; set; }
        public string instagram { get; set; }
        public string youtube { get; set; }
        public string tiktokUrl { get; set; }
        public string zalo { get; set; }
        public string imageFavicon { get; set; }
        public string ministryUrl { get; set; }
        public int? supplierCarrierId { get; set; }
        public M_Supplier supplierCarrierObj { get; set; }
        public string roleFileUrl { get; set; }
        public string securityFileUrl { get; set; }
        public string operatingRegulationUrl { get; set; }
        public M_Image imageObj { get; set; }
        public List<M_Image> imageListObj { get; set; }
        public M_Address addressObj { get; set; }
        public M_SupplierConfigure supplierConfigureObj { get; set; }
        public string refundPolicyUrl { get; set; }

        public string shippingPolicyUrl { get; set; }
        public M_SupplierService supplierServiceObj { get; set; }
    }
    public class VM_Supplier
    {
        public string id { get; set; }
        public string url { get; set; }
        public string refCode { get; set; }
        public string name { get; set; }
        public string nameEn { get; set; }
        public string contactName { get; set; }
        public string description { get; set; }
        public string taxNumber { get; set; }
        public string fax { get; set; }
        public string email { get; set; }
        public string hotlineNumber { get; set; }
        public string telephoneNumber { get; set; }
        //public string postCode { get; set; }
        //public string siteUrl { get; set; }
        public string facebook { get; set; }
        public string twitter { get; set; }
        public string instagram { get; set; }
        public string youtube { get; set; }
        public string tiktokUrl { get; set; }
        public string zalo { get; set; }
        public string imageLogo { get; set; }
        public string imageFavicon { get; set; }
        public string ministryUrl { get; set; }
        public string roleFileUrl { get; set; }
        public string securityFileUrl { get; set; }
        public string operatingRegulationUrl { get; set; }
        public string countryName { get; set; }
        public string provinceName { get; set; }
        public string districtName { get; set; }
        public string wardName { get; set; }
        public string addressNumber { get; set; }
        public string addressText { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
    }
}
