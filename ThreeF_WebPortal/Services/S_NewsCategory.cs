using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;
using ThreeF_WebPortal.Models;

namespace ThreeF_WebPortal.Services
{
    public interface IS_NewsCategory
    {
        Task<ResponseData<List<M_NewsCategory>>> getListHubNewsCategoryBySupplierId(string supplierId);
        Task<ResponseData<List<M_NewsCategory>>> getListHubNewsCategoryByIntroduceSupplierId(string supplierId);
        Task<ResponseData<T>> getHubNewsCategoryById<T>(int id);
    }
    public class S_NewsCategory : IS_NewsCategory
    {
        private readonly ICallBaseApi _callApi;
        public S_NewsCategory(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<List<M_NewsCategory>>> getListHubNewsCategoryBySupplierId(string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
            };
            return await _callApi.GetResponseDataAsync<List<M_NewsCategory>>("NewsCategory/getListHubNewsCategoryBySupplierId", dictPars);
        }
        public async Task<ResponseData<List<M_NewsCategory>>> getListHubNewsCategoryByIntroduceSupplierId(string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
            };
            return await _callApi.GetResponseDataAsync<List<M_NewsCategory>>("NewsCategory/getListHubNewsCategoryByIntroduceSupplierId", dictPars);
        }
        public async Task<ResponseData<T>> getHubNewsCategoryById<T>(int id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"id", id},
            };
            return await _callApi.GetResponseDataAsync<T>("NewsCategory/getHubNewsCategoryById", dictPars);
        }
    }
}
