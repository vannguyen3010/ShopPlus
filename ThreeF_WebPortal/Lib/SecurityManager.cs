using ThreeF_WebPortal.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace ThreeF_WebPortal.Lib
{
    public class SecurityManager
    {
        public class M_AccountSecurity
        {
            public string accountId { get; set; }
            public string userId { get; set; }
            public string userName { get; set; }
            public string password { get; set; }
            public string name { get; set; }
            public string accessToken { get; set; }
            public string shoppingCartId { get; set; }
            public string avatar { get; set; }
            public string role { get; set; }
            public bool stayLoggedIn { get; set; }
            public long expiredTime { get; set; }
            public int timeOut { get; set; } = 30;
        }
        private IEnumerable<Claim> getUserClaims(M_AccountSecurity account)
        {
            return new List<Claim>()
            {
                new Claim("AccountId", account.accountId),
                new Claim("UserId", account.userId),
                new Claim(ClaimTypes.NameIdentifier, account.userName),
                new Claim(ClaimTypes.Name, account.name),
                new Claim("Password", account.password),
                new Claim("Avatar", account.avatar),
                new Claim("AccessToken", account.accessToken),
                new Claim("TimeCheck", Utilities.DateTimeToLong(DateTime.UtcNow.AddHours(7).AddMinutes(CommonConstants.TIMEOUT_CHECK_AUTHENTICATION)).ToString()),
                new Claim("ExpiredTime", account.expiredTime.ToString()),
                new Claim("ShoppingCartId", account.shoppingCartId.ToString())
            };
        }
        public async void SignIn(HttpContext httpContext, M_AccountSecurity account, string scheme)
        {
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(getUserClaims(account), scheme);
            ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
            await httpContext.SignInAsync(
                scheme: scheme, 
                principal: claimsPrincipal,
                properties: new AuthenticationProperties
                {
                    IsPersistent = account.stayLoggedIn,
                    ExpiresUtc = DateTime.UtcNow.AddHours(7).AddMinutes(account.timeOut)
                });
        }
        public async void SignOut(HttpContext httpContext, string scheme)
        {
            if (httpContext.Request.Cookies.Count > 0)
            {
                httpContext.Response.Cookies.Delete("Authentication");
                //foreach (var cookie in httpContext.Request.Cookies.Keys)
                //    httpContext.Response.Cookies.Delete(cookie);
            }
            await httpContext.SignOutAsync(scheme);
            httpContext.Session.Clear();
        }
    }
}
