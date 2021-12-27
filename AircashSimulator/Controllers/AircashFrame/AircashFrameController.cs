using AircashSimulator.Configuration;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.AircashFrame;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
                PayType = initiateRequest.PayType,
                PayMethod = initiateRequest.PayMethod
            };
            var response = await AircashFrameService.Initiate(initiateRequestDTO);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> TransactionStatus(TransactionStatusRequest transactionStatusRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var response = await AircashFrameService.TransactionStatus(partnerId, transactionStatusRequest.TransactionId);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> Notification([FromQuery(Name = "partnerTransactionId")] int partnerTransactionId)
        {
            return Ok();
        }
    }
}
