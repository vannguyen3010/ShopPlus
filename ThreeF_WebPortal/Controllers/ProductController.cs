using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using ThreeF_WebPortal.ViewModels;
using static System.String;

namespace ThreeF_WebPortal.Controllers
{
    public class ProductController : BaseController<ProductController>
    {
        private readonly IOptions<Config_MetaSEO> _metaSEO;
        private readonly IS_Product _s_Product;
        private readonly IS_Category _s_Category;
        private readonly IS_TradeMark _s_TradeMark;
        private readonly IS_TypeColor _s_TypeColor;
        private readonly IS_TypeSize _s_TypeSize;
        private readonly IS_Banner _s_Banner;
        private readonly IS_PropertyFilter _s_PropertyFilter;
        private static List<int> typeRange = new List<int> { 1, 2, 3, 4, 5 };
        private const int MAX_RECORDS = 12;
        private const int NEW_PRODUCT = 9;
        private const int RELATED_PRODUCT = 10;
        private const int BANNER_BOTTOM_RECORDS = 1;

        public ProductController(IOptions<Config_MetaSEO> metaSEO, IS_Product product, IS_Category category, IS_TradeMark tradeMark, IS_TypeColor typeColor, IS_TypeSize typeSize, IS_Banner banner, IS_PropertyFilter propertyFilter)
        {
            _metaSEO = metaSEO;
            _s_Product = product;
            _s_Category = category;
            _s_TradeMark = tradeMark;
            _s_TypeColor = typeColor;
            _s_TypeSize = typeSize;
            _s_Banner = banner;
            _s_PropertyFilter = propertyFilter;
        }

        public async Task<IActionResult> Index(string keyword, int type = 1, int c1 = 0, int c2 = 0, string brand = "", string prop0 = "", string prop1 = "", string prop2 = "", string prop3 = "", int price = 0, int record = 12, int page = 1)
        {
            var listPrice = VM_PriceListSearch.priceData;
            ViewBag.priceList = listPrice;
            ViewBag.category1 = c1;
            ViewBag.category2 = c2;
            ViewBag.type = type;
            ViewBag.keyword = keyword;
            ViewBag.propertyFilter0 = prop0;
            ViewBag.propertyFilter1 = prop1;
            ViewBag.propertyFilter2 = prop2;
            ViewBag.propertyFilter3 = prop3;
            ViewBag.brand = brand;
            ViewBag.price = price;
            ViewBag.record = record;
            ViewBag.page = page;
            int? idLv1 = 0;
            string nameLv1 = Empty;
            string nameLv2 = Empty;
            await GetBannerTop();
            if (c2 != 0)
            {
                var res = await _s_Category.getCategoryByIdStatus<M_Category>(c2);
                if (res.result == 1 && res.data != null)
                {
                    idLv1 = res.data.parentId;
                    nameLv1 = res.data.parentObj?.name;
                    nameLv2 = res.data.name;
                }
            }
            else if (c1 != 0 && c2 == 0)
            {
                var res = await _s_Category.getCategoryByIdStatus<M_Category>(c1);
                if (res.result == 1 && res.data != null)
                {
                    nameLv1 = res.data.name;
                    idLv1 = res.data.id;
                }
            }

            keyword = !IsNullOrEmpty(keyword) && keyword.Length > 50 ? keyword.Substring(0, 50) + "..." : keyword;
            var breadCrumb = new VM_BreadCrumb();
            if (!IsNullOrEmpty(keyword))
            {
                breadCrumb.currentName = keyword;
                breadCrumb.lv1Name = "Sản phẩm";
                breadCrumb.lv1Url = "/san-pham";
            }
            else
            {
                if (!IsNullOrEmpty(nameLv2))
                {
                    breadCrumb.currentName = nameLv2;
                    breadCrumb.lv1Name = "Sản phẩm";
                    breadCrumb.lv1Url = "/san-pham";
                    breadCrumb.lv2Name = nameLv1;
                    breadCrumb.lv2Url = $"/san-pham?c1={idLv1}";
                }
                else if (!IsNullOrEmpty(nameLv1))
                {
                    breadCrumb.currentName = nameLv1;
                    breadCrumb.lv1Name = "Sản phẩm";
                    breadCrumb.lv1Url = "/san-pham";
                }
                else
                {
                    breadCrumb.currentName = "Sản phẩm";
                }
            }
            ViewBag.BreadCrumb = breadCrumb;
            ExtensionMethods.SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, new ViewModels.VM_ViewDataSEO
            {
                Title = breadCrumb.currentName,
                Description = breadCrumb.currentName,
                Keywords = breadCrumb.currentName,
            });
            return View();
        }

        public IActionResult Search(string keyword)
        {
            return Redirect($"/san-pham?keyword={keyword}");
        }

        public async Task<JsonResult> QuickSearch(string keyword)
        {
            var res = await _s_Product.getListHubProductBySupplierIdProductConditionSecond(_supplierId, keyword, 0, "", "", "", "", "", default(int?), default(int?), 1, 20, 1);
            return Json(res);
        }

        public async Task<JsonResult> GetList(string keyword, int type = 1, int c1 = 0, int c2 = 0, string brand = "", string prop0 = "", string prop1 = "", string prop2 = "", string prop3 = "", int price = 0, int record = 24, int page = 1)
        {
            ResponseData<List<M_Product>> res = new ResponseData<List<M_Product>>();
            if (record > MAX_RECORDS) //maximum records
                record = MAX_RECORDS;

            if (!typeRange.Contains(type)) //Check type range
                type = 1;

            //Get price data
            var priceItem = new VM_PriceListSearch.VM_Price() { id = 0, fPrice = 0, tPrice = 0 };
            if (price != 0)
                priceItem = VM_PriceListSearch.priceData.FirstOrDefault(x => x.id == price);

            if (c1 != 0 && c2 == 0) //Return by category Lv1
                res = await _s_Product.getListHubProductBySupplierIdProductConditionSecond(_supplierId, keyword, c1, brand, prop0, prop1, prop2, prop3, priceItem.fPrice, priceItem.tPrice, type, record, page);
            else if (c1 != 0 && c2 != 0) //Return by category Lv2
                res = await _s_Product.getListHubProductBySupplierIdProductConditionSecond(_supplierId, keyword, c2, brand, prop0, prop1, prop2, prop3, priceItem.fPrice, priceItem.tPrice, type, record, page);
            else //Return all //
                res = await _s_Product.getListHubProductBySupplierIdProductConditionSecond(_supplierId, keyword, 0, brand, prop0, prop1, prop2, prop3, priceItem.fPrice, priceItem.tPrice, type, record, page);
            return Json(res);
        }

        public async Task<JsonResult> GetListBrand(int parentId = 0, int categoryId = 0)
        {
            var res = await _s_TradeMark.getListHubTradeMarkBySupplierIdCategoryId<List<M_TradeMark>>(_supplierId, parentId, categoryId);
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetListPropertyFilter()
        {
            var res = await _s_PropertyFilter.getListPropertyFilterBySequenceStatusSequenceTypeId("1", "0,1,2,3");
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetListColor(int parentId = 0, int categoryId = 0)
        {
            var res = await _s_TypeColor.getListHubTypeColorBySupplierIdCategoryId<List<M_TypeColor>>(_supplierId, parentId, categoryId);
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetListSize(int parentId = 0, int categoryId = 0)
        {
            var res = await _s_TypeSize.getListHubTypeSizeBySupplierIdCategoryId(_supplierId, parentId, categoryId);
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetBannerLeftBottom()
        {
            var res = await _s_Banner.getListHubBannerByLocationIdPageName(_supplierId, "product", 3, BANNER_BOTTOM_RECORDS);
            return res.result == 1 && res.data != null ? Json(new M_JResult(res, _mapper.Map<List<VM_Banner>>(res.data))) : Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetListNewProduct()
        {
            var res = await _s_Product.getListHubProductBySupplierIdProductNews(_supplierId, MAX_RECORDS, 1);
            if (res.result != 1 || res.data == null) return Json(new M_JResult(res));
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetListRelatedProduct(int productId, int c2)
        {
            var res = await _s_Product.getListHubProductBySupplierIdCategoryIdPageSizePage(_supplierId, c2, RELATED_PRODUCT, 1);
            if (res.result != 1 || res.data == null) return Json(new M_JResult(res));
            //var data = _mapper.Map<List<VM_ProductList>>(res.data);
            //var itemRemove = data.Find(x => x.id == productId);
            //if (itemRemove != null) data.Remove(itemRemove);

            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> GetListProductById(int productId, int c2)
        {
            var res = await _s_Product.getListProductRelatedByCategoryId(c2, RELATED_PRODUCT);
            return Json(new M_JResult(res));
        }

        public async Task<IActionResult> ViewDetail(string nameSlug, int id)
        {
            string metaTitle = Empty;
            string metaDescription = Empty;
            string metaKeyword = Empty;
            string metaImage = Empty;

            var res = await _s_Product.getHubProductById(id);
            ViewBag.ProductDetail = res.data;
            if (res.result == 1 && res.data != null)
            {

                metaTitle = res.data.metaTitle ?? res.data.name;
                metaDescription = res.data.metaDescription ?? res.data.summaryInfo;
                metaKeyword = res.data.metaKeyword ?? res.data.name;
                metaImage = res.data.imageObj?.mediumUrl;


                ExtensionMethods.SetViewDataSEOExtensionMethod.SetViewDataSEOCustom(this, new ViewModels.VM_ViewDataSEO
                {
                    Title = IsNullOrEmpty(metaTitle) ? "Sản phẩm" : metaTitle,
                    Description = IsNullOrEmpty(metaDescription) ? "Sản phẩm" : metaDescription,
                    Keywords = IsNullOrEmpty(metaKeyword) ? "Sản phẩm" : metaKeyword,
                    Image = metaImage,
                });
                return View(res.data);
            }
            else
            {
                return Redirect($"/error/{res.error.code}");
            }
        }
        //public  async Task<IActionResult> ViewDetail(string nameSlug, int id)
        //{
        //    string metaTitle = Empty;
        //    string metaDescription = Empty;
        //    string metaKeyword = Empty;
        //    string metaImage = Empty;
        //    var res = await _s_Product.getHubProductById(id);
        //    if (res.result != 1 || res.data == null) return Redirect($"/error/{res.error.code}");
        //    ViewBag.ProductDetail = res.data;
        //    if(res.result == 1 && res.data != null)
        //    {
        //        if (res.result == 1 && res.data != null)
        //        {
        //            ViewBag.categoryTitle = res.data.name;
        //            metaTitle = res.data.metaTitle ?? res.data.name;
        //            metaDescription = res.data.metaDescription ?? res.data.summaryInfo;
        //            metaKeyword = res.data.metaKeyword ?? res.data.name;
        //            metaImage = res.data.imageObj?.mediumUrl;
        //        }
        //        ExtensionMethods.SetViewDataSEOExtensionMethod.SetViewDataSEOCustom(this, new ViewModels.VM_ViewDataSEO
        //        {
        //            Title = IsNullOrEmpty(metaTitle) ? "Sản phẩm" : metaTitle,
        //            Description = IsNullOrEmpty(metaDescription) ? "Sản phẩm" : metaDescription,
        //            Keywords = IsNullOrEmpty(metaKeyword) ? "Sản phẩm" : metaKeyword,
        //            Image = metaImage,
        //        });

        //    }
        //    await GetBannerTop();

        //    return View();

        // }
        private async Task GetBannerTop()
        {
            var res = await _s_Banner.getListHubBannerByLocationIdPageName(_supplierId, "product", 0, CommonConstants.BANNER_RECORDS);
            ViewBag.BannerTop = res.result == 1 && res.data != null ? _mapper.Map<List<VM_Banner>>(res.data) : null;
        }

    }
}