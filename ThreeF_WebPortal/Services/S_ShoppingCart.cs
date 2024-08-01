using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;
using ThreeF_WebPortal.Models;
using Newtonsoft.Json;

namespace ThreeF_WebPortal.Services
{
    public interface IS_ShoppingCart
    {
        Task<ResponseData<M_ShoppingCart>> getHubShoppingCartByIdStatus(string access_token, string id);
        Task<ResponseData<VM_CheckQuantity>> getCheckQuantity(List<VM_CheckQuantity> model);
    }
    public class S_ShoppingCart : IS_ShoppingCart
    {
        private readonly ICallBaseApi _callApi;
        public S_ShoppingCart(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<M_ShoppingCart>> getHubShoppingCartByIdStatus(string access_token, string id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"id", id},
            };
            return await _callApi.GetResponseDataAsync<M_ShoppingCart>("ShoppingCart/getHubShoppingCartByIdStatus", dictPars);
        }
        public async Task<ResponseData<VM_CheckQuantity>> getCheckQuantity(List<VM_CheckQuantity> model)
        {
            string jsonData = JsonConvert.SerializeObject(model); 
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"jsonProductProductPrice", jsonData },
               
            };
            return await _callApi.GetResponseDataAsync<VM_CheckQuantity>("ShoppingCart/checkQuantity", dictPars);
        }
    }
}
