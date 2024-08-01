using ThreeF_WebPortal.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static System.String;

namespace ThreeF_WebPortal.ExtensionMethods
{
	public static class SetViewDataSEOExtensionMethod
	{
		public static void SetViewDataSEODefaultAll(this Controller controller, VM_ViewDataSEO model)
		{
			var supplierInfo = controller.ViewBag.SupplierInfo;
            controller.ViewData["Title"] = IsNullOrEmpty(model.Title) ? supplierInfo?.name : model.Title;
			controller.ViewData["Keywords"] = IsNullOrEmpty(model.Keywords) ? supplierInfo?.name : model.Keywords;
			controller.ViewData["Description"] = $"{(IsNullOrEmpty(model.Description) ? supplierInfo?.description : model.Description)} | {supplierInfo?.name}";
			controller.ViewData["ImagePreview"] = IsNullOrEmpty(model.Image) ? supplierInfo?.imageObj?.mediumUrl : model.Image;
		}
		public static void SetViewDataSEODefaultAllStaticImagePrevice(this Controller controller, VM_ViewDataSEO model)
        {
            var supplierInfo = controller.ViewBag.SupplierInfo;
            controller.ViewData["Title"] = IsNullOrEmpty(model.Title) ? supplierInfo?.name : model.Title;
			controller.ViewData["Keywords"] = IsNullOrEmpty(model.Keywords) ? supplierInfo?.name : model.Keywords;
			controller.ViewData["Description"] = IsNullOrEmpty(model.Description) ? supplierInfo?.description : model.Description;
			controller.ViewData["ImagePreview"] = $"https://{controller.HttpContext.Request.Host}{model.Image}";
		}
		public static void SetViewDataSEOCustom(this Controller controller, VM_ViewDataSEO model)
        {
            var supplierInfo = controller.ViewBag.SupplierInfo;
            controller.ViewData["Title"] = model.Title;
			controller.ViewData["Keywords"] = model.Keywords;
			controller.ViewData["Description"] = model.Description;
			controller.ViewData["ImagePreview"] = IsNullOrEmpty(model.Image) ? supplierInfo?.imageObj?.mediumUrl : model.Image;
		}
		public static void SetViewDataSEOCustomStaticImagePrevice(this Controller controller, VM_ViewDataSEO model)
		{
			controller.ViewData["Title"] = model.Title;
			controller.ViewData["Keywords"] = model.Keywords;
			controller.ViewData["Description"] = model.Description;
			controller.ViewData["ImagePreview"] = $"https://{controller.HttpContext.Request.Host}{model.Image}";
		}
	}
}
