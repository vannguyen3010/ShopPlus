using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ThreeF_WebPortal.ExtensionMethods;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;

namespace ThreeF_WebPortal.Controllers
{
    public class ContactController : BaseController<ContactController>
    {
        private readonly IS_Contact _s_Contact;
        private readonly IConfiguration _configuration;
        private readonly IOptions<Config_MetaSEO> _metaSEO;

        public ContactController(IS_Contact contact, IConfiguration configuration, IOptions<Config_MetaSEO> metaSEO)
        {
            _s_Contact = contact;
            _configuration = configuration;
            _metaSEO = metaSEO;
        }
        public IActionResult Index()
        {
            SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, _metaSEO.Value.Contact);
            ViewData["KeyGoogleMap"] = _configuration.GetValue<string>("KeyGoogleMap");
            return View();
        }

        [HttpPost, ValidateAntiForgeryToken]
        public async Task<JsonResult> SubmitContact(EM_Contact model)
        {
            M_JResult jResult = new M_JResult();
            if (!ModelState.IsValid)
            {
                jResult.error = new error(0, DataAnnotationExtensionMethod.GetErrorMessage(ModelState));
                return Json(jResult);
            }
            model.supplierId = Convert.ToInt32(_supplierId);
            model.createdBy = string.IsNullOrEmpty(_userId) ? 0 : int.Parse(_userId);
            var res = await _s_Contact.Create<M_Contact>(model);
            return Json(jResult.MapData(res));
        }
    }
}
