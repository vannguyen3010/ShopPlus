using ThreeF_WebPortal.EditModels;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using static System.String;

namespace ThreeF_WebPortal.Services
{
    public interface IS_Order
    {
        Task<ResponseData<T>> getListHubOrderByCustomerIdProcessStatusPage<T>(string access_token, int? processStatus, string customerId, int? fdate = 7, int page = 1, int recordNumber = 10);
        Task<ResponseData<T>> getListOrderBySequenceStatusByCustomerId<T>(string sequenceStatus, string customerId);
        Task<ResponseData<T>> CreateOrderHub<T>(string access_token, EM_Order model);
        Task<ResponseData<List<M_Order>>> CreateOrderHubWithoutAccount(EM_OrderCustom model, string supplierId);
        Task<ResponseData<T>> getHubOrderByIdCustomerId<T>(string access_token, string id, string customerId);
        Task<ResponseData<T>> SendSmsNotification<T>(string name, string phoneNumber);
        Task<ResponseData<T>> SendOrderEmail<T>(EM_SendMail model);
        Task<ResponseData<M_OrderGetList>> SearchOrderNonAccount(string id, string supplierId);
    }
    public class S_Order : IS_Order
    {
        private readonly ICallBaseApi _callApi;
        public S_Order(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> getListHubOrderByCustomerIdProcessStatusPage<T>(string access_token, int? processStatus, string customerId, int? fdate = 7, int page = 1, int recordNumber = 10)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"processStatus", !processStatus.HasValue ? "-2" : processStatus.ToString()},
                {"customerId", customerId},
                {"fdate", fdate},
                {"page", page},
                {"recordNumber", recordNumber},
            };
            return await _callApi.GetResponseDataAsync<T>("Order/getListHubOrderByCustomerIdProcessStatusPage", dictPars);
        }
        public async Task<ResponseData<T>> getListOrderBySequenceStatusByCustomerId<T>(string sequenceStatus, string customerId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"sequenceStatus", IsNullOrEmpty(sequenceStatus) ? "0" : sequenceStatus},
                {"customerId", customerId},
            };
            return await _callApi.GetResponseDataAsync<T>("Order/getListOrderBySequenceStatusByCustomerId", dictPars);
        }
        public async Task<ResponseData<T>> getHubOrderById<T>(int id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"id", id},
            };
            return await _callApi.GetResponseDataAsync<T>("Order/getHubOrderById", dictPars);
        }
        public async Task<ResponseData<T>> CreateOrderHub<T>(string access_token, EM_Order model)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"sequenceShoppingCartItemId", model.sequenceShoppingCartItemId},
                {"receiverFullName", model.receiverFullName},
                {"receiverPhoneNumber", model.receiverPhoneNumber},
                {"addressText", model.addressText},
                {"addressIeText", model.addressIeText},
                {"countryId", model.countryId},
                {"provinceId", model.provinceId},
                {"districtId", model.districtId},
                {"wardId", model.wardId},
                {"companyName", model.companyName},
                {"companyTaxNumber", model.companyTaxNumber},
                {"companyAddress", model.companyAddress},
                {"remark", model.remark},
                {"paymentId", model.paymentId},
                {"shippingPriceId", model.shippingPriceId},
                {"latitude", model.latitude},
                {"longitude", model.longitude},
                {"productGiftId", model.productGiftId},
            };
            return await _callApi.PostResponseDataAsync<T>("Order/CreateOrderHub", dictPars);
        }
        public async Task<ResponseData<List<M_Order>>> CreateOrderHubWithoutAccount(EM_OrderCustom model, string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"sequenceProductProductPriceQuantity", model.sequenceProductProductPriceQuantity},
                {"receiverFullName", model.receiverFullName},
                {"receiverPhoneNumber", model.receiverPhoneNumber},
                {"addressText", model.addressText},
                {"addressIeText", model.addressIeText},
                {"countryId", model.countryId},
                {"provinceId", model.provinceId},
                {"districtId", model.districtId},
                {"wardId", model.wardId},
                {"companyName", model.companyName},
                {"companyTaxNumber", model.companyTaxNumber},
                {"companyAddress", model.companyAddress},
                {"remark", model.remark},
                {"paymentId", model.paymentId},
                {"shippingPriceId", model.shippingPriceId},
                {"shipMethodId", "1"},
                {"latitude", model.latitude},
                {"supplierId", supplierId},
                {"longitude", model.longitude},
                {"productGiftId", model.productGiftId},
            };
            return await _callApi.PostResponseDataAsync<List<M_Order>>("Order/CreateOrderHubNonAccount", dictPars);
        }
        public async Task<ResponseData<T>> getHubOrderByIdCustomerId<T>(string access_token, string id, string customerId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"id", id},
                {"customerId", customerId},
            };
            return await _callApi.GetResponseDataAsync<T>("Order/getHubOrderByIdCustomerId", dictPars);
        }
        public async Task<ResponseData<T>> SendSmsNotification<T>(string name, string phoneNumber)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"name", name},
                {"phoneNumber", phoneNumber},
            };
            return await _callApi.PostResponseDataAsync<T>("Order/SendSmsNotification", dictPars);
        }
        public async Task<ResponseData<T>> SendOrderEmail<T>(EM_SendMail model)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"subject", model.subject},
                {"recipientEmail", model.recipientEmail},
                {"recipientName", model.recipientName},
                {"message", model.message},
            };
            return await _callApi.PostResponseDataAsync<T>("Order/SendOrderEmail", dictPars);
        }
        public async Task<ResponseData<M_OrderGetList>> SearchOrderNonAccount(string id, string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"id", id},
                {"supplierId", supplierId},
            };
            return await _callApi.GetResponseDataAsync<M_OrderGetList>("Order/SearchOrderNonAccount", dictPars);
        }
    }
}
