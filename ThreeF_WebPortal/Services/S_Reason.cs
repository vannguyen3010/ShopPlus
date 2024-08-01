using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_Reason
    {
        Task<ResponseData<T>> getListReason<T>();
        Task<ResponseData<T>> getListReasonByType<T>(int type = 2);
    }
    public class S_Reason : IS_Reason
    {
        private readonly ICallBaseApi _callApi;
        public S_Reason(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> getListReason<T>()
        {
            return await _callApi.GetResponseDataAsync<T>("Reason/getListReason", default(Dictionary<string, dynamic>));
        }
        public async Task<ResponseData<T>> getListReasonByType<T>(int type = 2)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"type", type},
            };
            return await _callApi.GetResponseDataAsync<T>("Reason/getListReasonByType", dictPars);
        }
    }
}
