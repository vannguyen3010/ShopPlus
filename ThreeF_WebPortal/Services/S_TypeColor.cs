using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_TypeColor
    {
        Task<ResponseData<T>> getListHubTypeColorBySupplierIdCategoryId<T>(string supplierId, int? parentId, int? categoryId);
    }
    public class S_TypeColor : IS_TypeColor
    {
        private readonly ICallBaseApi _callApi;
        public S_TypeColor(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> getListHubTypeColorBySupplierIdCategoryId<T>(string supplierId, int? parentId, int? categoryId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"parentId", parentId},
                {"categoryId", categoryId},
            };
            return await _callApi.GetResponseDataAsync<T>("TypeColor/getListHubTypeColorBySupplierIdCategoryId", dictPars);
        }
    }
}
