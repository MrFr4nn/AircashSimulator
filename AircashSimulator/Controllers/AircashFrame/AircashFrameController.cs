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
using Service.Settings;
using AircashSimulator.UI.Pages;
using Microsoft.Extensions.Hosting;
using Services.User;

namespace AircashSimulator.Controllers.AircashFrame
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashFrameController : Controller
    {
        private ISettingsService SettingsService;
        private IAircashFrameService AircashFrameService;
        private IAircashFrameV2Service AircashFrameV2Service;
        private AircashConfiguration AircashConfiguration;
        private UserContext UserContext;
        public readonly IHubContext<NotificationHub> _hubContext;
        private IUserService UserService;

        public AircashFrameController(ISettingsService settingsService,IAircashFrameService aircashFrameService, IAircashFrameV2Service aircashFrameV2Service, UserContext userContext, IOptionsMonitor<AircashConfiguration> aircashConfiguration, IHubContext<NotificationHub> hubContext, IUserService userService)
        {
            SettingsService = settingsService;
            AircashFrameService = aircashFrameService;
            AircashFrameV2Service = aircashFrameV2Service;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            UserContext = userContext;
            _hubContext = hubContext;
            UserService = userService;
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
                PartnerId = SettingsService.AircashFramePartnerId,
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
        public async Task<IActionResult> InitiateV2(InititateRequestV2Dto initiateRequestV2Dto)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashFrameV2Service.Initiate(initiateRequestV2Dto, initiateRequestV2Dto.PartnerTransactionId, initiateRequestV2Dto.Currency, environment);
            return Ok(response);            
        }

        [HttpPost]
        public async Task<IActionResult> InitiateCashierFrameV2(InitiateRequestAircashFrameV2 initiateRequest)
        {
            var initiateRequestDTO = new InititateRequestV2Dto
            {
                PartnerId = SettingsService.AircashFramePartnerId,
                UserId = Guid.NewGuid(),
                Amount = initiateRequest.Amount,
                MatchParameters = initiateRequest.MatchParameters,
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
            await AircashFrameV2Service.NotificationCashierFrameV2(new Guid(partnerTransactionId));
            await SendHubMessage("TransactionConfirmedMessage", "Payment received, </br>transactionId: " + partnerTransactionId + " , </br>time: " + DateTime.Now, 1);
            return Ok();            
        }

        [HttpPost]
        public async Task<IActionResult> TransactionStatusFrameV2(TransactionStatusRequest transactionStatusRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashFrameV2Service.CheckTransactionStatusFrame(SettingsService.AircashFramePartnerId, transactionStatusRequest.TransactionId, environment);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> InitiateSimulateError([FromBody] AcFrameInitiateErrorCodeEnum errorCode)
        {
            var initiateRequestDTO = new InititateRequestV2Dto()
            {
                PartnerId = SettingsService.AircashFramePartnerId,
                UserId = Guid.NewGuid(),
                Amount = SettingsService.AircashFrameDefaultAmount,
                PayType = PayTypeEnum.Payout,
                PayMethod = PayMethodEnum.Payout,
                Locale = SettingsService.AircashFrameDefaultLocale,
                NotificationUrl = $"{AircashConfiguration.AcFrameOriginUrl}/#!/success",
                OriginUrl = "https://aircash.eu",
                DeclineUrl = "",
                SuccessUrl = "",
                CancelUrl = ""
            };
            var currency = CurrencyEnum.EUR;
            var partnerTransactionId = Guid.NewGuid();
            switch (errorCode)
            {
                case AcFrameInitiateErrorCodeEnum.InvalidSignatureOrPartnerId:
                    {
                        initiateRequestDTO.PartnerId = Guid.NewGuid();
                        break;
                    }
                case AcFrameInitiateErrorCodeEnum.ValidationError:
                    {
                        initiateRequestDTO.Locale = "";
                        break;
                    }
                case AcFrameInitiateErrorCodeEnum.PartnerTransactionAlreadyExists:
                    {
                        partnerTransactionId = SettingsService.AircashFramePartnerTransactionAlreadyExists;
                        break;
                    }
                case AcFrameInitiateErrorCodeEnum.InvalidCurrency:
                    {
                        currency = CurrencyEnum.HRK;
                        break;
                    }

                default:
                    return Ok();
            }
            var response = await AircashFrameV2Service.Initiate(initiateRequestDTO, partnerTransactionId, currency, EnvironmentEnum.Staging);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> TransactionStatusSimulateError([FromBody] AcFrameTransactionStatusErrorCodeEnum errorCode)
        {
            var partnerId = SettingsService.AircashFramePartnerId;
            var partnerTransactionId = Guid.NewGuid();
            switch (errorCode)
            {
                case AcFrameTransactionStatusErrorCodeEnum.InvalidSignatureOrPartnerId:
                    {
                        partnerId = Guid.NewGuid();
                        break;
                    }
                //case AcFrameTransactionStatusErrorCodeEnum.ValidationError:
                //    {
                //        break;
                //    }
                case AcFrameTransactionStatusErrorCodeEnum.TransactionDoesNotExist:
                    {
                        partnerTransactionId = Guid.NewGuid();
                        break;
                    }
                case AcFrameTransactionStatusErrorCodeEnum.TransactionNotProcessed:
                    {
                        partnerTransactionId = SettingsService.AircashFrameTransactionNotProcessed;
                        break;
                    }

                default:
                    return BadRequest();
            }
            var response = await AircashFrameV2Service.CheckTransactionStatusFrame(partnerId, partnerTransactionId.ToString(), EnvironmentEnum.Staging);
            return Ok(response);
        }
    }
}
