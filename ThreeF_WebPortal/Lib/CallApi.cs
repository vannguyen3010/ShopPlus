using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Lib
{
    public interface ICallApi
    {
        Task<ResponseData<T>> GetResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "");
        Task<ResponseData<T>> GetDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>));
        Task<ResponseData<T>> PostResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "");
        Task<ResponseData<T>> PostDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>));
        Task<ResponseData<T>> PutResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "");
        Task<ResponseData<T>> PutDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>));
        Task<ResponseData<T>> DeleteResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "");
        Task<ResponseData<T>> DeleteDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>));
        Task<ResponseData<T>> PostResponseDataAsync<T>(string url, MultipartFormDataContent formData, string accessToken = "");
        Task<ResponseData<T>> PostResponseDataAsync<T>(string url, MultipartFormDataContent formData, Dictionary<string, dynamic> dictHeads);
        Task<ResponseData<T>> PostResponseDataAsync<T>(string url, FormUrlEncodedContent xwwwFormUrlEndcoded, string accessToken = "");
        Task<ResponseData<T>> PutResponseDataAsync<T>(string url, MultipartFormDataContent formData, string accessToken = "");
        Task<ResponseData<T>> PutResponseDataAsync<T>(string url, FormUrlEncodedContent xwwwFormUrlEndcoded, string accessToken = "");
    }
    public class CallApi : ICallApi
    {
        private readonly IBase_CallApi _base_CallApi;
        private const string _factoryName = "custom";

        public CallApi(IBase_CallApi base_CallApi)
        {
            _base_CallApi = base_CallApi;
        }

        public Task<ResponseData<T>> GetDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = null)
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.GetDictHeaderResponseDataAsync<T>(url, dictPars, dictHeads);
        }
        public Task<ResponseData<T>> GetResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "")
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.GetResponseDataAsync<T>(url, dictPars, accessToken);
        }
        public Task<ResponseData<T>> PostDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = null)
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.PostDictHeaderResponseDataAsync<T>(url, dictPars, dictHeads);
        }
        public Task<ResponseData<T>> PostResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "")
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.PostResponseDataAsync<T>(url, dictPars, accessToken);
        }
        public Task<ResponseData<T>> PutDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = null)
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.PutDictHeaderResponseDataAsync<T>(url, dictPars, dictHeads);
        }
        public Task<ResponseData<T>> PutResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "")
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.PutResponseDataAsync<T>(url, dictPars, accessToken);
        }
        public Task<ResponseData<T>> DeleteDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = null)
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.DeleteDictHeaderResponseDataAsync<T>(url, dictPars, dictHeads);
        }
        public Task<ResponseData<T>> DeleteResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "")
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.DeleteResponseDataAsync<T>(url, dictPars, accessToken);
        }
        public Task<ResponseData<T>> PostResponseDataAsync<T>(string url, MultipartFormDataContent formData, Dictionary<string, dynamic> dictHeads)
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.PostResponseDataAsync<T>(url, formData, dictHeads);
        }
        public Task<ResponseData<T>> PostResponseDataAsync<T>(string url, MultipartFormDataContent formData, string accessToken = "")
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.PostResponseDataAsync<T>(url, formData, accessToken);
        }
        public Task<ResponseData<T>> PostResponseDataAsync<T>(string url, FormUrlEncodedContent xwwwFormUrlEndcoded, string accessToken = "")
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.PostResponseDataAsync<T>(url, xwwwFormUrlEndcoded, accessToken);
        }
        public Task<ResponseData<T>> PutResponseDataAsync<T>(string url, MultipartFormDataContent formData, string accessToken = "")
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.PutResponseDataAsync<T>(url, formData, accessToken);
        }
        public Task<ResponseData<T>> PutResponseDataAsync<T>(string url, FormUrlEncodedContent xwwwFormUrlEndcoded, string accessToken = "")
        {
            _base_CallApi._factoryName = _factoryName;
            return _base_CallApi.PostResponseDataAsync<T>(url, xwwwFormUrlEndcoded, accessToken);
        }
    }
}
