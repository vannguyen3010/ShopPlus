using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_Payment
    {
        Task<ResponseData<T>> getListPayment<T>();
    }
    public class S_Payment : IS_Payment
    {
        private readonly ICallBaseApi _callApi;
        public S_Payment(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> getListPayment<T>()
        {
            return await _callApi.GetResponseDataAsync<T>("Payment/getListPayment", default(Dictionary<string, dynamic>));
        }
    }
}
