using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_BankPerson
    {
        Task<ResponseData<T>> getListHubBankPersonBySupplierId<T>(string supplierId);
    }
    public class S_BankPerson : IS_BankPerson
    {
        private readonly ICallBaseApi _callApi;
        public S_BankPerson(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> getListHubBankPersonBySupplierId<T>(string supplierId)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"supplierId", supplierId},
            };
            return await _callApi.GetResponseDataAsync<T>("BankPerson/getListHubBankPersonBySupplierId", dictPars);
        }
    }
}
