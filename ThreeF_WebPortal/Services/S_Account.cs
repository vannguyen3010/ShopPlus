using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
namespace ThreeF_WebPortal.Services
{
    public interface IS_Account
    {
        Task<ResponseData<T>> CreateCustomer<T>(EM_AccountRegister model, string supplierId);
        Task<ResponseData<T>> LoginHub<T>(EM_AccountSignIn model, string supplierId, int timeOut = 30);
        Task<ResponseData<T>> ChangePassComparePass<T>(string accessToken, string oldPass, string newPass);
        Task<ResponseData<T>> ForgotPassSMS<T>(EM_ChangePassword model, string userName, string supplierId);
        Task<ResponseData<T>> VertifyForgotPassNewPass<T>(string id, string activeCode, string phoneNumber, string newPassWord);
    }
    public class S_Account : IS_Account
    {
        private readonly ICallBaseApi _callApi;
        public S_Account(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> CreateCustomer<T>(EM_AccountRegister model, string supplierId)
        {
            model = CleanXSSHelper.CleanXSSObject(model); //Clean XSS
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"userName", model.userName},
                {"password", model.password},
                {"firstName", model.firstName},
                {"lastName", model.lastName},
                {"birthday", model.birthday?.ToString("yyyy-MM-dd")},
                {"gender", model.gender},
                {"supplierId", supplierId},
                {"phoneNumber", model.phoneNumber},
                {"email", model.email.ToLower()},
            };
            return await _callApi.PostResponseDataAsync<T>("Account/CreateCustomer", dictPars);
        }
        public async Task<ResponseData<T>> LoginHub<T>(EM_AccountSignIn model, string supplierId, int timeOut = 30)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"userName", model.userName},
                {"password", model.password},
                 {"supplierId", supplierId },
                {"timeOut", timeOut},
            };
            return await _callApi.PostResponseDataAsync<T>("Account/LoginHub", dictPars);
        }
        public async Task<ResponseData<T>> ChangePassComparePass<T>(string access_token, string oldPass, string newPass)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"oldPass", oldPass},
                {"newPass", newPass},
            };
            return await _callApi.PostResponseDataAsync<T>("Account/ChangePassHubComparePass", dictPars);
        }
        public async Task<ResponseData<T>> ForgotPassSMS<T>(EM_ChangePassword model, string userName, string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"userName", userName},
                {"supplierId", supplierId},
            };
            return await _callApi.PostResponseDataAsync<T>("Account/ForgotPassSMS", dictPars);
        }
        public async Task<ResponseData<T>> VertifyForgotPassNewPass<T>(string id, string activeCode, string phoneNumber, string newPassWord)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"id", id},
                {"activeCode", activeCode},
                {"phoneNumber", phoneNumber},
                {"newPassWord", newPassWord},
            };
            return await _callApi.PostResponseDataAsync<T>("Account/VertifyForgotPassNewPass", dictPars);
        }
    }
}