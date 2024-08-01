using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_TradeMark
    {
        Task<ResponseData<T>> getListHubTradeMarkBySupplierIdCategoryId<T>(string supplierId, int? parentId, int? categoryId);
    }
    public class S_TradeMark : IS_TradeMark
    {
        private readonly ICallBaseApi _callApi;
        public S_TradeMark(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> getListHubTradeMarkBySupplierIdCategoryId<T>(string supplierId, int? parentId, int? categoryId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"parentId", parentId},
                {"categoryId", categoryId},
            };
            return await _callApi.GetResponseDataAsync<T>("TradeMark/getListHubTradeMarkBySupplierIdCategoryId", dictPars);
        }
    }
}
