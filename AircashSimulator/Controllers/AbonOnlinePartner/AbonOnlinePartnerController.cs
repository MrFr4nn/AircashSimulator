using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Services.AbonOnlinePartner;
using Microsoft.AspNetCore.Authorization;
using AircashSimulator.Extensions;
using AircashSimulator.Controllers;

namespace AircashSimulator
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AbonOnlinePartnerController : ControllerBase
    {
        private IAbonOnlinePartnerService AbonOnlinePartnerService;
        private UserContext UserContext;
        public AbonOnlinePartnerController(IAbonOnlinePartnerService abonOnlinePartnerService, UserContext userContext)
        {
            AbonOnlinePartnerService = abonOnlinePartnerService;
            UserContext = userContext;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ValidateCoupon(ValidateCouponRequest validateCouponRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var response = await AbonOnlinePartnerService.ValidateCoupon(validateCouponRequest.CouponCode, partnerId);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var userId = UserContext.GetUserId(User);
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, userId, partnerId);
            return Ok(response);
        }

        //[HttpPost]
        //[Authorize]
        //public void GetUnusedCoupons(GetUnusedCouponsRequest getUnusedCouponsRequest)
        //{
        //    RedirectToAction("GetUnusedCoupons", "CouponController");
        //}
    }
}
