using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_SupplierConfigure
    {
        Task<ResponseData<T>> checkExistsDomain<T>(string domainName, int domainType = 0);
    }
    public class S_SupplierConfigure : IS_SupplierConfigure
    {
        private readonly ICallBaseApi _callApi;
        public S_SupplierConfigure(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }

        public async Task<ResponseData<T>> checkExistsDomain<T>(string domainName, int domainType = 0)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"domainName", domainName},
                {"domainType", domainType},
            };
            return await _callApi.GetResponseDataAsync<T>("SupplierConfigure/checkExistsDomain", dictPars);
        }
    }
}
