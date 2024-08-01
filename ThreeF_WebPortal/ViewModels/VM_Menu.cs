using ThreeF_WebPortal.Models;
using System.Collections.Generic;

namespace ThreeF_WebPortal.ViewModels
{
    public class VM_Menu
    {
        public VM_Menu()
        {
            this.categorys = new List<Category>();
            this.newsCategorys = new List<NewsCategory>();
            this.topBanner = new List<VM_Banner>();
            this.headerBanner = new List<VM_Banner>();
        }

        public VM_Menu(List<Category> categorys, List<NewsCategory> newsCategorys, List<VM_Banner> topBanners, List<VM_Banner> headerBanners)
        {
            this.categorys = categorys;
            this.newsCategorys = newsCategorys;
            this.topBanner = topBanners;
            this.headerBanner = headerBanners;
        }

        public List<Category> categorys { get; set; }
        public List<NewsCategory> newsCategorys { get; set; }
        public List<VM_Banner> topBanner { get; set; }
        public List<VM_Banner> headerBanner { get; set; }
        public class Category
        {
            public int id { get; set; }
            public string name { get; set; }
            public string nameSlug { get; set; }
            public string imageUrl { get; set; }
            public List<Category> childMenu { get; set; }
        }
        public class NewsCategory
        {
            public int id { get; set; }
            public string name { get; set; }
            public string nameSlug { get; set; }
        }
    }
}