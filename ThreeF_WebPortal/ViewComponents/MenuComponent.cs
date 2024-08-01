using ThreeF_WebPortal.Models;
using Microsoft.AspNetCore.Mvc;

namespace ThreeF_WebPortal.ViewComponents
{
    [ViewComponent(Name = "Menu")]
    public class MenuComponent : ViewComponent
    {
        public IViewComponentResult Invoke(M_Supplier model)
        {
            return View("Default", model);
        }
    }
}
