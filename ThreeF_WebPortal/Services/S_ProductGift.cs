using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;

namespace ThreeF_WebPortal.Services
{
    public interface IS_ProductGift
    {
        Task<ResponseData<T>> getListProductGiftBySequenceShoppingCartItemIdSupplierId<T>(string sequenceShoppingCartItemId, string supplierId);
        Task<ResponseData<List<M_ProductGift>>> getListProductGiftByTotalMustPaySupplierId(int? totalMustPay, string supplierId);
        Task<ResponseData<List<M_ProductGift>>> getListProductGiftbySupplierId(M_Product model, string supplierId);
    }
    public class S_ProductGift : IS_ProductGift
    {
        private readonly ICallBaseApi _callApi;
        public S_ProductGift(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> getListProductGiftBySequenceShoppingCartItemIdSupplierId<T>(string sequenceShoppingCartItemId, string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"sequenceShoppingCartItemId", sequenceShoppingCartItemId},
                {"supplierId", supplierId},
            };
            return await _callApi.GetResponseDataAsync<T>("ProductGift/getListProductGiftBySequenceShoppingCartItemIdSupplierId", dictPars);
        }
        public async Task<ResponseData<List<M_ProductGift>>> getListProductGiftByTotalMustPaySupplierId(int? totalMustPay, string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"totalMustPay", totalMustPay},
                {"supplierId", supplierId},
            };
            return await _callApi.GetResponseDataAsync<List<M_ProductGift>>("ProductGift/getListProductGiftByTotalMustPaySupplierId", dictPars);
        }
        public async Task<ResponseData<List<M_ProductGift>>> getListProductGiftbySupplierId(M_Product model,string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                //{"totalMustPay", totalMustPay},
                //{"supplierId",_supplierId }
                {"supplierId",supplierId }
            };
            return await _callApi.GetResponseDataAsync<List<M_ProductGift>>("ProductGift/getListProductGiftbySupplierId", dictPars);
        }
    }
}
