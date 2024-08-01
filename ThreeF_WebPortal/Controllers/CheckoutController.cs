using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using ThreeF_WebPortal.EditModels;
using ThreeF_WebPortal.ExtensionMethods;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using ThreeF_WebPortal.ViewModels;
using static System.String;

namespace ThreeF_WebPortal.Controllers
{
    [Authorize]
    public class CheckoutController : BaseController<CheckoutController>
    {
        private readonly IS_DeliveryAddress _s_DeliveryAddress;
        private readonly IS_Payment _s_Payment;
        private readonly IS_ProductGift _s_ProductGift;
        private readonly IS_BankSupplier _s_BankSupplier;
        private readonly IS_BankPerson _s_BankPerson;
        private readonly IS_ShoppingCart _s_ShoppingCart;
        private readonly IS_ShoppingCartItem _s_ShoppingCartItem;
        private readonly IS_Order _s_Order;
        private readonly IS_ShippingArea _s_ShippingArea;
        private readonly IS_GHTK _s_GHTK;

        private readonly IConfiguration _configuration;
        private readonly IOptions<Config_ApiSettings> _apiSettings;
        private readonly string _shoppingCartId;
        private readonly int MAX_QUANTITY = 999;

        public CheckoutController(IS_DeliveryAddress deliveryAddress, IS_Payment payment, IS_ProductGift productGift, IS_BankSupplier bankSupplier, IS_BankPerson bankPerson, IS_ShoppingCart shoppingCart, IS_ShoppingCartItem shoppingCartItem, IS_Order order, IS_ShippingArea shippingArea, IS_GHTK gHTK, IConfiguration configuration, IOptions<Config_ApiSettings> apiSettings, IHttpContextAccessor contextAccessor)
        {
            _s_DeliveryAddress = deliveryAddress;
            _s_Payment = payment;
            _s_ProductGift = productGift;
            _s_BankSupplier = bankSupplier;
            _s_BankPerson = bankPerson;
            _s_ShoppingCart = shoppingCart;
            _s_ShoppingCartItem = shoppingCartItem;
            _s_Order = order;
            _s_ShippingArea = shippingArea;
            _s_GHTK = gHTK;
            _configuration = configuration;
            _apiSettings = apiSettings;
            _shoppingCartId = contextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "ShoppingCartId")?.Value;
        }

        #region Cart
        public IActionResult Cart()
        {
            SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, new VM_ViewDataSEO
            {
                Keywords = "Giỏ hàng",
                Title = "Giỏ hàng",
                Description = "Giỏ hàng",
            });
            return View();
        }

        public async Task<JsonResult> GetCartData()
        {
            M_JResult jResult = new M_JResult();
            if (IsNullOrEmpty(_shoppingCartId))
            {
                jResult.error = new error(0, "Vui lòng đăng nhập lại");
                return Json(jResult);
            }

            var res = await _s_ShoppingCart.getHubShoppingCartByIdStatus(_accessToken, _shoppingCartId);
            if (res.result == 1 && res.data != null)
            {
                List<VM_ShoppingCart> data = new List<VM_ShoppingCart>();
                VM_ShoppingCart dataItem;
                foreach (var item in res.data.shoppingCartItemObj)
                {
                    dataItem = new VM_ShoppingCart();
                    dataItem = _mapper.Map<VM_ShoppingCart>(item);
                    if (item.supplierConfigureObj?.supplierId == int.Parse(_supplierId))
                    {
                        dataItem.productItem = _mapper.Map<List<VM_ShoppingCart.M_ProductItem>>(item.supplierObj.splitShoppingCartObj);
                        data.Add(dataItem);
                    }
                }
                jResult.data = data;
            }
            jResult.result = res.result;
            jResult.error = res.error;
            return Json(jResult);
        }

        [HttpPost, AllowAnonymous]
        public async Task<IActionResult> AddToCart(EM_ShoppingCartItem model)
        {
            M_JResult jResult = new M_JResult();
            if (!User.Identity.IsAuthenticated)
            {
                jResult.result = -1;
                jResult.error = new error(StatusCodes.Status401Unauthorized, Empty);
                return Json(jResult);
            }

            if (model.quantity < 1 || model.quantity > MAX_QUANTITY)
            {
                jResult.error = new error(0, "Số lượng bạn chọn không hợp lệ!");
                return Json(jResult);
            }

            if (IsNullOrEmpty(_supplierId))
            {
                jResult.error = new error(0, "Xảy ra lỗi, vui lòng thử lại!");
                return Json(jResult);
            }

            model.shoppingCartId = _shoppingCartId;
            model.supplierId = _supplierId;
            model.isBigShop = 0;
            var res = await _s_ShoppingCartItem.Create<M_ShoppingCartItem>(_accessToken, model, _userId);
            return Json(jResult.MapData(res));
        }

        [HttpPost]
        public async Task<JsonResult> DeleteMultiple(string id)
        {
            var res = await _s_ShoppingCartItem.DeleteSequenceId<List<M_ShoppingCartItem>>(_accessToken, id);
            return Json(new M_JResult(res));
        }

        [HttpPost]
        public async Task<JsonResult> Delete(int id)
        {
            var res = await _s_ShoppingCartItem.Delete<M_ShoppingCartItem>(_accessToken, id);
            return Json(new M_JResult(res));
        }

        [HttpPost]
        public async Task<JsonResult> UpdateQuantity(int id, int quantity = 1)
        {
            var res = await _s_ShoppingCartItem.UpdateQuantity<M_ShoppingCartItem>(_accessToken, id, quantity, _userId);
            return Json(new M_JResult(res));
        }

        public async Task<JsonResult> CountShoppingCartItem()
        {
            M_JResult jResult = new M_JResult();
            if (IsNullOrEmpty(_shoppingCartId))
            {
                jResult.error = new error(0, "Vui lòng đăng nhập lại");
                return Json(jResult);
            }
            var res = await _s_ShoppingCartItem.getShoppingCartItemCountProduct(_accessToken, _shoppingCartId, int.Parse(_supplierId));
            return Json(new M_JResult(res));
        }
        #endregion

        #region Payment
        [HttpGet]
        public IActionResult Check(string i/*, string sup*/)
        {
            if (IsNullOrEmpty(i))
                return Redirect("/checkout/cart");
            return RedirectToAction("Payment", "Checkout", new { i = Encryptor.Encrypt(i)/*, sup = sup*/ });
        }

        public async Task<IActionResult> Payment(string i/*, string sup*/)
        {
            if (IsNullOrEmpty(i))
                return Redirect("/checkout/cart");

            var resDefaultAddress = await _s_DeliveryAddress.getDeliveryAddressByCustomerIdStatusIsDefault<M_DeliveryAddress>(_accessToken, _userId);
            if (resDefaultAddress.result == 1 && resDefaultAddress.data != null)
            {
                ViewBag.DefaultAddress = JsonConvert.SerializeObject(_mapper.Map<VM_DeliveryAddress>(resDefaultAddress.data));
            }
            var resSupplier = await _s_Supplier.getHubSupplierById<M_Supplier>(_supplierId);
            if (resSupplier.data != null && resSupplier.result == 1)
            {
                ViewBag.CarrierId = resSupplier.data?.supplierCarrierObj?.carrierObj?.id;
                ViewBag.CarrierCode = resSupplier.data?.supplierCarrierObj?.carrierObj?.carrierCode;
                ViewBag.CarrierToken = resSupplier.data?.supplierCarrierObj?.token;
                ViewBag.SupplierAddressObj = Newtonsoft.Json.JsonConvert.SerializeObject(resSupplier.data?.addressObj);
            }
            //TempData["PlaceOrderFail"] = true;
            ViewBag.CartItemSelected = i;
            //ViewBag.SupplierId = sup;
            ViewBag.SupplierIdAdmin = Encryptor.Encrypt(_supplierId);
            var a = Encryptor.Decrypt(i);
            SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, new VM_ViewDataSEO
            {
                Keywords = "Mua hàng",
                Title = "Mua hàng",
                Description = "Mua hàng",
            });
            ViewData["KeyGoogleMap"] = _configuration.GetValue<string>("KeyGoogleMap");
            return View();
        }

        public async Task<JsonResult> GetCartSelectData(string listItem)
        {
            M_JResult jResult = new M_JResult();
            if (IsNullOrEmpty(_shoppingCartId))
            {
                jResult.error = new error(0, "Vui lòng đăng nhập lại");
                return Json(jResult);
            }

            //Check fail decrypt
            try
            {
                listItem = Encryptor.Decrypt(listItem);
            }
            catch (Exception)
            {
                jResult.error = new error(0, "Xảy ra lỗi, hãy thử lại sau!");
                return Json(jResult);
            }

            List<int> listCartSelect = JsonConvert.DeserializeObject<List<int>>(listItem);
            var res = await _s_ShoppingCart.getHubShoppingCartByIdStatus(_accessToken, _shoppingCartId);
            if (res.result == 1 && res.data != null)
            {
                List<VM_ShoppingCart> data = new List<VM_ShoppingCart>();
                VM_ShoppingCart dataItem;
                int code = 0;
                foreach (var item in res.data.shoppingCartItemObj)
                {
                    code++;
                    dataItem = new VM_ShoppingCart();
                    dataItem = _mapper.Map<VM_ShoppingCart>(item);
                    dataItem.productItem = _mapper.Map<List<VM_ShoppingCart.M_ProductItem>>(item.supplierObj.splitShoppingCartObj)
                        .Where(x => listCartSelect.Contains(x.cartId) && x.productPriceStatus == 1).ToList();
                    dataItem.code = code.ToString();
                    if (dataItem.productItem.Count > 0)
                        data.Add(dataItem);
                }
                var listProductGiftData = await _s_ProductGift.getListProductGiftBySequenceShoppingCartItemIdSupplierId<List<M_ProductGift>>(listItem, _supplierId);
                if (listProductGiftData.result == 1 && listProductGiftData.data != null)
                {
                    return Json(jResult.MapData(res, data, listProductGiftData.data));
                }
                return Json(jResult.MapData(res, data));
            }
            return Json(jResult);
        }

        public async Task<JsonResult> GetListProductGiftYouCanGet(int? totalPrice)
        {
            M_JResult jResult = new M_JResult();
            var res = await _s_ProductGift.getListProductGiftByTotalMustPaySupplierId(totalPrice, _supplierId);
            if (res.result == 1 && res.data != null)
            {
                return Json(res.data);
            }
            return Json(jResult);
        }

        [HttpGet]
        public JsonResult GetBankList(string id)
        {
            M_JResult jResult = new M_JResult();
            try
            {
                id = Encryptor.Decrypt(id);
                Task<ResponseData<List<M_BankPerson>>> resBankPer = _s_BankPerson.getListHubBankPersonBySupplierId<List<M_BankPerson>>(id);
                Task<ResponseData<List<M_BankSupplier>>> resBankSupp = _s_BankSupplier.getListBankSupplierBySupplierId<List<M_BankSupplier>>(id);
                Task.WaitAll(resBankPer, resBankSupp);
                if (resBankPer.Result.result == 1 && resBankSupp.Result.result == 1)
                {
                    var bankPerData = _mapper.Map<List<VM_BankPersonSupplier>>(resBankPer.Result.data);
                    var bankSupData = _mapper.Map<List<VM_BankPersonSupplier>>(resBankSupp.Result.data);
                    List<VM_BankPersonSupplier> data = bankPerData;
                    data.AddRange(bankSupData);
                    jResult.result = 1;
                    jResult.data = data;
                }
                else
                {
                    jResult.result = 0;
                    jResult.error = new error(0, "Xảy ra lỗi, hãy thử lại sau!");
                }
            }
            catch (Exception ex)
            {
                jResult.result = -1;
                jResult.error = new error(0, $"Exception: {ex.Message}");
            }
            return Json(jResult);
        }

        [HttpGet]
        public async Task<PartialViewResult> P_AddAddress()
        {
            await SetDropDownListProvince();
            return PartialView();
        }

        //[HttpPost]
        public async Task<JsonResult> PlaceOrder(EM_Order model, string listDataFeeShip, string carrierCode, string tokenCarrier)
        {
            M_JResult jResult = new M_JResult();
            if (!ModelState.IsValid)
            {
                jResult.error = new error(0, DataAnnotationExtensionMethod.GetErrorMessage(ModelState));
                return Json(jResult);
            }

            if (IsNullOrEmpty(model.sequenceShoppingCartItemId))
            {
                jResult.error = new error(0, "Dữ liệu không hợp lệ");
                return Json(jResult);
            }

            var res = await _s_Order.CreateOrderHub<List<M_Order>>(_accessToken, model);
            if (res.result != 1 || res.data == null)
            {
                return Json(jResult.MapData(res));
            }

            if (res.result == 1 && res.data2nd != null)
            {
                res.data2nd = res.data2nd.ToObject<M_ProductGift>();
            }
            //GHTK
            int feeShip = 0;
            if (carrierCode == "GHTK")
            {
                EM_GetFeeShip_GHTK eM_GetFeeShip_GHTK = JsonConvert.DeserializeObject<EM_GetFeeShip_GHTK>(listDataFeeShip);
                var resFeeShipGHTK = await _s_GHTK.Fee2(tokenCarrier, eM_GetFeeShip_GHTK);
                if (resFeeShipGHTK.result != 1 || resFeeShipGHTK.data == null)
                {
                    jResult.error = new error(0, "Có lỗi trong quá trình tính phí ship!");
                    return Json(jResult);
                }
                feeShip = resFeeShipGHTK.data.fee.Value;
            }
            else if (carrierCode == "DEFAULT")
            {
                model.FeeShip = feeShip;
            }
            model.FeeShip = feeShip;

            //try
            //{
            //    foreach (var item in res.data)
            //    {
            //        //Send notification to phoneNumber and email shop
            //        Thread sendNotification = new Thread(new ThreadStart(async () =>
            //        {
            //            //Send email
            //            if (!IsNullOrEmpty(item.supplierObj?.email))
            //                await SendEmailOrderNew(item);

            //            //Send SMS
            //            string telephone = item.supplierObj?.telephoneNumber;
            //            string hotlineNumber = item.supplierObj?.hotlineNumber;
            //            if (!IsNullOrEmpty(telephone) || !IsNullOrEmpty(hotlineNumber))
            //                await _s_Order.SendSmsNotification<object>(_configuration.GetValue<string>("BrandName"), StringHelper.ToTelephoneNumerSendSMS(IsNullOrEmpty(telephone) ? hotlineNumber : telephone));
            //        }));
            //        sendNotification.Start();
            //    }
            //}
            //catch (Exception)
            //{
            //}
            return Json(jResult.MapData(res, _mapper.Map<List<VM_CheckoutCreateOrder>>(res.data), res.data2nd));
        }
        private async Task SendEmailOrderNew(M_Order orderObj)
        {
            /*      var resShop = await _s_Supplier.getHubSupplierById<M_Supplier>(orderObj.supplierId.ToString());*/
            var resShop = await _s_Supplier.getHubSupplierById<M_Supplier>(_supplierId);
            if (resShop.result == 1 && resShop.data != null)
            {
                var shopInfo = resShop.data;
                string content = System.IO.File.ReadAllText("wwwroot/html/email_order_new_template.html");
                content = content.Replace("{{orderId}}", orderObj.id);
                content = content.Replace("{{orderCreated}}", DateTime.Now.ToString("HH:mm dd/MM/yyyy"));
                content = content.Replace("{{urlOrderView}}", $"{_apiSettings.Value.AdminSiteUrl}/order/manage");
                content = content.Replace("{{logoUrl}}", shopInfo.imageObj?.mediumUrl);
                content = content.Replace("{{shopName}}", shopInfo.name);
                content = content.Replace("{{iconUrl}}", $"{_apiSettings.Value.AdminSiteUrl}/images/email-icon/order-new.png");
                content = content.Replace("{{homeUrl}}", shopInfo.supplierConfigureObj?.domainName);
                content = content.Replace("{{hotlineNumber}}", IsNullOrEmpty(shopInfo.hotlineNumber) ? "" : "Hotline: " + shopInfo.hotlineNumber);
                content = content.Replace("{{email}}", IsNullOrEmpty(shopInfo.email) ? "" : "<br />Email: " + shopInfo.email);
                string address = shopInfo.addressObj?.addressText + " " + (IsNullOrEmpty(shopInfo.addressObj?.wardObj?.name) ? "" : shopInfo.addressObj?.wardObj?.name + ", ") + (IsNullOrEmpty(shopInfo.addressObj?.districtObj?.name) ? "" : shopInfo.addressObj?.districtObj?.name + ", ") + shopInfo.addressObj?.provinceObj?.name;
                content = content.Replace("{{address}}", IsNullOrWhiteSpace(address) ? "" : "<br />" + address);

                string contactName = IsNullOrEmpty(shopInfo.contactName) ? (IsNullOrEmpty(shopInfo.nameEn) ? shopInfo.name : shopInfo.nameEn) : shopInfo.contactName;
                EM_SendMail emailModel = new EM_SendMail
                {
                    subject = $"Bạn có đơn hàng mới #{orderObj.id} - {contactName}",
                    recipientEmail = orderObj.supplierObj?.email,
                    message = content
                };
                await _s_Order.SendOrderEmail<object>(emailModel);
            }
        }

        [HttpGet]
        public async Task<JsonResult> GetFeeShip_GHTK(string token, EM_GetFeeShip_GHTK model)
        {
            var res = await _s_GHTK.Fee2(token, model);
            return Json(new M_JResult(res));
        }
        [HttpGet]
        public async Task<JsonResult> GetListFeeShip(M_ShippingArea model, int countryId, int provinceId)
        {
            var res = await _s_ShippingArea.getListShippingAreaByCountryIdProvinceIdSupplierId<List<M_ShippingArea>>(model, countryId, provinceId, _supplierId);
            return Json(new M_JResult(res));
        }
        #endregion
        public async Task<JsonResult> ShopingCartCheckQuantity(List<VM_CheckQuantity> model)
        {
            var res = await _s_ShoppingCart.getCheckQuantity(model);
            return Json(new M_JResult(res));
        }
    }
}
