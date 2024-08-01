using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using static System.String;

namespace ThreeF_WebPortal.Middlewares
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class AuthenticationAccountMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IS_Person _s_Person;

        public AuthenticationAccountMiddleware(RequestDelegate next, IS_Person s_Person)
        {
            _next = next;
            _s_Person = s_Person;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            var controller = httpContext.Request.RouteValues["controller"];
            if (controller != null && controller.ToString() != "Error")
            {
                if (httpContext.User.Identity.IsAuthenticated)
                {
                    var timeout = ExtensionMethods.ClaimsExtensionMethod.GetClaim(httpContext, "TimeCheck");
                    string time = !IsNullOrEmpty(timeout) ? timeout : "0";
                    long now = Utilities.DateTimeToLong(DateTime.UtcNow.AddHours(7));
                    if (now > Convert.ToInt32(time))
                    {
                        //Each 10 minutes check account active
                        var accessToken = httpContext.User.Claims.FirstOrDefault(c => c.Type == "AccessToken")?.Value;
                        var getInfoUser = await _s_Person.getHubPersonByIdStatus<M_Person>(accessToken);
                        if (getInfoUser.result == 1 && getInfoUser.data != null)
                        {
                            if (getInfoUser.data.accountObj?.status == 1)
                                await ExtensionMethods.ClaimsExtensionMethod.AddUpdateClaimAsync(httpContext, "TimeCheck", Utilities.DateTimeToLong(DateTime.UtcNow.AddHours(7).AddMinutes(CommonConstants.TIMEOUT_CHECK_AUTHENTICATION)).ToString());
                            else
                            {
                                if (httpContext.Request.Headers["x-requested-with"] == "XMLHttpRequest")
                                    httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                                else
                                    httpContext.Response.Redirect("/account/signout");
                            }
                        }
                    }
                }
            }
            await _next(httpContext);
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class AuthenticationAccountMiddlewareExtensions
    {
        public static IApplicationBuilder UseAuthenticationAccountMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuthenticationAccountMiddleware>();
        }
    }
}
