using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;


namespace ThreeF_WebPortal.Controllers
{
    public class CommonController : Controller
    {
        private readonly IS_Address _s_Address;
        private readonly IS_GoogleMap _s_GoogleMap;

        public CommonController(IS_Address address, IS_GoogleMap googleMap)
        {
            _s_Address = address;
            _s_GoogleMap = googleMap;
        }

        public IActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public async Task<JsonResult> GetCountryJson()
        {
            var res = await _s_Address.getListCountry<List<M_Country>>();
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetProvinceJson(string countryId = "1")
        {
            var res = await _s_Address.getListProvinceByCountryId<List<M_Province>>(countryId);
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetDistrictJson(string provinceId = "0")
        {
            if (_s_Address == null)
            {
                return Json(new M_JResult(null));
            }

            var res = await _s_Address.getListDistrictByProvinceId<IEnumerable<M_District>>(provinceId);
            return Json(new M_JResult(res));
        }

        //[AllowAnonymous]
        public async Task<JsonResult> GetWardJson(string districtId = "0")
        {
            if (_s_Address == null)
            {
                return Json(new M_JResult(null));
            }
            var res = await _s_Address.getListWardByDisctrictId<List<M_Ward>>(districtId);
            return Json(new M_JResult(res));
        }

        [HttpGet, Authorize]
        public async Task<JsonResult> getMapAddress(string address)
        {
            var res = await _s_GoogleMap.getMapAddress<M_GoogleMap>(address);
            return Json(new M_JResult(res));
        }

        [HttpGet, Authorize]
        public async Task<JsonResult> getMapLocation(string latLng)
        {
            var res = await _s_GoogleMap.getGoogleMapByLocation<M_AddessGoogleMap>(latLng);
            return Json(new M_JResult(res));
        }

    }
}
