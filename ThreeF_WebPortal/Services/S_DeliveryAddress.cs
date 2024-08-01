using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_DeliveryAddress
    {
        Task<ResponseData<List<M_DeliveryAddress>>> getListDeliveryAddressByCustomerIdStatus(string access_token, string customerId);
        Task<ResponseData<T>> getDeliveryAddressByCustomerIdStatusIsDefault<T>(string access_token, string customerId);
        Task<ResponseData<T>> getDeliveryAddressByIdStatus<T>(string access_token, int id);
        Task<ResponseData<T>> Create<T>(string access_token, EM_DeliveryAddress model, string createdBy);
        Task<ResponseData<T>> Update<T>(string access_token, EM_DeliveryAddress model, string updatedBy);
        Task<ResponseData<T>> Delete<T>(string access_token, int id);
    }
    public class S_DeliveryAddress : IS_DeliveryAddress
    {
        private readonly ICallBaseApi _callApi;
        public S_DeliveryAddress(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<List<M_DeliveryAddress>>> getListDeliveryAddressByCustomerIdStatus(string access_token, string customerId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"customerId", customerId},
            };
            return await _callApi.GetResponseDataAsync<List<M_DeliveryAddress>>("DeliveryAddress/getListDeliveryAddressByCustomerIdStatus", dictPars);
        }
        public async Task<ResponseData<T>> getDeliveryAddressByCustomerIdStatusIsDefault<T>(string access_token, string customerId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"customerId", customerId},
            };
            return await _callApi.GetResponseDataAsync<T>("DeliveryAddress/getDeliveryAddressByCustomerIdStatusIsDefault", dictPars);
        }
        public async Task<ResponseData<T>> getDeliveryAddressByIdStatus<T>(string access_token, int id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"id", id},
            };
            return await _callApi.GetResponseDataAsync<T>("DeliveryAddress/getDeliveryAddressByIdStatus", dictPars);
        }
        public async Task<ResponseData<T>> Create<T>(string access_token, EM_DeliveryAddress model, string createdBy)
        {
            model = CleanXSSHelper.CleanXSSObject(model); //Clean XSS
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"customerId", model.customerId},
                {"typeId", model.typeId},
                {"name", model.name},
                {"phoneNumber", model.phoneNumber},
                {"addressNumber", model.addressNumber},
                {"addressText", model.addressText},
                {"isDefault", model.isDefault ? 1 : 0},
                {"countryId", model.countryId},
                {"provinceId", model.provinceId},
                {"districtId", model.districtId},
                {"wardId", model.wardId},
                {"latitude", model.latitude},
                {"longitude", model.longitude},
                {"createdBy", createdBy},
            };
            return await _callApi.PostResponseDataAsync<T>("DeliveryAddress/Create", dictPars);
        }
        public async Task<ResponseData<T>> Update<T>(string access_token, EM_DeliveryAddress model, string updatedBy)
        {
            model = CleanXSSHelper.CleanXSSObject(model); //Clean XSS
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"id", model.id},
                {"customerId", model.customerId},
                {"typeId", model.typeId},
                {"name", model.name},
                {"phoneNumber", model.phoneNumber},
                {"addressNumber", model.addressNumber},
                {"addressText", model.addressText},
                {"isDefault", model.isDefault ? 1 : 0},
                {"countryId", model.countryId},
                {"provinceId", model.provinceId},
                {"districtId", model.districtId},
                {"wardId", model.wardId},
                {"latitude", model.latitude},
                {"longitude", model.longitude},
                {"updatedBy", updatedBy},
                {"status", model.status},
                {"timer", model.timer?.ToString("O")},
            };
            return await _callApi.PostResponseDataAsync<T>("DeliveryAddress/Update", dictPars);
        }
        public async Task<ResponseData<T>> Delete<T>(string access_token, int id)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"access_token", access_token},
                {"id", id},
            };
            return await _callApi.PostResponseDataAsync<T>("DeliveryAddress/Delete", dictPars);
        }
    }
}
