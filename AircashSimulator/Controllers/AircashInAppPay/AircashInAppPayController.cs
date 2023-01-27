using AircashSimulator.Controllers.AircashInAppPay;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Services.AircashInAppPay;
using AircashSimulator.Extensions;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashInAppPayController : ControllerBase
    {
        private IAircashInAppPayService AircashInAppPayService;
        private UserContext UserContext;
        public AircashInAppPayController(IAircashInAppPayService aircashInAppPayService, UserContext userContext) 
        {
            AircashInAppPayService = aircashInAppPayService;
            UserContext = userContext;
        }

        public async Task<IActionResult> GenerateTransaction(GenerateTransactionRequest generateTransactionRequest) 
        {
            generateTransactionRequest.PartnerID = UserContext.GetPartnerId(User);
            var response = await AircashInAppPayService.GenerateTransaction(generateTransactionRequest);
            return Ok(response);
        }
        public async Task<IActionResult> CancelTransaction(CancelTransactionRequest cancelTransactionRequest)
        {
            return Ok();
        }
        public async Task<IActionResult> getTransactions(GetTransactionsRequest getTransactionsRequest)
        {
            return Ok();
        }
    }
}
