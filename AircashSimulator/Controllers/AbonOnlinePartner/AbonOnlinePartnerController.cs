using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Services.AbonOnlinePartner;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using System;

namespace AircashSimulator
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AbonOnlinePartnerController : ControllerBase
    {
        private IAbonOnlinePartnerService AbonOnlinePartnerService;
        private UserContext UserContext;
        private readonly Guid PartnerId = new Guid("e9fb671b-154e-4918-9788-84b6758fb082");
        private readonly Guid UserId = new Guid("358B9D22-BB9A-4311-B94D-8F6DAEB38B40");
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
        public async Task<IActionResult> ConfirmCashierTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, UserId, PartnerId);
            return Ok(response);
        }
    }
}
