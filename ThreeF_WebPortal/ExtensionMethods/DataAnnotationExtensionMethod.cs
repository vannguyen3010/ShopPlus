using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Linq;

namespace ThreeF_WebPortal.ExtensionMethods
{
    public static class DataAnnotationExtensionMethod
    {
        public static string GetErrorMessage(this Controller controllers)
        {
            string error = "";
            var errors = controllers.ModelState.Select(x => x.Value.Errors).Where(y => y.Count > 0).ToList();
            foreach (var errs in errors)
                foreach (var item in errs)
                    error += $"{item.ErrorMessage}<br/>";
            return error;
        }

        public static string GetErrorMessage(ModelStateDictionary modelState)
        {
            string error = "";
            var errors = modelState.Where(w => w.Value.ValidationState == ModelValidationState.Invalid).ToList();
            errors.ForEach(item =>
            {
                //error += $"Key: {item.Key}; Value: {item.Value.ValidationState}; Message: {item.Value.Errors.Select(s => s.ErrorMessage).First()}";
                //error += $"{item.Key}: {item.Value.Errors.Select(s => s.ErrorMessage).First()}<br/>";
                error += $"{item.Value.Errors.Select(s => s.ErrorMessage).First()}<br/>";
            });
            return error;
        }
    }
}
