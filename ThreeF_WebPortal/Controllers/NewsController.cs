using Microsoft.AspNetCore.Mvc;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using static System.String;

namespace ThreeF_WebPortal.Controllers
{
    public class NewsController : BaseController<NewsController>
    {
        private readonly IS_News _s_News;

        public NewsController(IS_News news)
        {
            _s_News = news;
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
                Keywords = IsNullOrEmpty(categoryTitle) ? "Tin tức" : categoryTitle,
                Title = IsNullOrEmpty(categoryTitle) ? "Tin tức" : categoryTitle,
                Description = IsNullOrEmpty(categoryTitle) ? "Tin tức" : categoryTitle,
            });
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
                res = await _s_News.getListHubNews(_supplierId, record, page);
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetListLatestNews()
        {
            var res = await _s_News.getListHubNewsByNews(_supplierId, CommonConstants.NEWS_LATEST_RECORDS);
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetListPopularIntroduce()
        {
            var res = await _s_News.getListHubIntroduceByIsHot<List<M_News>>(_supplierId, CommonConstants.NEWS_LATEST_RECORDS);
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetListRelatedNews(int newsId, int? c)
        {
            var res = await _s_News.getListHubNewsByNewsCategoryId<List<M_News>>(_supplierId, c, CommonConstants.NEWS_RELATED_RECORDS);
            if (res.result != 1 || res.data == null) return Json(new M_JResult(res));
            var data = res.data;
            var itemRemove = data.Find(x => x.id == newsId);
            if (itemRemove != null) data.Remove(itemRemove);
            return Json(new M_JResult(res, data));
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
    }
}
