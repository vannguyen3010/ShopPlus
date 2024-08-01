using ThreeF_WebPortal.EditModels;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;

namespace ThreeF_WebPortal.Services
{
    public interface IS_GHTK
    {
        Task<ResponseData<M_GHTK_GetFeeShip>> Fee2(string token, EM_GetFeeShip_GHTK model);
        Task<ResponseData<M_GHTK_GetFeeShip>> Fee1(string token, EM_GetFeeShip_GHTK model);
    }
    public class S_GHTK : IS_GHTK
    {
        private readonly ICallBaseApi _callApi;
        public S_GHTK(ICallBaseApi callApi)
        {
            _callApi = callApi;
        }
        public async Task<ResponseData<M_GHTK_GetFeeShip>> Fee2(string token, EM_GetFeeShip_GHTK model)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"pick_province", model.pick_province},
                {"pick_district", model.pick_district},
                {"province", model.province},
                {"district", model.district},
                {"address", model.address},
                {"weight", model.weight},
                {"value", model.value},
                {"transport", model.transport},
                {"deliver_option", model.deliver_option ?? "none"},
                {"tags", model.tagsString ?? "[]"},
            };
            Dictionary<string, dynamic> header = new Dictionary<string, dynamic>
            {
                {"token", token },
            };
            return await _callApi.GetDictHeaderResponseDataAsync<M_GHTK_GetFeeShip>("GHTK/Fee2", dictPars, header);
        }

        public async Task<ResponseData<M_GHTK_GetFeeShip>> Fee1(string token, EM_GetFeeShip_GHTK model)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"token", token },
                {"pick_address_id", model.pick_address_id},
                {"pick_province", model.pick_province},
                {"pick_district", model.pick_district},
                {"pick_ward", model.pick_ward},
                {"pick_address", model.pick_address},
                {"pick_street", model.pick_street},
                {"province", model.province},
                {"district", model.district},
                {"address", model.address},
                {"street", model.street},
                {"weight", model.weight},
                {"value", model.value},
                {"transport", model.transport},
                {"deliver_option", model.deliver_option ?? "none"},
                {"tags", model.tagsString ?? "[]"},
            };
            Dictionary<string, dynamic> header = new Dictionary<string, dynamic>
            {
                {"token", token },
            };
            return await _callApi.GetDictHeaderResponseDataAsync<M_GHTK_GetFeeShip>("GHTK/Fee1", dictPars, header);
        }
    }
}
