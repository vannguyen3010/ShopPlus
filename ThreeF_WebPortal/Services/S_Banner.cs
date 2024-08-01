using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;

namespace ThreeF_WebPortal.Services
{
    public interface IS_Banner
    {
        Task<ResponseData<List<M_Banner>>> getListHubBannerByLocationIdPageName(string supplierId, string pageName, int locationId = 0, int recordNumber = 10);
        Task<ResponseData<List<M_BannerLocation>>> getListHubBannerByCondition(string supplierId, string pageName, string sequenceLocationId, string sequenceRecordNumber);
    }
    public class S_Banner : IS_Banner
    {
        private readonly ICallBaseApi _callApi;
        public S_Banner(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<List<M_Banner>>> getListHubBannerByLocationIdPageName(string supplierId, string pageName, int locationId = 0, int recordNumber = 10)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"pageName", pageName},
                {"locationId", locationId},
                {"recordNumber", recordNumber},
            };
            return await _callApi.GetResponseDataAsync<List<M_Banner>>("Banner/getListHubBannerByLocationIdPageName", dictPars);
        }
        public async Task<ResponseData<List<M_BannerLocation>>> getListHubBannerByCondition(string supplierId, string pageName, string sequenceLocationId, string sequenceRecordNumber)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
                {"pageName", pageName},
                {"sequenceLocationId", sequenceLocationId},
                {"sequenceRecordNumber", sequenceRecordNumber},
            };
            return await _callApi.GetResponseDataAsync<List<M_BannerLocation>>("Banner/getListHubBannerByCondition", dictPars);
        }
    }
}