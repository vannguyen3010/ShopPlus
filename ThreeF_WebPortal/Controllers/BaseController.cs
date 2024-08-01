using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using ThreeF_WebPortal.ViewModels;
using static System.String;

namespace ThreeF_WebPortal.Controllers
{
    public abstract class BaseController<T> : Controller where T : BaseController<T>
    {
        private IMapper mapper;
        private IHttpContextAccessor httpContextAccessor;
        private IS_SupplierConfigure s_SupplierConfigure;
        private IS_Supplier s_Supplier;
        private string supplierId = string.Empty;
        private string accessToken = string.Empty;
        private string userId = string.Empty;

        private IMemoryCache memoryCache;
        private IS_NewsCategory s_NewsCategory;
        private IS_Category s_Category;
        private IS_Banner s_Banner;

        protected IMemoryCache _memoryCache => memoryCache ?? (memoryCache = HttpContext?.RequestServices.GetService<IMemoryCache>());
        protected IS_NewsCategory _s_NewsCategory => s_NewsCategory ?? (s_NewsCategory = HttpContext?.RequestServices.GetService<IS_NewsCategory>());
        protected IS_Category _s_Category => s_Category ?? (s_Category = HttpContext?.RequestServices.GetService<IS_Category>());
        protected IS_Supplier _s_Supplier => s_Supplier ?? (s_Supplier = HttpContext?.RequestServices.GetService<IS_Supplier>());
        protected IS_Banner _s_Banner => s_Banner ?? (s_Banner = HttpContext?.RequestServices.GetService<IS_Banner>());
        protected string _supplierId => HttpContext.RequestServices.GetService<IOptions<Config_Supplier>>().Value.id.ToString();
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!_memoryCache.TryGetValue(CommonConstants.CACHE_KEY_SUPPLIER_INFO, out ResponseData<M_Supplier> supplierInfo))
            {
                supplierInfo = _s_Supplier.getHubSupplierById<M_Supplier>(_supplierId.ToString()).Result;
                if (supplierInfo.result == 1 && supplierInfo.data != null)
                {
                    MemoryCacheEntryOptions cacheExpiryOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpiration = DateTime.Now.AddMinutes(0.1),
                        Priority = CacheItemPriority.Normal,
                        //SlidingExpiration = TimeSpan.FromMinutes(5),
                        Size = 1024
                    };
                    _memoryCache.Set(CommonConstants.CACHE_KEY_SUPPLIER_INFO, supplierInfo, cacheExpiryOptions);
                }
            }
            if (!_memoryCache.TryGetValue(CommonConstants.CACHE_KEY_CATEGORY, out ResponseData<List<M_Category>> category))
            {
                category = _s_Category.getListMenu(_supplierId.ToString()).Result;
                if (category.result == 1 && category.data != null)
                {
                    MemoryCacheEntryOptions cacheExpiryOptions = new MemoryCacheEntryOptions
                    {
                        //AbsoluteExpiration = DateTime.Now.AddMinutes(10),
                        AbsoluteExpiration = DateTime.Now.AddSeconds(30),
                        Priority = CacheItemPriority.Normal,
                        //SlidingExpiration = TimeSpan.FromMinutes(5),
                        Size = 1024
                    };
                    _memoryCache.Set(CommonConstants.CACHE_KEY_CATEGORY, category, cacheExpiryOptions);
                }
            }
            if (!_memoryCache.TryGetValue(CommonConstants.CACHE_KEY_NEWS_CATEGORY, out ResponseData<List<M_NewsCategory>> newsCategory))
            {
                newsCategory = _s_NewsCategory.getListHubNewsCategoryBySupplierId(_supplierId.ToString()).Result;
                if (newsCategory.result == 1 && newsCategory.data != null)
                {
                    MemoryCacheEntryOptions cacheExpiryOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpiration = DateTime.Now.AddMinutes(10),
                        Priority = CacheItemPriority.Normal,
                        //SlidingExpiration = TimeSpan.FromMinutes(5),
                        Size = 1024
                    };
                    _memoryCache.Set(CommonConstants.CACHE_KEY_NEWS_CATEGORY, newsCategory, cacheExpiryOptions);
                }
            }

            if (!_memoryCache.TryGetValue(CommonConstants.CACHE_KEY_INTRODUCE_CATEGORY, out ResponseData<List<M_NewsCategory>> introduceCategory))
            {
                introduceCategory = _s_NewsCategory.getListHubNewsCategoryByIntroduceSupplierId(_supplierId.ToString()).Result;
                if (introduceCategory.result == 1 && introduceCategory.data != null)
                {
                    MemoryCacheEntryOptions cacheExpiryOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpiration = DateTime.Now.AddMinutes(10),
                        Priority = CacheItemPriority.Normal,
                        //SlidingExpiration = TimeSpan.FromMinutes(5),
                        Size = 1024
                    };
                    _memoryCache.Set(CommonConstants.CACHE_KEY_INTRODUCE_CATEGORY, introduceCategory, cacheExpiryOptions);
                }
            }
            if (!_memoryCache.TryGetValue("home", out ResponseData<List<M_BannerLocation>> banner))
            {
                banner = _s_Banner.getListHubBannerByCondition(_supplierId, "home", "0", "10").Result;
                if (banner.result == 1 && banner.data != null)
                {
                    MemoryCacheEntryOptions cacheExpiryOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpiration = DateTime.Now.AddMinutes(1),
                        Priority = CacheItemPriority.Normal,
                        //SlidingExpiration = TimeSpan.FromMinutes(5),
                        Size = 1024
                    };
                    _memoryCache.Set("home", banner, cacheExpiryOptions);
                }
            }

            //if (!_memoryCache.TryGetValue("home", out ResponseData<List<M_BannerLocation>> banner))
            //{
            //    banner = _s_Banner.getListHubBannerByCondition(_supplierId, "home", "0", "10").Result;
            //    if (banner.result == 1 && banner.data.Any())
            //    {
            //        MemoryCacheEntryOptions cacheExpiryOptions = new MemoryCacheEntryOptions
            //        {
            //            AbsoluteExpiration = DateTime.Now.AddMinutes(1),
            //            Priority = CacheItemPriority.Normal,
            //            Size = 1024
            //        };
            //        _memoryCache.Set("home", banner, cacheExpiryOptions);
            //    }
            //}

            //ViewBag.BannerHeader = banner.result == 1 && banner.data != null ? _mapper.Map<List<VM_Banner>>(banner.data) : null;
            ViewBag.BannerTopFirst = banner.data ?? new List<M_BannerLocation>();
            ViewBag.SupplierInfo = supplierInfo.data ?? new M_Supplier();
            ViewBag.IntroduceCategory = introduceCategory.data ?? new List<M_NewsCategory>();
            ViewBag.Category = category.data ?? new List<M_Category>();
            ViewBag.NewsCategory = newsCategory.data ?? new List<M_NewsCategory>();
            ViewBag.TopNotify = HttpContext?.RequestServices.GetService<IConfiguration>().GetSection("TopNotify").Get<string[]>();
        }

        protected IMapper _mapper => mapper ?? (mapper = HttpContext?.RequestServices.GetService<IMapper>());

        protected IHttpContextAccessor _httpContextAccessor => httpContextAccessor ?? (httpContextAccessor = HttpContext?.RequestServices.GetService<IHttpContextAccessor>());

        protected IS_SupplierConfigure _s_SupplierConfigure => s_SupplierConfigure ?? (s_SupplierConfigure = HttpContext?.RequestServices.GetService<IS_SupplierConfigure>());

        //protected string _supplierId => _supplierId.ToString();
        //protected string _supplierId => IsNullOrEmpty(supplierId) ? (supplierId = IsNullOrEmpty(HttpContext?.Request.Cookies["shop_info"]) ? (_s_SupplierConfigure.checkExistsDomain<List<M_SupplierConfigure>>(GlobalVariables.is_development ? GlobalVariables.default_site_portal : HttpContext.Request.Host.ToString()).Result.data?.FirstOrDefault()?.supplierId.ToString()) : Lib.Encryptor.Decrypt(JsonConvert.DeserializeObject<VM_Supplier>(HttpContext?.Request.Cookies["shop_info"]).id)) : supplierId;

        protected string _accessToken => IsNullOrEmpty(accessToken) ? (accessToken = HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "AccessToken")?.Value) : accessToken;

        protected string _userId => IsNullOrEmpty(userId) ? (userId = HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value) : userId;

        protected async Task SetDropDownListCountry(string selectedId = "0")
        {
            List<VM_SelectDropDown> result = new List<VM_SelectDropDown>();
            var res = await HttpContext?.RequestServices.GetService<IS_Address>().getListCountry<List<M_Country>>();
            if (res.result == 1 && res.data != null)
                result = _mapper.Map<List<VM_SelectDropDown>>(res.data);
            ViewBag.CountryId = new SelectList(result, "Id", "Name", selectedId);
        }

        protected async Task SetDropDownListProvince(string selectedId = "0", string countryId = "1")
        {
            List<VM_SelectDropDown> result = new List<VM_SelectDropDown>();
            if (countryId != "0")
            {
                var res = await HttpContext?.RequestServices.GetService<IS_Address>().getListProvinceByCountryId<List<M_Province>>(countryId);
                if (res.result == 1 && res.data != null)
                    result = _mapper.Map<List<VM_SelectDropDown>>(res.data);
            }
            ViewBag.ProvinceId = new SelectList(result, "Id", "Name", selectedId);
        }

        protected async Task SetDropDownListDistrict(string selectedId = "0", string provinceId = "0")
        {
            List<VM_SelectDropDown> result = new List<VM_SelectDropDown>();
            if (provinceId != "0")
            {
                var res = await HttpContext?.RequestServices.GetService<IS_Address>().getListDistrictByProvinceId<List<M_District>>(provinceId);
                if (res.result == 1 && res.data != null)
                    result = _mapper.Map<List<VM_SelectDropDown>>(res.data);
            }
            ViewBag.DistrictId = new SelectList(result, "Id", "Name", selectedId);
        }

        protected async Task SetDropDownListWard(string selectedId = "0", string districtId = "0")
        {
            List<VM_SelectDropDown> result = new List<VM_SelectDropDown>();
            if (districtId != "0")
            {
                var res = await HttpContext?.RequestServices.GetService<IS_Address>().getListWardByDisctrictId<List<M_Ward>>(districtId);
                if (res.result == 1 && res.data != null)
                    result = _mapper.Map<List<VM_SelectDropDown>>(res.data);
            }
            ViewBag.WardId = new SelectList(result, "Id", "Name", selectedId);
        }
    }
}
