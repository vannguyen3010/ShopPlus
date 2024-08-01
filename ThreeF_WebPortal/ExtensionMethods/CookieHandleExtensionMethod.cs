using Microsoft.AspNetCore.Http;
using System;

namespace ThreeF_WebPortal.ExtensionMethods
{
    public static class CookieHandleExtensionMethod
    {
        public static void ClearAll(this HttpContext httpContext)
        {
            foreach (var cookie in httpContext.Request.Cookies)
            {
                httpContext.Response.Cookies.Delete(cookie.Key);
            }
        }
        public static void ClearAll(this IHttpContextAccessor httpContextAccessor)
        {
            foreach (var cookie in httpContextAccessor.HttpContext.Request.Cookies)
            {
                httpContextAccessor.HttpContext.Response.Cookies.Delete(cookie.Key);
            }
        }
        public static void Remove(this HttpContext httpContext, string key)
        {
            httpContext.Response.Cookies.Delete(key);
        }
        public static void Remove(this IHttpContextAccessor httpContextAccessor, string key)
        {
            httpContextAccessor.HttpContext.Response.Cookies.Delete(key);
        }
        public static void AddOrUpdate(this HttpContext httpContext, string key, string value, CookieOptions option)
        {
            httpContext.Response.Cookies.Delete(key);
            httpContext.Response.Cookies.Append(key, value, option);
        }
        public static void AddOrUpdate(this IHttpContextAccessor httpContextAccessor, string key, string value, CookieOptions option)
        {
            httpContextAccessor.HttpContext.Response.Cookies.Delete(key);
            httpContextAccessor.HttpContext.Response.Cookies.Append(key, value, option);
        }
        public static void AddOrUpdate(this HttpContext httpContext, string key, string value, DateTime? expireTime)
        {
            CookieOptions option = new CookieOptions();
            option.Expires = expireTime.HasValue ? new DateTimeOffset(expireTime.Value) : new DateTimeOffset(DateTime.Now.AddMinutes(10));
            option.SameSite = SameSiteMode.Lax;
            option.Secure = true;
            httpContext.Response.Cookies.Delete(key);
            httpContext.Response.Cookies.Append(key, value, option);
        }
        public static void AddOrUpdate(this IHttpContextAccessor httpContextAccessor, string key, string value, DateTime? expireTime)
        {
            CookieOptions option = new CookieOptions();
            option.Expires = expireTime.HasValue ? new DateTimeOffset(expireTime.Value) : new DateTimeOffset(DateTime.Now.AddMinutes(10));
            option.SameSite = SameSiteMode.Lax;
            option.Secure = true;
            httpContextAccessor.HttpContext.Response.Cookies.Delete(key);
            httpContextAccessor.HttpContext.Response.Cookies.Append(key, value, option);
        }
        public static string Get(this HttpContext httpContext, string key)
        {
            return httpContext.Request.Cookies[key];
        }
        public static string Get(this IHttpContextAccessor httpContextAccessor, string key)
        {
            return httpContextAccessor.HttpContext.Request.Cookies[key];
        }
    }
}
