using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ThreeF_WebPortal.ExtensionMethods
{
    public static class ClaimsExtensionMethod
    {
        public static async Task<bool> AddUpdateClaimAsync(this AuthorizationFilterContext context, string key, string value)
        {
            try
            {
                var identity = context.HttpContext.User.Identity as ClaimsIdentity;
                if (identity == null || identity.Claims.Count() == 0)
                {
                    return false;
                }

                //Check for existing claim and remove it
                var existingClaim = identity.FindFirst(key);
                if (existingClaim != null)
                {
                    identity.RemoveClaim(existingClaim);
                }

                //Add new claim
                identity.AddClaim(new Claim(key, value));

                //Refreshing claim
                await context.HttpContext.SignOutAsync(
                    scheme: CookieAuthenticationDefaults.AuthenticationScheme);
                await context.HttpContext.SignInAsync(
                    scheme: CookieAuthenticationDefaults.AuthenticationScheme,
                    principal: new ClaimsPrincipal(identity),
                    properties: new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTime.Now.AddDays(7)
                    });
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static async Task<bool> AddUpdateClaimAsync(this HttpContext context, string key, string value)
        {
            try
            {
                var identity = context.User.Identity as ClaimsIdentity;
                if (identity == null || identity.Claims.Count() == 0)
                {
                    return false;
                }

                //Check for existing claim and remove it
                var existingClaim = identity.FindFirst(key);
                if (existingClaim != null)
                {
                    identity.RemoveClaim(existingClaim);
                }

                //Add new claim
                identity.AddClaim(new Claim(key, value));

                //Refreshing claim
                await context.SignOutAsync(
                    scheme: CookieAuthenticationDefaults.AuthenticationScheme);
                await context.SignInAsync(
                    scheme: CookieAuthenticationDefaults.AuthenticationScheme,
                    principal: new ClaimsPrincipal(identity),
                    properties: new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTime.Now.AddDays(30)
                    });
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static async Task<bool> AddUpdateClaimAsync(this IHttpContextAccessor context, string key, string value)
        {
            try
            {
                var identity = context.HttpContext.User.Identity as ClaimsIdentity;
                if (identity == null || identity.Claims.Count() == 0)
                {
                    return false;
                }

                //Check for existing claim and remove it
                var existingClaim = identity.FindFirst(key);
                if (existingClaim != null)
                {
                    identity.RemoveClaim(existingClaim);
                }

                //Add new claim
                identity.AddClaim(new Claim(key, value));

                //Refreshing claim
                await context.HttpContext.SignOutAsync(
                    scheme: CookieAuthenticationDefaults.AuthenticationScheme);
                await context.HttpContext.SignInAsync(
                    scheme: CookieAuthenticationDefaults.AuthenticationScheme,
                    principal: new ClaimsPrincipal(identity),
                    properties: new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTime.Now.AddDays(7)
                    });
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static async Task<bool> AddUpdateClaimAsync(this IHttpContextAccessor context, string key, List<string> value)
        {
            try
            {
                var identity = context.HttpContext.User.Identity as ClaimsIdentity;
                if (identity == null || identity.Claims.Count() == 0)
                {
                    return false;
                }

                //Check for existing claim and remove it
                var existingClaim = identity.FindFirst(key);
                if (existingClaim != null)
                {
                    identity.RemoveClaim(existingClaim);
                }

                //Add new claim
                value.ForEach(i => identity.AddClaim(new Claim(key, i)));

                //Refreshing claim
                await context.HttpContext.SignOutAsync(
                    scheme: CookieAuthenticationDefaults.AuthenticationScheme);
                await context.HttpContext.SignInAsync(
                    scheme: CookieAuthenticationDefaults.AuthenticationScheme,
                    principal: new ClaimsPrincipal(identity),
                    properties: new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTime.Now.AddDays(7)
                    });
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static async Task<bool> AddUpdateClaimAsync(this HttpContext context, string key, List<string> value)
        {
            try
            {
                var identity = context.User.Identity as ClaimsIdentity;
                if (identity == null || identity.Claims.Count() == 0)
                {
                    return false;
                }

                //Check for existing claim and remove it
                var existingClaim = identity.FindAll(key).ToList();
                if (existingClaim != null)
                {
                    existingClaim.ForEach(x => identity.RemoveClaim(x));
                }

                //Add new claim
                value.ForEach(i => identity.AddClaim(new Claim(key, i)));

                //Refreshing claim
                await context.SignOutAsync(
                    scheme: CookieAuthenticationDefaults.AuthenticationScheme);
                await context.SignInAsync(
                    scheme: CookieAuthenticationDefaults.AuthenticationScheme,
                    principal: new ClaimsPrincipal(identity),
                    properties: new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTime.Now.AddDays(7)
                    });
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static async Task<bool> AddUpdateClaimAsync(this IHttpContextAccessor context, Dictionary<string, dynamic> dict)
        {
            try
            {
                var identity = context.HttpContext.User.Identity as ClaimsIdentity;
                if (identity == null || identity.Claims.Count() == 0)
                    return false;

                foreach (KeyValuePair<string, dynamic> item in dict)
                {
                    //Check for existing claim and remove it
                    var existingClaim = identity.FindFirst(item.Key);
                    if (existingClaim != null)
                        identity.RemoveClaim(existingClaim);
                }
                foreach (KeyValuePair<string, dynamic> item in dict)
                {
                    identity.AddClaim(new Claim(item.Key, $"{item.Value}"));//Add new claim
                }

                var isPersistent = Convert.ToBoolean(identity.FindFirst("isPersistent").Value);
                var intervalTime = (int?)(Convert.ToInt32(identity.FindFirst("intervalTime").Value));
                DateTimeOffset? cookiesIntervalTimeOut = (isPersistent) ? DateTime.UtcNow.AddDays(intervalTime ?? 30) : DateTime.UtcNow.AddHours(intervalTime ?? 30); // 60 * 24 * 30 : 30;
                //Refreshing claim
                await context.HttpContext.SignOutAsync(scheme: CookieAuthenticationDefaults.AuthenticationScheme);
                await context.HttpContext.SignInAsync(
                    scheme: CookieAuthenticationDefaults.AuthenticationScheme,
                    principal: new ClaimsPrincipal(identity),
                    properties: new AuthenticationProperties
                    {
                        AllowRefresh = true,
                        ExpiresUtc = cookiesIntervalTimeOut,
                        IsPersistent = isPersistent,
                        IssuedUtc = DateTime.UtcNow
                    });
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static string GetClaim(HttpContext context, string key)
        {
            var identity = context.User.Identity as ClaimsIdentity;
            if (identity == null || identity.Claims.Count() == 0)
            {
                return string.Empty;
            }

            //Check for existing claim and get it
            var existingClaim = identity.FindFirst(key);
            if (existingClaim != null)
            {
                return existingClaim.Value;
            }
            return string.Empty;
        }
        public static string GetClaim(IHttpContextAccessor context, string key)
        {
            var identity = context.HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null || identity.Claims.Count() == 0)
            {
                return string.Empty;
            }

            //Check for existing claim and get it
            var existingClaim = identity.FindFirst(key);
            if (existingClaim != null)
            {
                return existingClaim.Value;
            }
            return string.Empty;
        }
    }
}
