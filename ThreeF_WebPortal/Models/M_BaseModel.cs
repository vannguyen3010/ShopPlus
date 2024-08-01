using System;

namespace ThreeF_WebPortal.Models
{
    public class M_BaseModel
    {
        public class BaseCustom
        {
            public int? status { get; set; }
            public DateTime? createdAt { get; set; }
            public int? createdBy { get; set; }
            public DateTime? updatedAt { get; set; }
            public int? updatedBy { get; set; }
            public DateTime? timer { get; set; }
        }
        public class ImageCustom
        {
            public int? id { get; set; }
            public int? serialId { get; set; }
            public string name { get; set; }
            public string description { get; set; }
            public string relativeUrl { get; set; }
            public string smallUrl { get; set; }
            public string mediumUrl { get; set; }
        }
        public class SupplierCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string refCode { get; set; }
        }
        public class PersonCustom
        {
            public int? id { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
        }
        public class IdentityCardCustom
        {
            public int? id { get; set; }
            public string number { get; set; }
        }
        public class AddressCustom
        {
            public int? id { get; set; }
            public int? countryId { get; set; }
            public int? provinceId { get; set; }
            public int? districtId { get; set; }
            public int? wardId { get; set; }
            public string addressNumber { get; set; }
            public string addressText { get; set; }
            public double? latitude { get; set; }
            public double? longitude { get; set; }
            public int? status { get; set; }
            public CountryCustom countryObj { get; set; }
            public ProvinceCustom provinceObj { get; set; }
            public DistrictCustom districtObj { get; set; }
            public WardCustom wardObj { get; set; }
        }
        public class CountryCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string countryCode { get; set; }
        }
        public class ProvinceCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string htmlProvince { get; set; }

        }
        public class DistrictCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string htmlDistrict { get; set; }
        }
        public class WardCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string htmlWard { get; set; }
        }
        public class TelephoneCustom
        {
            public int? id { get; set; }
            public string phoneNumber { get; set; }
        }
        public class UnitCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string unitCode { get; set; }
        }
        public class PackingFormCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
        }
        public class PositionCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string positionCode { get; set; }
        }
        public class DepartmentCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string departmentCode { get; set; }
        }
        public class CertificateCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string code { get; set; }
        }
        public class DegreeCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string degreeCode { get; set; }
        }
        public class ReligionCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
        }
        public class FolkCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
        }
        public class BusinessTypeCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string businessTypeCode { get; set; }
        }
        public class BusinessTypeModelCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string businessTypeModelCode { get; set; }
        }
        public class ProductCustom
        {
            public int? id { get; set; }
            public string name { get; set; }
            public string nameSlug { get; set; }
        }
    }
}
