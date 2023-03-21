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
using AircashSimulator.Hubs;
using Microsoft.AspNetCore.SignalR;
using AircashSimulator.Controllers.AircashPayment;

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
        public readonly IHubContext<NotificationHub> _hubContext;
        private string partnerId = "5680E089-9E86-4105-B1A2-ACD0CD77653C";
        private string userId = "F0BC2E22-9C2D-4217-BEEE-99CC1AA3C26D";

        public AircashFrameController(IAircashFrameService aircashFrameService, IAircashFrameV2Service aircashFrameV2Service, UserContext userContext, IOptionsMonitor<AircashConfiguration> aircashConfiguration, IHubContext<NotificationHub> hubContext)
        {
            AircashFrameService = aircashFrameService;
            AircashFrameV2Service = aircashFrameV2Service;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            UserContext = userContext;
            _hubContext = hubContext;
        }

        public async Task SendHubMessage(string method, string msg, int status)
        {
            await _hubContext.Clients.All.SendAsync(method, msg, status);
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
        public async Task<IActionResult> InitiateCashierFrameV2(InitiateRequestAircashFrameV2 initiateRequest)
        {
            var initiateRequestDTO = new InititateRequestV2Dto
            {
                PartnerId = partnerId,
                UserId = userId,
                Amount = initiateRequest.Amount,
                PayType = initiateRequest.PayType,
                PayMethod = initiateRequest.PayMethod
            };

            if (initiateRequest.AcFrameOption == AcFrameIntegrationCheckoutTypeEnum.WindowCheckout)
            {
                /*---- METHOD 1 - RECOMMENDED SDK WINDOW CHECKOUT ----- */
                initiateRequestDTO.NotificationUrl = $"{AircashConfiguration.AcFrameApiUrl}/NotificationCashierFrameV2";
                initiateRequestDTO.OriginUrl = $"{AircashConfiguration.AcFrameOriginUrl}";                                
            }
            else if(initiateRequest.AcFrameOption == AcFrameIntegrationCheckoutTypeEnum.RedirectCheckout)
            {
                /*---- METHOD 2 - SDK REDIRECT CHECKOUT ----- */
                initiateRequestDTO.NotificationUrl = $"{AircashConfiguration.AcFrameApiUrl}/NotificationCashierFrameV2";
                initiateRequestDTO.DeclineUrl = $"{AircashConfiguration.AcFrameOriginUrl}/#!/decline";
                initiateRequestDTO.SuccessUrl = $"{AircashConfiguration.AcFrameOriginUrl}/#!/success";
                initiateRequestDTO.CancelUrl = $"{AircashConfiguration.AcFrameOriginUrl}/#!/decline";                                
            }
            else if (initiateRequest.AcFrameOption == AcFrameIntegrationCheckoutTypeEnum.CustomWindowCheckout || initiateRequest.AcFrameOption == AcFrameIntegrationCheckoutTypeEnum.CustomRedirectCheckout)
            {
                /*---- METHOD 3 and 4 - CUSTOM WINDOW CHECKOUT and CUSTOM REDIRECT CHECKOUT ----- */
                initiateRequestDTO.NotificationUrl = $"{AircashConfiguration.AcFrameApiUrl}/NotificationCashierFrameV2";
                initiateRequestDTO.DeclineUrl = $"{AircashConfiguration.AcFrameOriginUrl}/#!/decline";
                initiateRequestDTO.SuccessUrl = $"{AircashConfiguration.AcFrameOriginUrl}/#!/success";
                initiateRequestDTO.CancelUrl = $"{AircashConfiguration.AcFrameOriginUrl}/#!/decline";
            }
            else
            {
                return BadRequest();
            }
            var response = await AircashFrameV2Service.InitiateCashierFrameV2(initiateRequestDTO);            
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> NotificationCashierFrameV2([FromQuery(Name = "partnerTransactionId")] string partnerTransactionId)
        {
            await AircashFrameV2Service.NotificationCashierFrameV2(partnerTransactionId);
            await SendHubMessage("TransactionConfirmedMessage", "Payment received, </br>transactionId: " + partnerTransactionId + " , </br>time: " + DateTime.Now, 1);
            return Ok();            
        }

        [HttpPost]
        public async Task<IActionResult> TransactionStatusCashierFrameV2(TransactionStatusRequest transactionStatusRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var response = await AircashFrameV2Service.TransactionStatusCashierFrameV2(partnerId, transactionStatusRequest.TransactionId);
            return Ok(response);
        }
    }
}
