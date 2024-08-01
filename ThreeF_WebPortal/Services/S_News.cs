using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;
using ThreeF_WebPortal.Models;

namespace ThreeF_WebPortal.Services
{
    public interface IS_News
    {
        Task<ResponseData<List<M_News>>> getListHubNewsByNews(string supplierId, int recordNumber = 10);
        Task<ResponseData<T>> getListHubIntroduceByIsHot<T>(string id, int recordNumber = 10);
        Task<ResponseData<T>> getListHubIntroduce<T>(string supplierId, int recordNumber = 10, int page = 1);
        Task<ResponseData<List<M_News>>> getListHubNews(string supplierId, int recordNumber = 10, int page = 1);
        Task<ResponseData<List<M_News>>> getListHubNewsByCategoryIdReOrder(string supplierId, int? categoryId, int recordNumber = 10, int page = 1);
        Task<ResponseData<T>> getListHubNewsByNewsCategoryId<T>(string supplierId, int? categoryId, int recordNumber = 10);
        Task<ResponseData<List<M_News>>> getListHubIntroduceReOrder(string supplierId, int page, int recordNumber = 20);
        Task<ResponseData<T>> getHubNewsById<T>(int id);

    }
    public class S_News : IS_News
    {
        private readonly ICallBaseApi _callApi;
        public S_News(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<List<M_News>>> getListHubNewsByNews(string supplierId, int recordNumber = 10)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"recordNumber", recordNumber},
            };
            return await _callApi.GetResponseDataAsync<List<M_News>>("News/getListHubNewsByNews", dictPars);
        }
        public async Task<ResponseData<T>> getListHubIntroduceByIsHot<T>(string supplierId, int recordNumber = 10)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"recordNumber", recordNumber},
            };
            return await _callApi.GetResponseDataAsync<T>("News/getListHubIntroduceByIsHot", dictPars);
        }
        public async Task<ResponseData<T>> getListHubIntroduce<T>(string supplierId, int recordNumber = 10, int page = 1)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"recordNumber", recordNumber},
                {"page", page},
            };
            return await _callApi.GetResponseDataAsync<T>("News/getListHubIntroduce", dictPars);
        }
        public async Task<ResponseData<List<M_News>>> getListHubIntroduceReOrder(string supplierId, int recordNumber = 20, int page = 1)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"recordNumber", recordNumber},
                {"page", page},
            };
            return await _callApi.GetResponseDataAsync<List<M_News>>("News/getListHubIntroduceReOrder", dictPars);
        }
        public async Task<ResponseData<List<M_News>>> getListHubNews(string supplierId, int recordNumber = 10, int page = 1)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"recordNumber", recordNumber},
                {"page", page},
            };
            return await _callApi.GetResponseDataAsync<List<M_News>>("News/getListHubNews", dictPars);
        }
        public async Task<ResponseData<List<M_News>>> getListHubNewsByCategoryIdReOrder(string supplierId, int? categoryId, int recordNumber = 10, int page = 1)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"categoryId", categoryId},
                {"recordNumber", recordNumber},
                {"page", page},
            };
            return await _callApi.GetResponseDataAsync<List<M_News>>("News/getListHubNewsByCategoryId", dictPars);
        }
        public async Task<ResponseData<T>> getListHubNewsByNewsCategoryId<T>(string supplierId, int? categoryId, int recordNumber = 10)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"categoryId", categoryId},
                {"recordNumber", recordNumber},
            };
            return await _callApi.GetResponseDataAsync<T>("News/getListHubNewsByNewsCategoryId", dictPars);
        }
        public async Task<ResponseData<T>> getHubNewsById<T>(int id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"id", id},
            };
            return await _callApi.GetResponseDataAsync<T>("News/getHubNewsById", dictPars);
        }
    }
}
