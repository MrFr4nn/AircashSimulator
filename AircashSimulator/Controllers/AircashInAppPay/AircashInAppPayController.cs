using AircashSimulator.Controllers.AircashInAppPay;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Services.AircashInAppPay;
using AircashSimulator.Extensions;
using System;
using Services.User;
using Domain.Entities.Enum;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashInAppPayController : ControllerBase
    {
        private IAircashInAppPayService AircashInAppPayService;
        private UserContext UserContext;
        private IUserService UserService;
        private Guid CashierPartnerId = new Guid("d47af4a2-fdc4-44f5-a1d6-79ddca59f5dc");
        public AircashInAppPayController(IAircashInAppPayService aircashInAppPayService, UserContext userContext, IUserService userService) 
        {
            AircashInAppPayService = aircashInAppPayService;
            UserContext = userContext;
            UserService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> GenerateTransaction(GenerateTransactionRequest generateTransactionRequest) 
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            generateTransactionRequest.PartnerID = UserContext.GetPartnerId(User);
            var response = await AircashInAppPayService.GenerateTransaction(generateTransactionRequest, environment);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> CancelTransaction(CancelTransactionRequest cancelTransactionRequest)
        {
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest) 
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = AircashInAppPayService.CheckTransactionStatus(checkTransactionStatusRequest.PartnerId, checkTransactionStatusRequest.PartnerTransactionId, environment);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> RefundTransaction(RefundTransactionRequest refundTransactionRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            refundTransactionRequest.PartnerID = UserContext.GetPartnerId(User);
            var response = AircashInAppPayService.RefundTransaction(refundTransactionRequest, environment);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> CashierGenerateTransaction(GenerateTransactionRequest generateTransactionRequest)
        {
            generateTransactionRequest.PartnerID = CashierPartnerId;
            var response = await AircashInAppPayService.GenerateTransaction(generateTransactionRequest, EnvironmentEnum.Staging);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            return Ok();
        }
    }
}
