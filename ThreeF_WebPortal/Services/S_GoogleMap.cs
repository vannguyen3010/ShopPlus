using ThreeF_WebPortal.Lib;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.Services
{
    public interface IS_GoogleMap
    {
        Task<ResponseData<T>> getMapAddress<T>(string address);
        Task<ResponseData<T>> getMapLocation<T>(string latlng);
        Task<ResponseData<T>> getGoogleMapByLocation<T>(string latlng);
    }
    public class S_GoogleMap : IS_GoogleMap
    {
        private readonly ICallExternalApi _callExternalApi;
        private readonly ICallBaseApi _callBaseApi;
        private readonly IConfiguration _configuration;
        public static string _api_maps_googleapis = "https://maps.googleapis.com/maps/api/geocode/json";
       
        public S_GoogleMap(ICallExternalApi callExternalApi, ICallBaseApi callBaseApi, IConfiguration configuration)
        {
            _callExternalApi = callExternalApi;
            _callBaseApi = callBaseApi;
            _configuration = configuration;
        }

        public async Task<ResponseData<T>> getMapAddress<T>(string address)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"address", address}, 
                {"key", _configuration.GetValue<string>("KeyGoogleMap")}, 
                {"sensor", "true"}
            };
            var res = await _callExternalApi.GetResponseDataAsync<T>(_api_maps_googleapis, dictPars);
            return res;
        }
        public async Task<ResponseData<T>> getMapLocation<T>(string latlng)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"latlng", latlng}, 
                {"key", _configuration.GetValue<string>("KeyGoogleMap")}, 
                {"sensor", "true"}
            };
            return await _callExternalApi.GetResponseDataAsync<T>(_api_maps_googleapis, dictPars);
        }
        public async Task<ResponseData<T>> getGoogleMapByLocation<T>(string latlng)
        {
            Dictionary<string, dynamic> dictPars = new Dictionary<string, dynamic>
            {
                {"latlng", latlng}, 
                {"key", _configuration.GetValue<string>("KeyGoogleMap")}, 
                {"sensor", true}
            };
            return await _callBaseApi.GetResponseDataAsync<T>("GoogleMaps/getGoogleMapByLocation", dictPars);
        }
    }
}
