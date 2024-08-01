using Microsoft.AspNetCore.Mvc;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using static System.String;

namespace ThreeF_WebPortal.Controllers
{
    public class AboutController : BaseController<AboutController>
    {
        private readonly IS_Banner _s_Banner;
        private readonly IS_News _s_News;
        private readonly IS_Product _s_Product;
        private const int NEW_PRODUCT = 9;

        public AboutController(IS_Banner banner, IS_News news, IS_Product product)
        {
            _s_Banner = banner;
            _s_News = news;
            _s_Product = product;
        }

        public async Task<IActionResult> Index(int? c, int record = 12, int page = 1)
        {
            ViewBag.categoryId = c;
            ViewBag.record = record;
            ViewBag.page = page;
            string categoryTitle = Empty;
            if (c.HasValue)
            {
                var res = await _s_NewsCategory.getHubNewsCategoryById<M_NewsCategory>(c.Value);
                if (res.result == 1 && res.data != null)
                {
                    ViewBag.categoryId = res.data.id;
                    ViewBag.categoryTitle = res.data.name;
                    categoryTitle = res.data.name;
                }
            }
            ExtensionMethods.SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, new ViewModels.VM_ViewDataSEO
            {
                Keywords = IsNullOrEmpty(categoryTitle) ? "Giới thiệu" : categoryTitle,
                Title = IsNullOrEmpty(categoryTitle) ? "Giới thiệu" : categoryTitle,
                Description = IsNullOrEmpty(categoryTitle) ? "Giới thiệu" : categoryTitle,
            });

            await GetBannerBottom();
            return View();
        }

        public async Task<JsonResult> GetList(string keyword, int? c, int record = 12, int page = 1)
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

        public async Task<IActionResult> ViewDetail(string nameSlug, int id)
        {
            var res = await _s_News.getHubNewsById<M_News>(id);
            if (res.result != 1 || res.data == null)
                return Redirect($"/error/{res.error.code}");
            ExtensionMethods.SetViewDataSEOExtensionMethod.SetViewDataSEOCustom(this, new ViewModels.VM_ViewDataSEO
            {
                Keywords = res.data.title,
                Title = res.data.title,
                Description = res.data.description,
                Image = res.data.imageObj?.mediumUrl,
            });
            return PartialView(res.data);
        }

        private async Task GetBannerBottom()
        {
            var res = await _s_Banner.getListHubBannerByLocationIdPageName(_supplierId, "about", 3, CommonConstants.BANNER_RECORDS);
            ViewBag.BannerBottom = res.result == 1 && res.data != null ? _mapper.Map<List<VM_Banner>>(res.data) : new List<VM_Banner>();
        }

        public async Task<JsonResult> GetListNewProduct(int productId)
        {
            var res = await _s_Product.getListHubProductBySupplierIdProductNews(_supplierId, NEW_PRODUCT, 1);
            if (res.result != 1 || res.data == null) return Json(new M_JResult(res));
            return Json(new M_JResult(res));
        }
    }
}
