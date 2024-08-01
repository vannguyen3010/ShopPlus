using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Lib
{
    public interface ICallExternalApi
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
        Task<ResponseData<T>> PostResponseDataAsync<T>(string url, FormUrlEncodedContent xwwwFormUrlEndcoded, string accessToken = "");
        Task<ResponseData<T>> PutResponseDataAsync<T>(string url, MultipartFormDataContent formData, string accessToken = "");
        Task<ResponseData<T>> PutResponseDataAsync<T>(string url, FormUrlEncodedContent xwwwFormUrlEndcoded, string accessToken = "");
    }
    public class CallExternalApi : ICallExternalApi
    {
        private const string _factoryName = "custom";
        private readonly IHttpClientFactory _factory;
        public CallExternalApi(IHttpClientFactory factory)
        {
            _factory = factory ?? throw new ArgumentNullException(nameof(factory));
        }

        public async Task<ResponseData<T>> GetResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "")
        {
            ResponseData<T> res = new();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (!string.IsNullOrEmpty(accessToken))
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                int i = 0;
                string param = "?";
                if (dictPars != null)
                    foreach (KeyValuePair<string, dynamic> item in dictPars)
                    {
                        param += (i == 0 ? "" : "&") + string.Format("{0}={1}", item.Key, item.Value == null ? "" : item.Value.ToString());
                        i++;
                    }
                var response = await client.GetAsync(url + param);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }
        }
        public async Task<ResponseData<T>> GetDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>))
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (dictHeads != null)
                    foreach (KeyValuePair<string, dynamic> item in dictHeads)
                        client.DefaultRequestHeaders.Add(item.Key, item.Value == null ? "" : item.Value.ToString());
                int i = 0;
                string param = "?";
                if (dictPars != null)
                    foreach (KeyValuePair<string, dynamic> item in dictPars)
                    {
                        param += (i == 0 ? "" : "&") + string.Format("{0}={1}", item.Key, item.Value == null ? "" : item.Value.ToString());
                        i++;
                    }
                var response = await client.GetAsync(url + param);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }
        }
        public async Task<ResponseData<T>> PostResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "")
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (!string.IsNullOrEmpty(accessToken))
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                MultipartFormDataContent formData = new MultipartFormDataContent();
                if (dictPars != null)
                    foreach (KeyValuePair<string, dynamic> item in dictPars)
                        formData.Add(new StringContent(item.Value == null ? "" : item.Value.ToString()), item.Key);

                var response = await client.PostAsync(url, formData);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }
        }
        public async Task<ResponseData<T>> PostDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>))
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (dictHeads != null)
                    foreach (KeyValuePair<string, dynamic> item in dictHeads)
                        client.DefaultRequestHeaders.Add(item.Key, item.Value == null ? "" : item.Value.ToString());
                MultipartFormDataContent formData = new MultipartFormDataContent();
                if (dictPars != null)
                    foreach (KeyValuePair<string, dynamic> item in dictPars)
                        formData.Add(new StringContent(item.Value == null ? "" : item.Value.ToString()), item.Key);

                var response = await client.PostAsync(url, formData);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }
        }
        public async Task<ResponseData<T>> PutResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "")
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (!string.IsNullOrEmpty(accessToken))
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                MultipartFormDataContent formData = new MultipartFormDataContent();
                if (dictPars != null)
                    foreach (KeyValuePair<string, dynamic> item in dictPars)
                        formData.Add(new StringContent(item.Value == null ? "" : item.Value.ToString()), item.Key);

                var response = await client.PutAsync(url, formData);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }
        }
        public async Task<ResponseData<T>> PutDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>))
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (dictHeads != null)
                    foreach (KeyValuePair<string, dynamic> item in dictHeads)
                        client.DefaultRequestHeaders.Add(item.Key, item.Value == null ? "" : item.Value.ToString());
                MultipartFormDataContent formData = new MultipartFormDataContent();
                if (dictPars != null)
                    foreach (KeyValuePair<string, dynamic> item in dictPars)
                        formData.Add(new StringContent(item.Value == null ? "" : item.Value.ToString()), item.Key);

                var response = await client.PutAsync(url, formData);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }
        }
        public async Task<ResponseData<T>> DeleteResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "")
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (!string.IsNullOrEmpty(accessToken))
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                int i = 0;
                string param = "?";
                if (dictPars != null)
                    foreach (KeyValuePair<string, dynamic> item in dictPars)
                    {
                        param += (i == 0 ? "" : "&") + string.Format("{0}={1}", item.Key, item.Value == null ? "" : item.Value.ToString());
                        i++;
                    }
                var response = await client.DeleteAsync(url + param);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }
        }
        public async Task<ResponseData<T>> DeleteDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>))
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (dictHeads != null)
                    foreach (KeyValuePair<string, dynamic> item in dictHeads)
                        client.DefaultRequestHeaders.Add(item.Key, item.Value == null ? "" : item.Value.ToString());
                int i = 0;
                string param = "?";
                if (dictPars != null)
                    foreach (KeyValuePair<string, dynamic> item in dictPars)
                    {
                        param += (i == 0 ? "" : "&") + string.Format("{0}={1}", item.Key, item.Value == null ? "" : item.Value.ToString());
                        i++;
                    }
                var response = await client.DeleteAsync(url + param);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }
        }
        public async Task<ResponseData<T>> PostResponseDataAsync<T>(string url, MultipartFormDataContent formData, string accessToken = "")
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (!string.IsNullOrEmpty(accessToken))
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await client.PostAsync(url, formData);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }

        }
        public async Task<ResponseData<T>> PostResponseDataAsync<T>(string url, FormUrlEncodedContent xwwwFormUrlEndcoded, string accessToken = "")
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (!string.IsNullOrEmpty(accessToken))
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await client.PostAsync(url, xwwwFormUrlEndcoded);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }

        }
        public async Task<ResponseData<T>> PutResponseDataAsync<T>(string url, MultipartFormDataContent formData, string accessToken = "")
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (!string.IsNullOrEmpty(accessToken))
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await client.PutAsync(url, formData);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }

        }
        public async Task<ResponseData<T>> PutResponseDataAsync<T>(string url, FormUrlEncodedContent xwwwFormUrlEndcoded, string accessToken = "")
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (!string.IsNullOrEmpty(accessToken))
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await client.PutAsync(url, xwwwFormUrlEndcoded);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res.data = JsonConvert.DeserializeObject<T>(jsonres);
                res.result = 1;
                return res;
            }
            catch (HttpRequestException ex)
            {
                res.result = -1;
                res.error = new error() { code = ex.StatusCode.HasValue ? (int)ex.StatusCode : -1, message = ex.Message };
                return res;
            }
            catch (Exception ex)
            {
                res.result = -1;
                res.error = new error() { code = -1, message = ex.Message };
                return res;
            }

        }
    }
}
