using AutoMapper;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using static System.String;

namespace ThreeF_WebPortal.Middlewares
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class ConfigureDomainMiddleware
    {
        private readonly ILogger<ConfigureDomainMiddleware> _logger;
        private readonly RequestDelegate _next;
        private readonly IMapper _mapper;
        private readonly IS_SupplierConfigure _s_SupplierConfigure;
        private readonly IS_Supplier _s_Supplier;

        public ConfigureDomainMiddleware(ILogger<ConfigureDomainMiddleware> logger, RequestDelegate next, IMapper mapper, IS_SupplierConfigure s_SupplierConfigure, IS_Supplier supplier)
        {
            _logger = logger;
            _next = next;
            _mapper = mapper;
            _s_SupplierConfigure = s_SupplierConfigure;
            _s_Supplier = supplier;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            try
            {
                if (httpContext.Request.RouteValues["controller"] != null && httpContext.Request.RouteValues["controller"].ToString() != "Error")
                    await SetInfoShopCookies(httpContext, GlobalVariables.is_development ? GlobalVariables.default_site_portal : httpContext.Request.Host.ToString());
            }
            catch (Exception ex)
            {
                _logger.LogWarning("DomainConfigSection[Method=Invoke]: Exception: " + ex.Message);
                if (httpContext.Request.Headers["x-requested-with"] == "XMLHttpRequest")
                    httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                else
                    httpContext.Response.Redirect("/error/500");
            }
            await _next(httpContext);
        }

        private async Task SetInfoShopCookies(HttpContext httpContext, string hostName)
        {
            try
            {
                bool isGetNewInfo = false;
                var infoShopCookies = httpContext.Request.Cookies["shop_info"];
                if (IsNullOrEmpty(infoShopCookies))
                    isGetNewInfo = true;
                else
                {
                    var infoShop = JsonConvert.DeserializeObject<VM_Supplier>(infoShopCookies);
                    if (hostName != infoShop.url)
                        isGetNewInfo = true;
                }

                if (isGetNewInfo) //get new shop info
                {
                    var domainCheck = await _s_SupplierConfigure.checkExistsDomain<List<M_SupplierConfigure>>(hostName);
                    if (domainCheck.result == 0 && domainCheck.data != null && domainCheck.data.FirstOrDefault().status == 1)
                    {
                        if (domainCheck.data.FirstOrDefault().expirationDate != null && domainCheck.data.FirstOrDefault().expirationDate.Value.Date < DateTime.UtcNow.AddHours(7).Date)
                        {
                            if (httpContext.Request.Headers["x-requested-with"] == "XMLHttpRequest")
                                httpContext.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                            else
                                httpContext.Response.Redirect("/expired-domain");
                        }
                        else
                        {
                            //Set cookies shop info
                            var infoShop = await _s_Supplier.getHubSupplierById<M_Supplier>(domainCheck.data.FirstOrDefault()?.supplierId.ToString());
                            if (infoShop.result == 1 && infoShop.data != null)
                            {
                                var infoObj = _mapper.Map<VM_Supplier>(infoShop.data);
                                infoObj.id = Encryptor.Encrypt(infoObj.id);
                                CookieOptions option = new CookieOptions();
                                option.Expires = new DateTimeOffset(DateTime.Now.AddMinutes(10));
                                option.SameSite = SameSiteMode.Lax;
                                option.Secure = true;
                                ExtensionMethods.CookieHandleExtensionMethod.AddOrUpdate(httpContext, "shop_info", JsonConvert.SerializeObject(infoObj), option);
                            }
                        }
                    }
                    else
                    {
                        _logger.LogWarning("DomainConfigSection[Method=SetInfoShopCookies]: isGetNewInfo=" + isGetNewInfo);
                        _logger.LogWarning("DomainConfigSection[Method=SetInfoShopCookies]: domainCheckAPI=" + JsonConvert.SerializeObject(domainCheck));
                        if (httpContext.Request.Headers["x-requested-with"] == "XMLHttpRequest")
                            httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                        else
                            httpContext.Response.Redirect("/error/404");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("DomainConfigSection[Method=SetInfoShopCookies]: Exception: " + ex.Message);
            }
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class ConfigDomainSectionMiddlewareExtensions
    {
        public static IApplicationBuilder UseConfigDomainSectionMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ConfigureDomainMiddleware>();
        }
    }
}
