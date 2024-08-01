using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ThreeF_WebPortal.ExtensionMethods;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using ThreeF_WebPortal.ViewModels;
using static System.String;
using static ThreeF_WebPortal.Lib.SecurityManager;

namespace ThreeF_WebPortal.Controllers
{
    public class AccountController : BaseController<AccountController>
    {
        private readonly SecurityManager _securityManager = new SecurityManager();
        private readonly IS_Account _s_Account;
        private readonly IS_Person _s_Person;
        private readonly IS_VertifyPhone _s_VertifyPhone;
        private readonly IConfiguration _configuration;

        public AccountController(IS_Account account, IS_Person person, IS_VertifyPhone vertifyPhone, IConfiguration configuration)
        {
            _s_Account = account;
            _s_Person = person;
            _s_VertifyPhone = vertifyPhone;
            _configuration = configuration;
        }

        #region Login
        private async Task<ResponseData<M_Account>> LoginFunc(EM_AccountSignIn model, int timeOut = 30)
        {
            var res = await _s_Account.LoginHub<M_Account>(model, _supplierId, timeOut);
            if (res.result != 1 || res.data == null)
            {
                return res;
            }
            //SignIn success
            M_AccountSecurity account = new M_AccountSecurity()
            {
                accountId = res.data.id.ToString(),
                userId = res.data.personId?.ToString(),
                shoppingCartId = res.data.shoppingCartId?.ToString(),
                name = res.data.personObj?.lastName + " " + res.data.personObj?.firstName,
                userName = model.userName,
                password = Encryptor.Encrypt(model.password),
                avatar = IsNullOrEmpty(res.data.imageObj?.smallUrl) ? "" : res.data.imageObj?.smallUrl,
                accessToken = res.data.access_token,
                stayLoggedIn = model.stayLoggedIn,
                expiredTime = Utilities.DateTimeToLong(DateTime.UtcNow.AddHours(7).AddMinutes(timeOut)),
                timeOut = timeOut,
            };
            _securityManager.SignIn(this.HttpContext, account, CookieAuthenticationDefaults.AuthenticationScheme);
            return res;
        }
        #endregion

        #region Sign in & Sign out
        [HttpGet, AllowAnonymous]
        public IActionResult SignIn()
        {
            if (User.Identity.IsAuthenticated)
                return Redirect("/");
            SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, new VM_ViewDataSEO
            {
                Keywords = "Đăng nhập",
                Title = "Đăng nhập",
                Description = "Đăng nhập",
            });
            return View();
        }

        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<JsonResult> SignIn(EM_AccountSignIn model, string returnUrl)
        {
            M_JResult jResult = new M_JResult();
            if (!ModelState.IsValid)
            {
                jResult.error = new error(0, DataAnnotationExtensionMethod.GetErrorMessage(this));
                return Json(jResult);
            }

            //Check is stayLogin, if true set time 30 days
            int timeOut = model.stayLoggedIn ? 60 * 24 * 30 : 30; //Minute
            var res = await LoginFunc(model, timeOut);
            if (res.result != 1 || res.data == null)
                return Json(jResult.MapData(res));
            return Json(jResult.MapData(res, returnUrl));
        }

        public IActionResult SignOut(string returnUrl, string autoLogout)
        {
            _securityManager.SignOut(this.HttpContext, CookieAuthenticationDefaults.AuthenticationScheme);
            //Auto logout when other user signin
            //if (autoLogout != null)
            //{
            //    TempData["AutoLogoutMessage"] = "Tài khoản của bạn vừa được truy cập ở một nơi khác!";
            //}
            if (!IsNullOrEmpty(returnUrl))
                return Redirect($"/account/signin?returnUrl={returnUrl}");
            return Redirect("/account/signin");
        }

        [HttpPost, Authorize]
        public async Task<JsonResult> SignOutJs()
        {
            M_JResult jResult = new M_JResult();
            try
            {
                //Check expiredTime ~ isStayLogin
                var expirecTime = ClaimsExtensionMethod.GetClaim(_httpContextAccessor, "ExpiredTime");
                string time = !IsNullOrEmpty(expirecTime) ? expirecTime : "0";
                long now = Utilities.DateTimeToLong(DateTime.UtcNow.AddHours(7));
                if (now > Convert.ToInt32(time))
                    return Json(jResult);

                //Get username password
                EM_AccountSignIn model = new EM_AccountSignIn
                {
                    userName = _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value,
                    password = Encryptor.Decrypt(_httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "Password")?.Value),
                };

                var res = await _s_Account.LoginHub<M_Account>(model, _supplierId, 30);
                if (res.result == 1 || res.data != null)
                    await ClaimsExtensionMethod.AddUpdateClaimAsync(_httpContextAccessor, "AccessToken", res.data.access_token);
                jResult.result = res.result;
                jResult.error = res.error;
            }
            catch (Exception ex)
            {
                jResult.result = -1;
                jResult.error = new error(0, $"Exception: {ex.Message}");
            }
            return Json(jResult);
        }
        #endregion

        #region Register
        [HttpGet, AllowAnonymous]
        public IActionResult Register()
        {
            if (User.Identity.IsAuthenticated)
                return Redirect("/");
            SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, new VM_ViewDataSEO
            {
                Keywords = "Đăng ký",
                Title = "Đăng ký",
                Description = "Đăng ký",
            });
            return View();
        }

        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<JsonResult> Register(EM_AccountRegister model, string returnUrl)
        {
            M_JResult jResult = new M_JResult();
            if (!ModelState.IsValid)
            {
                jResult.error = new error(0, DataAnnotationExtensionMethod.GetErrorMessage(this));
                return Json(jResult);
            }

            model.userName = model.phoneNumber;
            var res = await _s_Account.CreateCustomer<M_Account>(model, _supplierId);
            if (res.result != 1 || res.data == null)
                return Json(jResult.MapData(res));
            return Json(jResult.MapData(res, Encryptor.Encrypt(res.data.vertifyObj?.id.ToString())));
        }

        [HttpPost, AllowAnonymous]
        public async Task<JsonResult> VerifedRegister(string key, string code, string phoneNumber, string password)
        {
            M_JResult jResult = new M_JResult();
            try
            {
                if (IsNullOrEmpty(key) || IsNullOrEmpty(code) || IsNullOrEmpty(phoneNumber))
                {
                    jResult.error = new error(0, "Key hoặc mã hoặc SĐT chưa nhập");
                    return Json(jResult);
                }

                key = Encryptor.Decrypt(key);
                var res = await _s_VertifyPhone.VertifyPhone<M_VertifyPhone>(key, code, phoneNumber);
                bool signInSuccess = false;
                if (res.result == 1 && res.data != null)
                {
                    //Auto login when vertify success
                    EM_AccountSignIn accountSignIn = new EM_AccountSignIn
                    {
                        userName = phoneNumber,
                        password = password
                    };
                    var resSignIn = await LoginFunc(accountSignIn, 60 * 24 * 7); //Login session 7 days
                    if (resSignIn.result == 1 && resSignIn.data != null)
                        signInSuccess = true;
                }
                jResult.result = res.result;
                jResult.data = res.data;
                jResult.data2nd = signInSuccess;
                jResult.error = res.error;
            }
            catch (Exception ex)
            {
                jResult.result = -1;
                jResult.error = new error(0, $"Exception: {ex.Message}");
            }
            return Json(jResult);
        }

        [HttpPost, AllowAnonymous]
        public async Task<JsonResult> ResendVerifiedRegister(string key)
        {
            M_JResult jResult = new M_JResult();
            try
            {
                if (IsNullOrEmpty(key))
                {
                    jResult.error = new error(0, "Chưa có key xác thực");
                    return Json(jResult);
                }

                key = Encryptor.Decrypt(key);
                var res = await _s_VertifyPhone.ResendCode<M_VertifyPhone>(key);
                return Json(jResult.MapData(res));
            }
            catch (Exception ex)
            {
                jResult.result = -1;
                jResult.error = new error(0, $"Exception: {ex.Message}");
            }
            return Json(jResult);
        }
        #endregion

        #region Forgot password
        public IActionResult ForgotPassword()
        {
            SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, new VM_ViewDataSEO
            {
                Keywords = "Quên mật khẩu",
                Title = "Quên mật khẩu",
                Description = "Quên mật khẩu",
            });
            return View();
        }

        [HttpPost, AllowAnonymous]
        public async Task<JsonResult> CheckPhoneForgotPw(EM_ChangePassword model, string phoneNumber)
        {
            M_JResult jResult = new M_JResult();
            if (IsNullOrEmpty(phoneNumber))
            {
                jResult.error = new error(0, "Vui lòng nhập điện thoại");
                return Json(jResult);
            }

            var res = await _s_Account.ForgotPassSMS<M_Account>(model, phoneNumber, _supplierId);
            if (res.result != 1 || res.data == null)
                return Json(jResult.MapData(res));
            return Json(jResult.MapData(res, Encryptor.Encrypt(res.data.vertifyObj?.id.ToString())));
        }

        [HttpPost, AllowAnonymous]
        public async Task<JsonResult> ResetPassword(string key, string code, string phoneNumber, string password)
        {
            M_JResult jResult = new M_JResult();
            try
            {
                if (IsNullOrEmpty(key) || IsNullOrEmpty(code) || IsNullOrEmpty(phoneNumber) || IsNullOrEmpty(password))
                {
                    jResult.error = new error(0, "Key hoặc mã hoặc SĐT hoặc mật khẩu chưa nhập");
                    return Json(jResult);
                }

                key = Encryptor.Decrypt(key);
                var res = await _s_Account.VertifyForgotPassNewPass<M_VertifyPhone>(key, code, phoneNumber, password);
                return Json(jResult.MapData(res));
            }
            catch (Exception ex)
            {
                jResult.result = -1;
                jResult.error = new error(0, $"Exception: {ex.Message}");
            }
            return Json(jResult);
        }

        [HttpPost, AllowAnonymous]
        public async Task<JsonResult> ResendForgotPw(string key)
        {
            M_JResult jResult = new M_JResult();
            if (IsNullOrEmpty(key))
            {
                jResult.error = new error(0, "Chưa có key xác thực");
                return Json(jResult);
            }

            key = Encryptor.Decrypt(key);
            var res = await _s_VertifyPhone.ResendCode<M_VertifyPhone>(key);
            return Json(jResult.MapData(res));
        }
        #endregion

        #region Profile ChangePassword
        [Authorize]
        private async Task<object> ResetToken()
        {
            M_JResult jResult = new M_JResult();
            try
            {
                //Check expiredTime ~ isStayLogin
                var expirecTime = ClaimsExtensionMethod.GetClaim(_httpContextAccessor, "ExpiredTime");
                string time = !IsNullOrEmpty(expirecTime) ? expirecTime : "0";
                long now = Utilities.DateTimeToLong(DateTime.UtcNow.AddHours(7));
                if (now > Convert.ToInt32(time))
                    return new { result = 0 };

                //Get username password
                EM_AccountSignIn model = new EM_AccountSignIn
                {
                    userName = _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value,
                    password = Encryptor.Decrypt(_httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "Password")?.Value),
                };

                var res = await _s_Account.LoginHub<M_Account>(model, _supplierId, 30);
                if (res.result == 1 || res.data != null)
                {
                    await ClaimsExtensionMethod.AddUpdateClaimAsync(_httpContextAccessor, "AccessToken", res.data.access_token);
                    return new { result = 1, access_token = res.data.access_token };
                }
                else
                    return new { result = 0 };
            }
            catch (Exception)
            {
                return new { result = 0 };
            }
        }

        [HttpGet, Authorize]
        public async Task<IActionResult> Profile()
        {
            var res = await _s_Person.getHubPersonByIdStatus<M_Person>(_accessToken);

            //Check expiredTime accessToken
            if (res.result == -1 && res.error.code == 408)
            {
                dynamic resetToken = await ResetToken();
                if (resetToken.result == 1)
                    res = await _s_Person.getHubPersonByIdStatus<M_Person>(_accessToken);
                else
                    return Redirect("/error/408");
            }

            if (res.result != 1 || res.data == null)
                return Redirect($"/error/{res.error.code}");
            SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, new VM_ViewDataSEO
            {
                Keywords = "Thông tin tài khoản",
                Title = "Thông tin tài khoản",
                Description = "Thông tin tài khoản",
            });
            ViewData["KeyGoogleMap"] = _configuration.GetValue<string>("KeyGoogleMap");
            return PartialView(_mapper.Map<EM_Person>(res.data));
        }

        [HttpPost, Authorize, ValidateAntiForgeryToken]
        public async Task<JsonResult> EditProfile(EM_Person model)
        {
            M_JResult jResult = new M_JResult();
            if (!ModelState.IsValid)
            {
                jResult.error = new error(0, DataAnnotationExtensionMethod.GetErrorMessage(this));
                return Json(jResult);
            }
            model.id = _accessToken;
            model.updatedBy = IsNullOrEmpty(_userId) ? 0 : int.Parse(_userId);
            model.timer = DateTime.UtcNow.AddHours(7);
            model.status = 1;
            var res = await _s_Person.UpdateCustomer<M_Person>(_accessToken, model);

            if (res.result != 1 || res.data == null) return Json(jResult.MapData(res));
            var data = _mapper.Map<EM_Person>(res.data);
            await ClaimsExtensionMethod.AddUpdateClaimAsync(_httpContextAccessor, ClaimTypes.Name, data.lastName + " " + data.firstName);
            await ClaimsExtensionMethod.AddUpdateClaimAsync(_httpContextAccessor, "Avatar", IsNullOrEmpty(data.imageUrl) ? "" : data.imageUrl);
            return Json(jResult.MapData(res));
        }

        [HttpGet, Authorize]
        public IActionResult P_ChangePassword()
        {
            return PartialView();
        }

        [HttpPost, Authorize, ValidateAntiForgeryToken]
        public async Task<JsonResult> P_ChangePassword(EM_ChangePassword model)
        {
            M_JResult jResult = new M_JResult();
            if (!ModelState.IsValid)
            {
                jResult.error = new error(0, DataAnnotationExtensionMethod.GetErrorMessage(this));
                return Json(jResult);
            }

            var res = await _s_Account.ChangePassComparePass<M_Account>(_accessToken, model.password, model.newPassword);
            if (res.result != 1 || res.data == null)
                return Json(jResult.MapData(res));
            await ClaimsExtensionMethod.AddUpdateClaimAsync(_httpContextAccessor, "Password", Encryptor.Encrypt(model.newPassword));
            return Json(jResult.MapData(res));
        }
        #endregion
    }
}
