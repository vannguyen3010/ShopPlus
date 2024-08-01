using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_Address
    {
        Task<ResponseData<T>> getListCountry<T>();
        Task<ResponseData<T>> getListProvinceByCountryId<T>(string countryId = "0");
        Task<ResponseData<T>> getListDistrictByProvinceId<T>(string countryId = "0");
        Task<ResponseData<T>> getListWardByDisctrictId<T>(string countryId = "0");
    }
    public class S_Address : IS_Address
    {
        private readonly ICallBaseApi _callApi;
        public S_Address(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> getListCountry<T>()
        {
            return await _callApi.GetResponseDataAsync<T>("Country/getListCountry", default(Dictionary<string, dynamic>));
        }
        public async Task<ResponseData<T>> getListProvinceByCountryId<T>(string countryId = "1")
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"countryId", countryId},
            };
            return await _callApi.GetResponseDataAsync<T>("Province/getListProvinceByCountryId", dictPars);
        }
        public async Task<ResponseData<T>> getListDistrictByProvinceId<T>(string provinceId = "0")
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"provinceId", provinceId},
            };
            return await _callApi.GetResponseDataAsync<T>("District/getListDistrictByProvinceId", dictPars);
        }
        public async Task<ResponseData<T>> getListWardByDisctrictId<T>(string districtId = "0")
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"districtId", districtId},
            };
            return await _callApi.GetResponseDataAsync<T>("Ward/getListWardByDisctrictId", dictPars);
        }
    }
}
