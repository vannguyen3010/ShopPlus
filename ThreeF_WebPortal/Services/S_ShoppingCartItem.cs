using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_ShoppingCartItem
    {
        Task<ResponseData<int>> getShoppingCartItemCountProduct(string access_token, string shoppingCartId, int supplierId);
        Task<ResponseData<T>> Create<T>(string access_token, EM_ShoppingCartItem model, string createdBy);
        Task<ResponseData<T>> UpdateQuantity<T>(string access_token, int id, int quantity, string updatedBy);
        Task<ResponseData<T>> DeleteSequenceId<T>(string access_token, string sequenceShoppingCartItemId);
        Task<ResponseData<T>> Delete<T>(string access_token, int id);
        Task<ResponseData<T>> getShoppingCartItemById<T>(string access_token, int id);
    }
    public class S_ShoppingCartItem : IS_ShoppingCartItem
    {
        private readonly ICallBaseApi _callApi;
        public S_ShoppingCartItem(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<int>> getShoppingCartItemCountProduct(string access_token, string shoppingCartId, int supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"shoppingCartId", shoppingCartId},
                {"supplierId", supplierId},
            };
            return await _callApi.GetResponseDataAsync<int>("ShoppingCartItem/getShoppingCartItemCountProductBySupplierId", dictPars);
        }
        public async Task<ResponseData<T>> getListShoppingCartItemBySupplierIdShoppingCartIdStatus<T>(string access_token, int? supplierId, string shoppingCartId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"supplierId", supplierId},
                {"shoppingCartId", shoppingCartId},
            };
            return await _callApi.GetResponseDataAsync<T>("ShoppingCartItem/getListShoppingCartItemBySupplierIdShoppingCartIdStatus", dictPars);
        }
        public async Task<ResponseData<T>> Create<T>(string access_token, EM_ShoppingCartItem model, string createdBy)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"shoppingCartId", model.shoppingCartId},
                {"supplierId", model.supplierId},
                {"productPriceId", model.productPriceId},
                {"productId", model.productId},
                {"quantity", model.quantity},
                {"typeSizeId", model.typeSizeId},
                {"typeColorId", model.typeColorId},
                {"isBigShop", model.isBigShop},
                {"createdBy", createdBy},
            };
            return await _callApi.PostResponseDataAsync<T>("ShoppingCartItem/Create", dictPars);
        }
        public async Task<ResponseData<T>> UpdateQuantity<T>(string access_token, int id, int quantity, string updatedBy)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"id", id},
                {"quantity", quantity},
                {"updatedBy", updatedBy},
            };
            return await _callApi.PostResponseDataAsync<T>("ShoppingCartItem/UpdateQuantity", dictPars);
        }
        public async Task<ResponseData<T>> DeleteSequenceId<T>(string access_token, string sequenceShoppingCartItemId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"sequenceShoppingCartItemId", sequenceShoppingCartItemId},
            };
            return await _callApi.PostResponseDataAsync<T>("ShoppingCartItem/DeleteSequenceId", dictPars);
        }
        public async Task<ResponseData<T>> Delete<T>(string access_token, int id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"id", id},
            };
            return await _callApi.PostResponseDataAsync<T>("ShoppingCartItem/Delete", dictPars);
        }
        public async Task<ResponseData<T>> getShoppingCartItemById<T>(string access_token, int id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"id", id},
            };
            return await _callApi.GetResponseDataAsync<T>("ShoppingCartItem/getShoppingCartItemById", dictPars);
        }
    }
}
