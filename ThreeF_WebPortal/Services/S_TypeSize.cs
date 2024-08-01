using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;
using ThreeF_WebPortal.Models;

namespace ThreeF_WebPortal.Services
{
    public interface IS_TypeSize
    {
        Task<ResponseData<List<M_TypeColor>>> getListHubTypeSizeBySupplierIdCategoryId(string supplierId, int? parentId, int? categoryId);
    }
    public class S_TypeSize : IS_TypeSize
    {
        private readonly ICallBaseApi _callApi;
        public S_TypeSize(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<List<M_TypeColor>>> getListHubTypeSizeBySupplierIdCategoryId(string supplierId, int? parentId, int? categoryId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"parentId", parentId},
                {"categoryId", categoryId},
            };
            return await _callApi.GetResponseDataAsync<List<M_TypeColor>>("TypeSize/getListHubTypeSizeBySupplierIdCategoryId", dictPars);
        }
    }
}
