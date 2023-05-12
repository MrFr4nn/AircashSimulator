using AircashSimulator.Controllers.AircashPayment;
using AircashSimulator.Extensions;
using Domain.Entities.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPaymentAndPayout;
using Services.User;
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
        private IUserService UserService;

        private const string PARTNER_ID = "e747a837-85d9-4287-a412-ffbb5d1b0ad8";
        private const string USER_ID = "358B9D22-BB9A-4311-B94D-8F6DAEB38B40";
        public AircashPaymentAndPayoutController(IAircashPaymentAndPayoutService aircashPaymentAndPayoutService, UserContext userContext, IUserService userService)
        {
            AircashPaymentAndPayoutService = aircashPaymentAndPayoutService;
            UserContext = userContext;
            UserService = userService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckCode(CheckCodeRequest checkCodeRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPaymentAndPayoutService.CheckCode(checkCodeRequest.BarCode, checkCodeRequest.LocationID, UserContext.GetPartnerId(User), environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPaymentAndPayoutService.ConfirmTransaction(confirmTransactionRequest.BarCode, confirmTransactionRequest.LocationID, UserContext.GetPartnerId(User), UserContext.GetUserId(User), environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierCheckCode(CheckCodeRequest checkCodeRequest)
        {
            var response = await AircashPaymentAndPayoutService.CheckCode(checkCodeRequest.BarCode, checkCodeRequest.LocationID, new Guid(PARTNER_ID), EnvironmentEnum.Staging);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var response = await AircashPaymentAndPayoutService.ConfirmTransaction(confirmTransactionRequest.BarCode, confirmTransactionRequest.LocationID, new Guid(PARTNER_ID), new Guid(USER_ID), EnvironmentEnum.Staging);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var response = await AircashPaymentAndPayoutService.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionID, UserContext.GetPartnerId(User), EnvironmentEnum.Staging);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelTransaction(CancelTransactionRequest cancelTransactionRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPaymentAndPayoutService.CancelTransaction(cancelTransactionRequest.PartnerTransactionID, cancelTransactionRequest.LocationID, UserContext.GetPartnerId(User), UserContext.GetUserId(User), environment);
            return Ok(response);
        }
    }
}
