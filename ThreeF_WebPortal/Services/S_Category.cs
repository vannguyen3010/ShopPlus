using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;
using ThreeF_WebPortal.Models;

namespace ThreeF_WebPortal.Services
{
    public interface IS_Category
    {
        Task<ResponseData<List<M_Category>>> getListMenu(string supplierId);
        Task<ResponseData<T>> getCategoryByIdStatus<T>(int id);
    }
    public class S_Category : IS_Category
    {
        private readonly ICallBaseApi _callApi;
        public S_Category(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<List<M_Category>>> getListMenu(string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
            };
            return await _callApi.GetResponseDataAsync<List<M_Category>>("Category/getListMenu", dictPars);
        }
        public async Task<ResponseData<T>> getCategoryByIdStatus<T>(int id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"id", id},
            };
            return await _callApi.GetResponseDataAsync<T>("Category/getCategoryByIdStatus", dictPars);
        }
    }
}
