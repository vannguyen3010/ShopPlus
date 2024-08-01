using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_BankSupplier
    {
        Task<ResponseData<T>> getListBankSupplierBySupplierId<T>(string supplierId);
    }
    public class S_BankSupplier : IS_BankSupplier
    {
        private readonly ICallBaseApi _callApi;
        public S_BankSupplier(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> getListBankSupplierBySupplierId<T>(string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
            };
            return await _callApi.GetResponseDataAsync<T>("BankSupplier/getListBankSupplierBySupplierId", dictPars);
        }
    }
}
