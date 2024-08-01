using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;
using ThreeF_WebPortal.Models;

namespace ThreeF_WebPortal.Services
{
    public interface IS_Product
    {
        Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdCategoryIdPageSizePage(string supplierId, int categoryId, int recordNumber = 10, int page = 1);
        Task<ResponseData<List<M_Product>>> getListProductRelatedByCategoryId(int categoryId, int recordNumber = 10);
        Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdProductNews(string supplierId, int recordNumber = 10, int page = 1);
        Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdProductDiscount(string supplierId, int recordNumber = 10);
        Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdProductHighlights(string supplierId, int recordNumber = 10);
        Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdProductSelling(string supplierId, int recordNumber = 10);
        Task<ResponseData<T>> getListHubProductBySupplierIdProductCondition<T>(string supplierId, string name, int? categoryId, string sequenceSize, string sequenceColor, string sequenceIsTradeMark, int? fprice, int? tprice, int type, int recordNumber = 10, int page = 1);
        Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdProductConditionSecond(string supplierId, string name, int? categoryId, string sequenceIsTradeMark, string sequencePropertyFilter0, string sequencePropertyFilter1, string sequencePropertyFilter2, string sequencePropertyFilter3, int? fprice, int? tprice, int type, int recordNumber, int page = 1);
        //Task<ResponseData<T>> getListHubProductBySupplierIdProductHighlights<T>(string supplierId, int id, int recordNumber = 10);
        Task<ResponseData<T>> getHubProductByIdSupplierId<T>(string supplierId, int id);
        Task<ResponseData<M_Product>> getHubProductById(int id);
    }
    public class S_Product : IS_Product
    {
        private readonly ICallBaseApi _callApi;
        public S_Product(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        //Get list product by category lv2
        public async Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdCategoryIdPageSizePage(string supplierId, int categoryId, int recordNumber = 10, int page = 1)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"categoryId", categoryId},
                {"page", page},
                {"recordNumber", recordNumber},
            };
            return await _callApi.GetResponseDataAsync<List<M_Product>>("Product/getListHubProductBySupplierIdCategoryIdPageSizePage", dictPars);
        }
        //Get list Product Related Category Id
        public async Task<ResponseData<List<M_Product>>> getListProductRelatedByCategoryId(int categoryId, int recordNumber = 10)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"categoryId", categoryId},
                {"recordNumber", recordNumber},
            };
            return await _callApi.GetResponseDataAsync<List<M_Product>>("Product/getListProductRelatedByCategoryId", dictPars);
        }

        //Get list new product
        public async Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdProductNews(string supplierId, int recordNumber = 10, int page = 1)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"page", page},
                {"recordNumber", recordNumber},
            };
            return await _callApi.GetResponseDataAsync<List<M_Product>>("Product/getListHubProductBySupplierIdProductNews", dictPars);
        }

        //Get list discount product
        public async Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdProductDiscount(string supplierId, int recordNumber = 10)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"recordNumber", recordNumber},
            };
            return await _callApi.GetResponseDataAsync<List<M_Product>>("Product/getListHubProductBySupplierIdProductDiscount", dictPars);
        }

        //Get list popular product
        public async Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdProductHighlights(string supplierId, int recordNumber = 10)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"recordNumber", recordNumber},
            };
            return await _callApi.GetResponseDataAsync<List<M_Product>>("Product/getListHubProductBySupplierIdProductHighlights", dictPars);
        }

        //Get list feature product
        public async Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdProductSelling(string supplierId, int recordNumber = 10)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"recordNumber", recordNumber},
            };
            return await _callApi.GetResponseDataAsync<List<M_Product>>("Product/getListHubProductBySupplierIdProductSelling", dictPars);
        }

        //Get list product by multiple condition search
        public async Task<ResponseData<T>> getListHubProductBySupplierIdProductCondition<T>(string supplierId, string name, int? categoryId, string sequenceSize, string sequenceColor, string sequenceIsTradeMark, int? fprice, int? tprice, int type, int recordNumber = 10, int page = 1)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"name", name},
                {"categoryId", categoryId},
                {"sequenceSize", sequenceSize},
                {"sequenceColor", sequenceColor},
                {"sequenceIsTradeMark", sequenceIsTradeMark},
                {"fprice", fprice},
                {"tprice", tprice},
                {"type", type},
                {"recordNumber", recordNumber},
                {"page", page},
            };
            return await _callApi.GetResponseDataAsync<T>("Product/getListHubProductBySupplierIdProductCondition", dictPars);
        }

        //Get list product by multiple condition search by supplierId
        public async Task<ResponseData<List<M_Product>>> getListHubProductBySupplierIdProductConditionSecond(string supplierId, string name, int? categoryId, string sequenceIsTradeMark, string sequencePropertyFilter0, string sequencePropertyFilter1, string sequencePropertyFilter2, string sequencePropertyFilter3, int? fprice, int? tprice, int type, int recordNumber = 10, int page = 1)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"name", name},
                {"categoryId", categoryId},
                {"sequencePropertyFilter0", sequencePropertyFilter0},
                {"sequencePropertyFilter1", sequencePropertyFilter1},
                {"sequencePropertyFilter2", sequencePropertyFilter2},
                {"sequencePropertyFilter3", sequencePropertyFilter3},
                {"sequenceIsTradeMark", sequenceIsTradeMark},
                {"fprice", fprice},
                {"tprice", tprice},
                {"type", type},
                {"recordNumber", recordNumber},
                {"page", page},
            };
            return await _callApi.GetResponseDataAsync<List<M_Product>>("Product/getListHubProductBySupplierIdProductConditionSecond", dictPars);
        }

        //Get list relation product
        //public async Task<ResponseData<T>> getListHubProductBySupplierIdProductHighlights<T>(string supplierId, int id, int recordNumber = 10)
        //{
        //    Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
        //    {
        //        {"supplierId", supplierId},
        //        {"id", id},
        //        {"recordNumber", recordNumber},
        //    };
        //    return await _callApi.GetResponseDataAsync<T>("Product/getHubProductByIdSupplierIdProductRelation", dictPars);
        //}

        //Get detail product
        public async Task<ResponseData<T>> getHubProductByIdSupplierId<T>(string supplierId, int id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"id", id},
            };
            return await _callApi.GetResponseDataAsync<T>("Product/getHubProductByIdSupplierId", dictPars);
        }
        public async Task<ResponseData<M_Product>> getHubProductById(int id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"id", id},
            };
            return await _callApi.GetResponseDataAsync<M_Product>("Product/getHubProductById", dictPars);
        }
    }
}
