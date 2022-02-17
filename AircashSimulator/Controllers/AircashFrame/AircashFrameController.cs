using Services.AircashFrame;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AircashSimulator.Extensions;
using Microsoft.Extensions.Options;
using AircashSimulator.Configuration;
using Microsoft.AspNetCore.Authorization;
using Domain.Entities.Enum;

namespace AircashSimulator.Controllers.AircashFrame
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashFrameController : Controller
    {
        private IAircashFrameService AircashFrameService;
        private UserContext UserContext;
        private AircashConfiguration AircashConfiguration;
        public AircashFrameController(IAircashFrameService aircashFrameService, UserContext userContext, IOptionsMonitor<AircashConfiguration> aircashConfiguration)
        {
            AircashFrameService = aircashFrameService;
            UserContext = userContext;
            AircashConfiguration = aircashConfiguration.CurrentValue;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Initiate(InitiateRequest initiateRequest )
        {
            var initiateRequestDTO = new InitiateRequestDTO
            {
                PartnerId = UserContext.GetPartnerId(User),
                UserId = UserContext.GetUserId(User),
                Amount = initiateRequest.Amount,
                Currency = initiateRequest.Currency,
                PayType = (PayTypeEnum)initiateRequest.PayType,
                PayMethod = (PayMethodEnum)initiateRequest.PayMethod
            };
            var response = await AircashFrameService.Initiate(initiateRequestDTO);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> Notification([FromQuery(Name = "partnerTransactionId")] string partnerTransactionId)
        {
            var response = await AircashFrameService.Notification(partnerTransactionId);
            if (response == 0)
            {
                return Ok("Transaction already confirmed");
            }
            else if(response == 1)
            {
                return Ok("Transaction confirmed");
            }
            else
            {
                return BadRequest("Invalid signature");
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> TransactionStatus(TransactionStatusRequest transactionStatusRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var response = await AircashFrameService.TransactionStatus(partnerId, transactionStatusRequest.TransactionId);
            return Ok(response);
        }
    }
}
