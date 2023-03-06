using Services.AircashFrame;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AircashSimulator.Extensions;
using Microsoft.Extensions.Options;
using AircashSimulator.Configuration;
using Microsoft.AspNetCore.Authorization;
using Domain.Entities.Enum;
using Services.AircashFrameV2;
using System;

namespace AircashSimulator.Controllers.AircashFrame
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashFrameController : Controller
    {
        private IAircashFrameService AircashFrameService;
        private IAircashFrameV2Service AircashFrameV2Service;
        private AircashConfiguration AircashConfiguration;
        private UserContext UserContext;        

        public AircashFrameController(IAircashFrameService aircashFrameService, IAircashFrameV2Service aircashFrameV2Service, UserContext userContext, IOptionsMonitor<AircashConfiguration> aircashConfiguration)
        {
            AircashFrameService = aircashFrameService;
            AircashFrameV2Service = aircashFrameV2Service;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            UserContext = userContext;
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
                PayType = (PayTypeEnum)initiateRequest.PayType,
                PayMethod = (PayMethodEnum)initiateRequest.PayMethod
            };
            var response = await AircashFrameService.Initiate(initiateRequestDTO);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> InitiateV2(InitiateRequest initiateRequest)
        {
            var initiateRequestDTO = new InititateRequestV2Dto
            {
                PartnerId = UserContext.GetPartnerId(User),
                UserId = UserContext.GetUserId(User),
                Amount = initiateRequest.Amount,
                PayType = (PayTypeEnum)initiateRequest.PayType,
                PayMethod = (PayMethodEnum)initiateRequest.PayMethod,
                OriginUrl = initiateRequest.OriginUrl,
                DeclineUrl = initiateRequest.DeclineUrl,
                SuccessUrl = initiateRequest.SuccessUrl,
                CancelUrl = initiateRequest.CancelUrl
            };
            var response = await AircashFrameV2Service.Initiate(initiateRequestDTO);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> InitiateCashierFrameV2(InitiateRequestAircashFrameV2 initiateRequest)
        {
            if (initiateRequest.AcFrameOption == 1)
            {
                /*---- METHOD 1 - RECOMMENDED SDK WINDOW CHECKOUT ----- */
                string NotificationUrl = $"{AircashConfiguration.AcFrameApiUrl}" + "/NotificationCashierFrameV2";
                string OriginUrl = $"{AircashConfiguration.AcFrameOriginUrl}";
                string DeclineUrl = null;
                string SuccessUrl = null;
                string CancelUrl = null;

                var initiateRequestDTO = new InititateRequestV2Dto
                {
                    PartnerId = new Guid("5680E089-9E86-4105-B1A2-ACD0CD77653C"),
                    UserId = new Guid("F0BC2E22-9C2D-4217-BEEE-99CC1AA3C26D"),
                    Amount = initiateRequest.Amount,
                    PayType = (PayTypeEnum)0,
                    PayMethod = (PayMethodEnum)2,
                    NotificationUrl = NotificationUrl,
                    OriginUrl = OriginUrl,
                    DeclineUrl = DeclineUrl,
                    SuccessUrl = SuccessUrl,
                    CancelUrl = CancelUrl
                };
                var response = await AircashFrameV2Service.InitiateCashierFrameV2(initiateRequestDTO);
                return Ok(response);
            }
            else if(initiateRequest.AcFrameOption == 2 || initiateRequest.AcFrameOption == 3)
            {
                /*---- METHOD 2 or METHOD 3 - SDK REDIRECT CHECKOUT ----- */
                string NotificationUrl = $"{AircashConfiguration.AcFrameApiUrl}" + "/NotificationCashierFrameV2";
                string OriginUrl = null;
                string DeclineUrl = $"{AircashConfiguration.AcFrameOriginUrl}" + "/#!/decline";
                string SuccessUrl = $"{AircashConfiguration.AcFrameOriginUrl}" + "/#!/success";
                string CancelUrl = $"{AircashConfiguration.AcFrameOriginUrl}" + "/#!/decline";

                var initiateRequestDTO = new InititateRequestV2Dto
                {
                    PartnerId = new Guid("5680E089-9E86-4105-B1A2-ACD0CD77653C"),
                    UserId = new Guid("F0BC2E22-9C2D-4217-BEEE-99CC1AA3C26D"),
                    Amount = initiateRequest.Amount,
                    PayType = (PayTypeEnum)0,
                    PayMethod = (PayMethodEnum)2,
                    NotificationUrl = NotificationUrl,
                    OriginUrl = OriginUrl,
                    DeclineUrl = DeclineUrl,
                    SuccessUrl = SuccessUrl,
                    CancelUrl = CancelUrl
                };
                var response = await AircashFrameV2Service.InitiateCashierFrameV2(initiateRequestDTO);
                return Ok(response);
            }  
            else
            {
                return BadRequest();
            }
        }

        [HttpGet]
        public async Task<IActionResult> NotificationCashierFrameV2([FromQuery(Name = "partnerTransactionId")] string partnerTransactionId)
        {
            var response = await AircashFrameV2Service.NotificationCashierFrameV2(partnerTransactionId);
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
        public async Task<IActionResult> TransactionStatusCashierFrameV2(TransactionStatusRequest transactionStatusRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var response = await AircashFrameV2Service.TransactionStatusCashierFrameV2(partnerId, transactionStatusRequest.TransactionId);
            return Ok(response);
        }
    }
}
