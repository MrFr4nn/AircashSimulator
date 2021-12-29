using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPaymentAndPayout;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPaymentAndPayout
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPaymentAndPayoutController : ControllerBase
    {
        private IAircashPaymentAndPayoutService AircashPaymentAndPayoutService;
        private UserContext UserContext;
        public AircashPaymentAndPayoutController(IAircashPaymentAndPayoutService aircashPaymentAndPayoutService, UserContext userContext)
        {
            AircashPaymentAndPayoutService = aircashPaymentAndPayoutService;
            UserContext = userContext;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckCode(CheckCodeRequest checkCodeRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var response = await AircashPaymentAndPayoutService.CheckCode(checkCodeRequest.BarCode, checkCodeRequest.LocationID, partnerId);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var userId = UserContext.GetUserId(User);
            var response = await AircashPaymentAndPayoutService.ConfirmTransaction(confirmTransactionRequest.BarCode, confirmTransactionRequest.LocationID, partnerId, userId);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var response = await AircashPaymentAndPayoutService.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionID, partnerId);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelTransaction(CancelTransactionRequest cancelTransactionRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var userId = UserContext.GetUserId(User);
            var response = await AircashPaymentAndPayoutService.CancelTransaction(cancelTransactionRequest.PartnerTransactionID, cancelTransactionRequest.LocationID, partnerId, userId);
            return Ok(response);
        }
    }
}
