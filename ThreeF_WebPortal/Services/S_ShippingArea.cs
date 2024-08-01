using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;
using ThreeF_WebPortal.Models;

namespace ThreeF_WebPortal.Services
{
    public interface IS_ShippingArea
    {
        Task<ResponseData<T>> getListShippingAreaByCountryIdProvinceId<T>(int countryId, int provinceId);
        Task<ResponseData<T>> getListShippingAreaByCountryIdProvinceIdSupplierId<T>(M_ShippingArea model, int countryId, int provinceId, string supplierId);
    }
    public class S_ShippingArea : IS_ShippingArea
    {
        private readonly ICallBaseApi _callApi;
        private readonly IS_Image _s_Image;
        public S_ShippingArea(ICallBaseApi callApi, IS_Image image)
        {
            _callApi = callApi;
            _s_Image = image;
        }

        public async Task<ResponseData<T>> getListShippingAreaByCountryIdProvinceId<T>(int countryId, int provinceId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"countryId", countryId},
                {"provinceId", provinceId}
            };
            return await _callApi.GetResponseDataAsync<T>("ShippingArea/getListShippingAreaByCountryIdProvinceId", dictPars);
        }
        public async Task<ResponseData<T>> getListShippingAreaByCountryIdProvinceIdSupplierId<T>(M_ShippingArea model, int countryId, int provinceId, string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"countryId", countryId},
                {"provinceId", provinceId},
                {"supplierid", supplierId}
            };
            return await _callApi.GetResponseDataAsync<T>("ShippingArea/getListShippingAreaByCountryIdProvinceIdSupplierId", dictPars);
        }
    }
}
