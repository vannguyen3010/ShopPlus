using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_OrderItem
    {
        Task<ResponseData<T>> DeleteHub<T>(string access_token, string sequenceIdsReasonId, string remark);
    }
    public class S_OrderItem : IS_OrderItem
    {
        private readonly ICallBaseApi _callApi;
        public S_OrderItem(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> DeleteHub<T>(string access_token, string sequenceIdsReasonId, string remark)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"sequenceIdsReasonId", sequenceIdsReasonId},
                {"remark", remark},
            };
            return await _callApi.PostResponseDataAsync<T>("OrderItem/DeleteHub", dictPars);
        }
    }
}
