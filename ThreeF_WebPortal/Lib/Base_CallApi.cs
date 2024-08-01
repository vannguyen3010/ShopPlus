using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Lib
{
    public interface IBase_CallApi
    {
        string _factoryName { get; set; }
        Task<ResponseData<T>> GetResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "");
        Task<ResponseData<T>> GetDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>));
        Task<ResponseData<T>> PostResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "");
        Task<ResponseData<T>> PostDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>));
        Task<ResponseData<T>> PutResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "");
        Task<ResponseData<T>> PutDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>));
        Task<ResponseData<T>> DeleteResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "");
        Task<ResponseData<T>> DeleteDictHeaderResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>));
        Task<ResponseData<T>> PostResponseDataAsync<T>(string url, MultipartFormDataContent formData, string accessToken = "");
        Task<ResponseData<T>> PostResponseDataAsync<T>(string url, MultipartFormDataContent formData, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>));
        Task<ResponseData<T>> PostResponseDataAsync<T>(string url, FormUrlEncodedContent xwwwFormUrlEndcoded, string accessToken = "");
        Task<ResponseData<T>> PutResponseDataAsync<T>(string url, MultipartFormDataContent formData, string accessToken = "");
        Task<ResponseData<T>> PutResponseDataAsync<T>(string url, FormUrlEncodedContent xwwwFormUrlEndcoded, string accessToken = "");
    }
    public class Base_CallApi : IBase_CallApi
    {
        public string _factoryName { get; set; }
        private readonly IHttpClientFactory _factory;
        public Base_CallApi(IHttpClientFactory factory)
        {
            _factory = factory ?? throw new ArgumentNullException(nameof(factory));
        }

        public async Task<ResponseData<T>> GetResponseDataAsync<T>(string url, Dictionary<string, dynamic> dictPars, string accessToken = "")
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
                var response = await client.GetAsync(url + param);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
        public async Task<ResponseData<T>> PostResponseDataAsync<T>(string url, MultipartFormDataContent formData, Dictionary<string, dynamic> dictHeads = default(Dictionary<string, dynamic>))
        {
            ResponseData<T> res = new ResponseData<T>();
            try
            {
                HttpClient client = _factory.CreateClient(_factoryName);
                if (dictHeads != null)
                    foreach (KeyValuePair<string, dynamic> item in dictHeads)
                        client.DefaultRequestHeaders.Add(item.Key, item.Value == null ? "" : item.Value.ToString());
                //client.DefaultRequestHeaders.Add("Authorizations", "84-105-109-101-58-49-54-54-55-54-49-55-50-48-52-59-107-101-121-83-104-97-114-101-84-121-112-101-58-80-69-77-59-97-117-116-104-73-100-58-49;data:GKZkUPntmZ8kix6EnXgg04BBBeUHyBNI9aZUi/AN1iy9He+dMXBkWZF7TS7HGFg0tNd+/aHa/ciK4KvrELg2tSlsOSqk2fvYlKt4hXCbM1GP3YD4zhwf/61+LCqrFFw2YhwBtkAVN/xlqhg/rlEaUTIPev/sd3DwB24MaVmm6clJ+MBlqj9bBOurxL0UeFXUvVpGmN7m/lHhIuEiL5dPFzLtobROlkZ9th0gD5Oak5JmknLhxSJVDRLvADrXaSfPYvcrPR0/lOldClD2cowNOK50gP5UMPUcl+23a/8pcPWo0DXg2rk9oZvA7WvX3CiU8GRw/Xw7rWPQoMwb5ryoAg==");
                var response = await client.PostAsync(url, formData);
                response.EnsureSuccessStatusCode();
                var jsonres = await response.Content.ReadAsStringAsync();
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
                res = JsonConvert.DeserializeObject<ResponseData<T>>(jsonres);
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
