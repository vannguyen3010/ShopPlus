using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThreeF_WebPortal.ExtensionMethods;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using ThreeF_WebPortal.ViewModels;

namespace ThreeF_WebPortal.Controllers
{
    public class AddressController : BaseController<AddressController>
    {
        private readonly IS_Address _s_Address;
        private readonly IS_DeliveryAddress _s_DeliveryAddress;
        private readonly IS_GoogleMap _s_GoogleMap;
        private readonly IConfiguration _configuration;
        public AddressController(IS_Address address, IS_DeliveryAddress deliveryAddress, IS_GoogleMap googleMap, IConfiguration configuration)
        {
            _s_Address = address;
            _s_DeliveryAddress = deliveryAddress;
            _s_GoogleMap = googleMap;
            _configuration = configuration;
        }

        [Authorize]
        public async Task<IActionResult> Index()
        {
            await SetDropDownListProvince();
            SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, new VM_ViewDataSEO
            {
                Keywords = "Sổ địa chỉ",
                Title = "Sổ địa chỉ",
                Description = "Sổ địa chỉ",
            });
            ViewData["KeyGoogleMap"] = _configuration.GetValue<string>("KeyGoogleMap");
            return View();
        }

        [Authorize]
        public async Task<JsonResult> GetListDeliveryAddress()
        {
            var res = await _s_DeliveryAddress.getListDeliveryAddressByCustomerIdStatus(_accessToken, _userId);
            return Json(res);
        }

        [HttpGet, Authorize]
        public async Task<IActionResult> P_Add()
        {
            await SetDropDownListProvince();
            return PartialView();
        }

        [HttpPost, ValidateAntiForgeryToken, Authorize]
        public async Task<JsonResult> P_Add(EM_DeliveryAddress model)
        {
            M_JResult jResult = new M_JResult();
            if (!ModelState.IsValid)
            {
                jResult.error = new error(0, DataAnnotationExtensionMethod.GetErrorMessage(ModelState));
                return Json(jResult);
            }
            model.customerId = _userId;
            var res = await _s_DeliveryAddress.Create<M_DeliveryAddress>(_accessToken, model, _userId);
            return Json(jResult.MapData(res));
        }

        [HttpGet, Authorize]
        public async Task<IActionResult> P_Edit(int id)
        {
            var res = await _s_DeliveryAddress.getDeliveryAddressByIdStatus<M_DeliveryAddress>(_accessToken, id);
            if (res.result == 1 && res.data != null)
            {
                var data = _mapper.Map<EM_DeliveryAddress>(res.data);
                Task task1 = SetDropDownListProvince(data.provinceId, "1");
                Task task2 = SetDropDownListDistrict(data.districtId, data.provinceId);
                Task task3 = SetDropDownListWard(data.wardId, data.districtId);
                Task.WaitAll(task1, task2, task3);
                return PartialView(data);
            }
            return Json(new M_JResult(res));
        }

        [HttpPost, ValidateAntiForgeryToken, Authorize]
        public async Task<JsonResult> P_Edit(EM_DeliveryAddress model)
        {
            M_JResult jResult = new M_JResult();
            if (!ModelState.IsValid)
            {
                jResult.error = new error(0, DataAnnotationExtensionMethod.GetErrorMessage(ModelState));
                return Json(jResult);
            }
            model.timer = DateTime.UtcNow.AddHours(7);
            model.customerId = _userId;
            model.status = 1;
            var res = await _s_DeliveryAddress.Update<M_DeliveryAddress>(_accessToken, model, _userId);
            return Json(jResult.MapData(res));
        }

        [HttpPost, Authorize]
        public async Task<JsonResult> Delete(int id)
        {
            var res = await _s_DeliveryAddress.Delete<M_DeliveryAddress>(_accessToken, id);
            return Json(new M_JResult(res));
        }

        #region Func common
        [AllowAnonymous]
        public async Task<IActionResult> GetListCountryOptionHtml()
        {
            string htmlResult = "";
            var res = await _s_Address.getListCountry<List<M_Country>>();
            if (res.result == 1 && res.data != null)
            {
                for (int i = 0; i < res.data.Count; i++)
                    htmlResult += $"<option value=\"{res.data[i].id}\">{res.data[i].name}</option>";
                return Json(new M_JResult(res, htmlResult));
            }
            return Json(res);
        }

        [AllowAnonymous]
        public async Task<IActionResult> GetListProvinceOptionHtml(string id = "0")
        {
            string htmlResult = "";
            if (id != "0" && id != "-2")
            {
                var res = await _s_Address.getListProvinceByCountryId<List<M_Province>>(id);
                if (res.result == 1 && res.data != null)
                {
                    for (int i = 0; i < res.data.Count; i++)
                        htmlResult += $"<option value=\"{res.data[i].id}\">{res.data[i].name}</option>";
                    return Json(new M_JResult(res, htmlResult));
                }
                return Json(res);
            }
            return Json(new M_JResult());
        }

        [AllowAnonymous]
        public async Task<IActionResult> GetListDistrictOptionHtml(string id = "0")
        {
            string htmlResult = "";
            if (id != "0" && id != "-2")
            {
                var res = await _s_Address.getListDistrictByProvinceId<List<M_District>>(id);
                if (res.result == 1 && res.data != null)
                {
                    for (int i = 0; i < res.data.Count; i++)
                        htmlResult += $"<option value=\"{res.data[i].id}\">{res.data[i].name}</option>";
                    return Json(new M_JResult(res, htmlResult));
                }
                return Json(res);
            }
            return Json(new M_JResult());
        }

        [AllowAnonymous]
        public async Task<IActionResult> GetListWardOptionHtml(string id = "0")
        {
            string htmlResult = "";
            if (id != "0" && id != "-2")
            {
                var res = await _s_Address.getListWardByDisctrictId<List<M_Ward>>(id);
                if (res.result == 1 && res.data != null)
                {
                    for (int i = 0; i < res.data.Count; i++)
                        htmlResult += $"<option value=\"{res.data[i].id}\">{res.data[i].name}</option>";
                    return Json(new M_JResult(res, htmlResult));
                }
                return Json(res);
            }
            return Json(new M_JResult());
        }

        [AllowAnonymous]
        public async Task<JsonResult> GetCountryJson()
        {
            var res = await _s_Address.getListCountry<List<M_Country>>();
            return Json(new M_JResult(res));
        }

        [AllowAnonymous]
        public async Task<JsonResult> GetProvinceJson(string countryId = "0")
        {
            var res = await _s_Address.getListProvinceByCountryId<List<M_Province>>(countryId);
            return Json(new M_JResult(res));
        }

        [AllowAnonymous]
        public async Task<JsonResult> GetDistrictJson(string provinceId = "0")
        {
            var res = await _s_Address.getListDistrictByProvinceId<List<M_District>>(provinceId);
            return Json(new M_JResult(res));
        }

        [AllowAnonymous]
        public async Task<JsonResult> GetWardJson(string districtId = "0")
        {
            var res = await _s_Address.getListDistrictByProvinceId<List<M_Ward>>(districtId);
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
        #endregion
    }
}
