using ThreeF_WebPortal.ExtensionMethods;
using ThreeF_WebPortal.Lib;
using ThreeF_WebPortal.Models;
using ThreeF_WebPortal.Services;
using ThreeF_WebPortal.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using static System.String;

namespace ThreeF_WebPortal.Controllers
{
    [Authorize]
    public class OrderController : BaseController<OrderController>
    {
        private readonly IS_Order _s_Order;
        private readonly IS_OrderItem _s_OrderItem;
        private readonly IS_Reason _s_Reason;
        private const int RECORDS_NUMBER = 10;

        public OrderController(IS_Order order, IS_OrderItem orderItem, IS_Reason reason)
        {
            _s_Order = order;
            _s_OrderItem = orderItem;
            _s_Reason = reason;
        }

        public IActionResult Views()
        {
            SetViewDataSEOExtensionMethod.SetViewDataSEODefaultAll(this, new VM_ViewDataSEO
            {
                Keywords = "Đơn hàng của tôi",
                Title = "Đơn hàng của tôi",
                Description = "Đơn hàng của tôi",
            });
            return View();
        }

        [HttpGet]
        public async Task<JsonResult> GetListOrder(int type = 1, int status = 0, int page = 1)
        {
            var res = await _s_Order.getListHubOrderByCustomerIdProcessStatusPage<List<M_OrderGetList>>(_accessToken, status, _userId, SetFDateFilter(type), page, RECORDS_NUMBER);
            return res.result == 1 && res.data != null ? Json(new M_JResult(res, _mapper.Map<List<VM_OrderList>>(res.data))) : Json(new M_JResult(res, new List<VM_OrderList>(), 0));
        }

        [HttpGet]
        public async Task<JsonResult> ViewDetail(string id)
        {
            if (IsNullOrEmpty(id)) return Json(new M_JResult(-2, new error(404, Empty), default(dynamic)));
            var res = await _s_Order.getHubOrderByIdCustomerId<M_OrderDetail>(_accessToken, id, _userId);
            return res.result == 1 && res.data != null ? Json(new M_JResult(res, _mapper.Map<VM_OrderView>(res.data))) : Json(new M_JResult(res));
        }

        [HttpGet]
        public async Task<JsonResult> GetReasonForCancel()
        {
            var res = await _s_Reason.getListReasonByType<List<M_Reason>>(2);
            return Json(new M_JResult(res));
        }

        [HttpPost]
        public async Task<JsonResult> CancelItem(string orderItemId, string description)
        {
            var res = await _s_OrderItem.DeleteHub<List<M_OrderItemDeleteHub>>(_accessToken, orderItemId, description);
            return Json(new M_JResult(res));
        }

        #region Function support
        private int? SetFDateFilter(int value)
        {
            switch (value)
            {
                //days
                case 1: return 7;
                case 2: return 30;
                case 3: return 30 * 6;
                case 4: return default(int?); //All
                default: return 7;
            }
        }
        #endregion
    }
}
