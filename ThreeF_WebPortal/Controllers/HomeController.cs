using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using ThreeF_WebPortal.ViewModels;
using static System.String;

namespace ThreeF_WebPortal.Controllers
{
    public class HomeController : BaseController<HomeController>
    {
        private readonly IS_Banner _s_Banner;
        private readonly IS_Product _s_Product;
        private readonly IS_News _s_News;
        private readonly IS_Category _s_Category;
        private readonly IOptions<Config_MetaSEO> _metaSEO;

        public HomeController(IS_Banner banner, IS_Product product, IS_News news, IS_Category category, IOptions<Config_MetaSEO> metaSEO)
        {
            _s_Banner = banner;
            _s_Product = product;
            _s_News = news;
            _s_Category = category;
            _metaSEO = metaSEO;
        }

        public async Task<IActionResult> Index()
        {
            ExtensionMethods.SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, _metaSEO.Value.Home);
            await Task.WhenAll(GetBannerMix(), GetBannerBottomHome());
            return View();
        }

        public IActionResult Policy(string path)
        {
            try
            {
                string PDFpath = $"wwwroot/PDF/policy/{path}";
                byte[] fileByte = System.IO.File.ReadAllBytes(PDFpath);
                MemoryStream ms = new MemoryStream(fileByte);
                return new FileStreamResult(ms, "application/pdf");
            }
            catch (Exception)
            {
                return Redirect("/error/404");
            }
        }

        private async Task GetBannerMix()
        {   
            var res = await _s_Banner.getListHubBannerByCondition(_supplierId, "home", "0,1,2,3,4", "10,10,10,10,10");
            if (res.result == 1 && res.data != null)
            {   /*BannerTop,BannerMid,BannerBottom,BanerDiscountFirts,BannerDiscountSecond*/
                ViewBag.BannerFirst = _mapper.Map<List<VM_Banner>>(res.data.Find(x => x.location == 0)?.dataObj?.OrderBy(x => x.reOrder).ToList());
                ViewBag.BannerTop = _mapper.Map<List<VM_Banner>>(res.data.Find(x => x.location == 1)?.dataObj?.OrderBy(x => x.reOrder).ToList());
                ViewBag.BannerMidLeft = _mapper.Map<List<VM_Banner>>(res.data.Find(x => x.location == 2)?.dataObj?.OrderBy(x => x.reOrder).ToList());
                ViewBag.BannerMidRight = _mapper.Map<List<VM_Banner>>(res.data.Find(x => x.location == 3)?.dataObj?.OrderBy(x => x.reOrder).ToList());
                ViewBag.BannerBottom = _mapper.Map<List<VM_Banner>>(res.data.Find(x => x.location == 4)?.dataObj?.OrderBy(x => x.reOrder).ToList());
            }
        }

        private async Task GetBannerHeader()
        {
            var res = await _s_Banner.getListHubBannerByLocationIdPageName(_supplierId, "home", 0, CommonConstants.BANNER_RECORDS);
            ViewBag.BannerHeader = res.result == 1 && res.data != null ? _mapper.Map<List<VM_Banner>>(res.data) : null;
        }

        private async Task GetBannerTop()
        {
            var res = await _s_Banner.getListHubBannerByLocationIdPageName(_supplierId, "home", 1, CommonConstants.BANNER_RECORDS);
            ViewBag.BannerTop = res.result == 1 && res.data != null ? _mapper.Map<List<VM_Banner>>(res.data) : null;
        }

        private async Task GetBannerMid()
        {
            var res = await _s_Banner.getListHubBannerByLocationIdPageName(_supplierId, "home", 2, CommonConstants.BANNER_RECORDS);
            ViewBag.BannerMid = res.result == 1 && res.data != null ? _mapper.Map<List<VM_Banner>>(res.data) : null;
        }

        private async Task GetBannerBottom()
        {
            var res = await _s_Banner.getListHubBannerByLocationIdPageName(_supplierId, "home", 3, CommonConstants.BANNER_RECORDS);
            ViewBag.BannerBottom = res.result == 1 && res.data != null ? _mapper.Map<List<VM_Banner>>(res.data) : null;
        }   

        private async Task GetBannerRight()
        {
            var res = await _s_Banner.getListHubBannerByLocationIdPageName(_supplierId, "home", 4, CommonConstants.BANNER_RECORDS);
            ViewBag.BannerRight = res.result == 1 && res.data != null ? _mapper.Map<List<VM_Banner>>(res.data) : null;
        }

        public async Task<JsonResult> GetProductDiscount()
        {
            var res = await _s_Product.getListHubProductBySupplierIdProductDiscount(_supplierId, CommonConstants.DISCOUNT_PRODUCT_RECORDS);
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetProductSelling()
        {
            var res = await _s_Product.getListHubProductBySupplierIdProductSelling(_supplierId, CommonConstants.SELLING_PRODUCT_RECORDS);
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetProductPopular()
        {
            var res = await _s_Product.getListHubProductBySupplierIdProductHighlights(_supplierId, CommonConstants.POPULAR_PRODUCT_RECORDS);
            return Json(new M_JResult(res));
        }

        //public async Task<JsonResult> GetProductRecently()
        //{
        //    var res = await _s_Product.getListHubProductBySupplierIdProductHighlights<List<M_Product>>(_supplierId, CommonConstants.POPULAR_PRODUCT_RECORDS);
        //    return res.result == 1 && res.data != null ? Json(new M_JResult(res, _mapper.Map<VM_ProductList>(res.data))) : Json(new M_JResult(res));
        //}

        public async Task<JsonResult> GetListNews()
        {
            var res = await _s_News.getListHubNewsByNews(_supplierId, CommonConstants.POPULAR_PRODUCT_RECORDS);
            return Json(new M_JResult(res));
        }

        //public async Task<JsonResult> GetInfoShop()
        //{
        //    var resCheckDomain = await _s_SupplierConfigure.checkExistsDomain<List<M_SupplierConfigure>>(GlobalVariables.is_development ? GlobalVariables.default_site_portal : HttpContext.Request.Host.ToString());
        //    if (resCheckDomain.result == 0 && resCheckDomain.data != null && resCheckDomain.data.FirstOrDefault().status == 1)
        //    {
        //        var resInfo = await _s_Supplier.getHubSupplierById<M_Supplier>(resCheckDomain.data.FirstOrDefault().supplierId.ToString());
        //        if (resInfo.result == 1 && resInfo.data != null)
        //        {
        //            var infoObj = _mapper.Map<VM_Supplier>(resInfo.data);
        //            infoObj.id = Encryptor.Encrypt(infoObj.id);
        //            CookieOptions option = new CookieOptions();
        //            option.Expires = new DateTimeOffset(DateTime.Now.AddMinutes(10));
        //            option.SameSite = SameSiteMode.Lax;
        //            option.Secure = true;
        //            ExtensionMethods.CookieHandleExtensionMethod.AddOrUpdate(_httpContextAccessor, "shop_info", JsonConvert.SerializeObject(infoObj), option);
        //            return Json(new { result = 1 });
        //        }
        //    }
        //    return Json(new { result = 0 });
        //}

        public async Task<JsonResult> GetMenu()
        {
            Task<ResponseData<List<M_Category>>> taskCategory = _s_Category.getListMenu(_supplierId.ToString());
            Task<ResponseData<List<M_NewsCategory>>> taskNewsCategory = _s_NewsCategory.getListHubNewsCategoryBySupplierId(_supplierId.ToString());
            await Task.WhenAll(taskCategory, taskNewsCategory);
            VM_Menu menu = new VM_Menu();
            if (taskCategory.Result.result == 1)
                menu.categorys = _mapper.Map<List<VM_Menu.Category>>(taskCategory.Result.data);
            if (taskNewsCategory.Result.result == 1)
                menu.newsCategorys = _mapper.Map<List<VM_Menu.NewsCategory>>(taskNewsCategory.Result.data);
            return Json(new M_JResult(1, new error(200, Empty), menu));
        }

        private async Task GetBannerBottomHome()
        {
            var res = await _s_Banner.getListHubBannerByLocationIdPageName(_supplierId, "about", 3, CommonConstants.BANNER_RECORDS);
            ViewBag.BannerBottomHome = res.result == 1 && res.data != null ? _mapper.Map<List<VM_Banner>>(res.data) : new List<VM_Banner>();
        }

        public async Task<JsonResult> GetListIntroduce(string keyword, int? c, int record = 12, int page = 1)
        {
            ResponseData<List<M_News>> res = new ResponseData<List<M_News>>();
            if (!string.IsNullOrEmpty(keyword)) //Get list by keyword
            {

            }
            else if (c.HasValue) //Get list by categoryId
                res = await _s_News.getListHubNewsByCategoryIdReOrder(_supplierId, c, record, page);
            else if (!c.HasValue) //Get list all
                res = await _s_News.getListHubIntroduceReOrder(_supplierId, record, page);
            return Json(new M_JResult(res));
        }


    }
}
