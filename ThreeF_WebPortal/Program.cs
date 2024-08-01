

using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Mapper;
using ThreeF_WebPortal.Middlewares;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Net;
using System.Net.Http.Headers;
using Microsoft.VisualStudio.Web.CodeGeneration.Design;

void GetDefaultHttpClient(IServiceProvider serviceProvider, HttpClient httpClient, string hostUri)
{
    if (!string.IsNullOrEmpty(hostUri))
        httpClient.BaseAddress = new Uri(hostUri);
    //client.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue { NoCache = true };
    httpClient.Timeout = TimeSpan.FromMinutes(1);
    httpClient.DefaultRequestHeaders.Clear();
    httpClient.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml+json");
    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
}

HttpClientHandler GetDefaultHttpClientHandler()
{
    return new HttpClientHandler
    {
        AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate,
        UseCookies = false,
        AllowAutoRedirect = false,
        UseDefaultCredentials = true,
    };
}

var builder = WebApplication.CreateBuilder(args);

// Add builder.Services to the container.
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
{
    options.Cookie = new CookieBuilder
    {
        //Domain = ".koolselling.com", //Releases in active
        Name = "Authentication",
        HttpOnly = true,
        Path = "/",
        SameSite = SameSiteMode.Lax,
        SecurePolicy = CookieSecurePolicy.Always
    };
    options.LoginPath = new PathString("/Account/SignIn");
    options.LogoutPath = new PathString("/Account/SignOut");
    options.AccessDeniedPath = new PathString("/Error/403");
    options.SlidingExpiration = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddSession(options =>
{
    //options.Cookie.Domain = ".koolselling.com"; //Releases in active
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.IsEssential = true;
    options.Cookie.HttpOnly = true;
});

builder.Services.AddAutoMapper(typeof(AutoMapperProfile).Assembly); //AutoMapperProfile
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddHttpClient("base")
    .ConfigureHttpClient((serviceProvider, httpClient) => GetDefaultHttpClient(serviceProvider, httpClient, builder.Configuration.GetSection("ApiSettings:UrlApi").Value))
    .SetHandlerLifetime(TimeSpan.FromMinutes(5)) //Default is 2 min
    .ConfigurePrimaryHttpMessageHandler(x => GetDefaultHttpClientHandler());

builder.Services.AddHttpClient("custom")
    .ConfigureHttpClient((serviceProvider, httpClient) => GetDefaultHttpClient(serviceProvider, httpClient, string.Empty))
    .SetHandlerLifetime(TimeSpan.FromMinutes(5)) //Default is 2 min
    .ConfigurePrimaryHttpMessageHandler(x => GetDefaultHttpClientHandler());

builder.Services.AddSingleton<IBase_CallApi, Base_CallApi>();
builder.Services.AddSingleton<ICallBaseApi, CallBaseApi>();
builder.Services.AddSingleton<ICallExternalApi, CallExternalApi>();
builder.Services.AddSingleton<ICallApi, CallApi>();
builder.Services.AddSingleton<IS_Image, S_Image>();
builder.Services.AddSingleton<IS_Account, S_Account>();
builder.Services.AddSingleton<IS_Address, S_Address>();
builder.Services.AddSingleton<IS_BankSupplier, S_BankSupplier>();
builder.Services.AddSingleton<IS_BankPerson, S_BankPerson>();
builder.Services.AddSingleton<IS_Category, S_Category>();
builder.Services.AddSingleton<IS_Contact, S_Contact>();
builder.Services.AddSingleton<IS_DeliveryAddress, S_DeliveryAddress>();
builder.Services.AddSingleton<IS_Banner, S_Banner>();
builder.Services.AddSingleton<IS_Supplier, S_Supplier>();
builder.Services.AddSingleton<IS_News, S_News>();
builder.Services.AddSingleton<IS_NewsCategory, S_NewsCategory>();
builder.Services.AddSingleton<IS_Order, S_Order>();
builder.Services.AddSingleton<IS_OrderItem, S_OrderItem>();
builder.Services.AddSingleton<IS_Payment, S_Payment>();
builder.Services.AddSingleton<IS_Person, S_Person>();
builder.Services.AddSingleton<IS_Product, S_Product>();
builder.Services.AddSingleton<IS_ProductGift, S_ProductGift>();
builder.Services.AddSingleton<IS_TradeMark, S_TradeMark>();
builder.Services.AddSingleton<IS_TypeSize, S_TypeSize>();
builder.Services.AddSingleton<IS_TypeColor, S_TypeColor>();
builder.Services.AddSingleton<IS_Reason, S_Reason>();
builder.Services.AddSingleton<IS_ShoppingCart, S_ShoppingCart>();
builder.Services.AddSingleton<IS_ShippingArea, S_ShippingArea>();
builder.Services.AddSingleton<IS_ShoppingCartItem, S_ShoppingCartItem>();
builder.Services.AddSingleton<IS_SupplierConfigure, S_SupplierConfigure>();
builder.Services.AddSingleton<IS_VertifyPhone, S_VertifyPhone>();
builder.Services.AddSingleton<IS_PropertyFilter, S_PropertyFilter>();
builder.Services.AddSingleton<IS_GoogleMap, S_GoogleMap>();
builder.Services.AddSingleton<IS_GHTK, S_GHTK>();

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages().AddRazorRuntimeCompilation();
builder.Services.Configure<Config_ApiSettings>(builder.Configuration.GetSection("ApiSettings"));
builder.Services.Configure<Config_TokenUploadFile>(builder.Configuration.GetSection("TokenUploadFile"));
builder.Services.Configure<Config_MetaSEO>(builder.Configuration.GetSection("MetaSEO"));
builder.Services.Configure<Config_Supplier>(builder.Configuration.GetSection("Supplier"));
builder.Services.AddMemoryCache();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseStatusCodePagesWithReExecute("/error/{0}");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
else
{
    app.UseDeveloperExceptionPage();
}
//GlobalVariables.SetVariablesEnviroment(/*isDevelop: true  */app.Environment.IsDevelopment()); //Set global url liverun or develop
app.UseMiddleware<SecurityHeadersMiddleware>(); //App config security header

app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        const int durationInSeconds = 7 * 60 * 60 * 24; //7 days
        ctx.Context.Response.Headers[Microsoft.Net.Http.Headers.HeaderNames.CacheControl] =
            "public,max-age=" + durationInSeconds;
    }
});

app.UseRouting();
app.UseCookiePolicy();

app.UseAuthentication(); //Authen of Microsoft login session
app.UseAuthorization();

app.UseSession();

app.UseMiddleware<AuthenticationAccountMiddleware>();
//app.UseMiddleware<ConfigureDomainMiddleware>();
app.UseEndpoints(endpoints =>
{
    #region Product
    endpoints.MapControllerRoute(
        name: "Product",
        pattern: "san-pham",
        defaults: new { controller = "Product", action = "Index" });
    endpoints.MapControllerRoute(
        name: "Detail",
        pattern: "san-pham/{nameSlug}-{id}",
        defaults: new { controller = "Product", action = "ViewDetail" });
    #endregion

    #region News
    endpoints.MapControllerRoute(
        name: "News",
        pattern: "tin-tuc",
        defaults: new { controller = "News", action = "Index" });
    endpoints.MapControllerRoute(
        name: "DetailNews",
        pattern: "tin-tuc/{nameSlug}-{id}",
        defaults: new { controller = "News", action = "ViewDetail" });
    #endregion

    #region About
    endpoints.MapControllerRoute(
        name: "About",
        pattern: "gioi-thieu",
        defaults: new { controller = "About", action = "Index" });
    endpoints.MapControllerRoute(
        name: "DetailAbout",
        pattern: "gioi-thieu/{nameSlug}-{id}",
        defaults: new { controller = "About", action = "ViewDetail" });
    #endregion

    #region Checkout
    endpoints.MapControllerRoute(
        name: "Checkout cart",
        pattern: "checkout/cart",
        defaults: new { controller = "Checkout", action = "Cart" });
    endpoints.MapControllerRoute(
        name: "Checkout payment",
        pattern: "checkout/payment",
        defaults: new { controller = "Checkout", action = "Payment" });
    #endregion

    #region Order
    endpoints.MapControllerRoute(
        name: "Order view",
        pattern: "order/view/{id?}",
        defaults: new { controller = "Order", action = "Views" });
    #endregion

    #region Account
    endpoints.MapControllerRoute(
         name: "Account forgot password",
         pattern: "account/forgot-password",
         defaults: new { controller = "Account", action = "ForgotPassword" });
    endpoints.MapControllerRoute(
         name: "Account addressList",
         pattern: "account/address",
         defaults: new { controller = "Address", action = "Index" });
    endpoints.MapControllerRoute(
         name: "Account profile",
         pattern: "account/profile",
         defaults: new { controller = "Account", action = "Profile" });
    endpoints.MapControllerRoute(
         name: "Account signin",
         pattern: "account/signin",
         defaults: new { controller = "Account", action = "SignIn" });
    endpoints.MapControllerRoute(
         name: "Account signout",
         pattern: "account/signout/{autoLogout}",
         defaults: new { controller = "Account", action = "SignOut" });
    endpoints.MapControllerRoute(
         name: "Account register",
         pattern: "account/register",
         defaults: new { controller = "Account", action = "Register" });
    #endregion

    #region Contact
    endpoints.MapControllerRoute(
        name: "Contact",
        pattern: "lien-he",
        defaults: new { controller = "Contact", action = "Index" });
    endpoints.MapControllerRoute(
        name: "Contact-Success",
        pattern: "lien-he/thanh-cong",
        defaults: new { controller = "Contact", action = "Success" });
    #endregion

    #region Checkout
    endpoints.MapControllerRoute(
        name: "checkoutwithoutlogin cart",
        pattern: "checkoutwithoutlogin/cart",
        defaults: new { controller = "CheckoutWithoutLoginController", action = "Cart" });
    endpoints.MapControllerRoute(
        name: "checkoutwithoutlogin payment",
        pattern: "checkoutwithoutlogin/payment",
        defaults: new { controller = "CheckoutWithoutLoginController", action = "Payment" });
    #endregion

    endpoints.MapControllerRoute(
        name: "Error expired",
        pattern: "expired-domain",
        defaults: new { controller = "Error", action = "ExpiredDomain" });
    endpoints.MapControllerRoute(
        name: "Error status code",
        pattern: "error/{statusCode}",
        defaults: new { controller = "Error", action = "Index" });
    endpoints.MapControllerRoute(
        name: "policy",
        pattern: "policy/{path}",
        defaults: new { controller = "Home", action = "Policy" });
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
});

app.Run();
