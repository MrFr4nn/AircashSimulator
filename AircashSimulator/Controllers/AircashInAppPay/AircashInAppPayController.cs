using AircashSimulator.Controllers.AircashInAppPay;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Services.AircashInAppPay;
using AircashSimulator.Extensions;
using System;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashInAppPayController : ControllerBase
    {
        private IAircashInAppPayService AircashInAppPayService;
        private UserContext UserContext;
        private Guid CashierPartnerId = new Guid("d47af4a2-fdc4-44f5-a1d6-79ddca59f5dc");
        public AircashInAppPayController(IAircashInAppPayService aircashInAppPayService, UserContext userContext) 
        {
            AircashInAppPayService = aircashInAppPayService;
            UserContext = userContext;
        }

        [HttpPost]
        public async Task<IActionResult> GenerateTransaction(GenerateTransactionRequest generateTransactionRequest) 
        {
            generateTransactionRequest.PartnerID = UserContext.GetPartnerId(User);
            var response = await AircashInAppPayService.GenerateTransaction(generateTransactionRequest, UserContext.GetUserId(User));
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> CancelTransaction(CancelTransactionRequest cancelTransactionRequest)
        {
            return Ok();
        }
        [HttpPost]
        public async Task<IActionResult> getTransactions(GetTransactionsRequest getTransactionsRequest)
        {
            return Ok();
        }
        [HttpPost]
        public async Task<IActionResult> RefundTransaction(RefundTransactionRequest refundTransactionRequest)
        {
            refundTransactionRequest.PartnerID = UserContext.GetPartnerId(User);
            var response = AircashInAppPayService.RefundTransaction(refundTransactionRequest);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> CashierGenerateTransaction(GenerateTransactionRequest generateTransactionRequest)
        {
            generateTransactionRequest.PartnerID = CashierPartnerId;
            var response = await AircashInAppPayService.GenerateTransaction(generateTransactionRequest, Guid.NewGuid());
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            return Ok();
        }
    }
}
