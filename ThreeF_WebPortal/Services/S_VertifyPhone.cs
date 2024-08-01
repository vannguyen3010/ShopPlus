using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_VertifyPhone
    {
        Task<ResponseData<T>> VertifyPhone<T>(string id, string activeCode, string phoneNumber);
        Task<ResponseData<T>> ResendCode<T>(string id);
    }
    public class S_VertifyPhone : IS_VertifyPhone
    {
        private readonly ICallBaseApi _callApi;
        public S_VertifyPhone(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> VertifyPhone<T>(string id, string activeCode, string phoneNumber)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"id", id},
                {"activeCode", activeCode},
                {"phoneNumber", phoneNumber},
            };
            return await _callApi.PostResponseDataAsync<T>("VertifyPhone/VertifyPhone", dictPars);
        }
        public async Task<ResponseData<T>> ResendCode<T>(string id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"id", id},
            };
            return await _callApi.PostResponseDataAsync<T>("VertifyPhone/ResendCode", dictPars);
        }
    }
}
