using AircashSimulator.Controllers.AircashPayout;
using AircashSimulator.Extensions;
using CrossCutting;
using Domain.Entities.Enum;
using Microsoft.AspNetCore.Mvc;
using Service.Settings;
using Services.AircashPayout;
using System;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPayoutController : ControllerBase
    {
        private ISettingsService SettingsService;
        private IHelperService HelperService;
        private IAircashPayoutService AircashPayoutService;
        private UserContext UserContext;

        public AircashPayoutController(IAircashPayoutService aircashPayoutService, UserContext userContext, ISettingsService settingsService, IHelperService helperService)
        {
            AircashPayoutService = aircashPayoutService;
            UserContext = userContext;
            SettingsService = settingsService;
            HelperService = helperService;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRequest checkUserRequest)
        {
            var response = await AircashPayoutService.CheckUser(checkUserRequest.PhoneNumber, UserContext.GetUserId(User).ToString(), SettingsService.AircashPayoutPartnerId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRequest createPayoutRequest)
        {
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, Guid.NewGuid(), createPayoutRequest.Amount, CurrencyEnum.EUR, UserContext.GetUserId(User), SettingsService.AircashPayoutPartnerId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCashierPayout(CreatePayoutRequest createPayoutRequest)
        {
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, Guid.NewGuid(), createPayoutRequest.Amount, CurrencyEnum.EUR, Guid.NewGuid(), SettingsService.AircashPayoutPartnerId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var response = await AircashPayoutService.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayoutSimulateError([FromBody] AcPayoutCreatePayoutErrorCodeEnum errorCode)
        {
            var phoneNumber = SettingsService.TestPhoneNumber;
            var partnerTransactionID = Guid.NewGuid();
            var amount = SettingsService.DefaultAmount;
            var currency = CurrencyEnum.EUR;

            switch (errorCode)
            {
                case AcPayoutCreatePayoutErrorCodeEnum.UnknownPhoneNumber:
                    {
                        phoneNumber = HelperService.RandomNumber(12);
                        break;
                    }
                case AcPayoutCreatePayoutErrorCodeEnum.PartnerTransactionIDAlreadyExists:
                    {
                        partnerTransactionID = SettingsService.PartnerTransactionIdAlreadyExists;
                        break;
                    }
                case AcPayoutCreatePayoutErrorCodeEnum.AmountTooSmall:
                    {
                        amount = SettingsService.AmountTooSmall;
                        break;
                    }
                case AcPayoutCreatePayoutErrorCodeEnum.AmountTooBig:
                    {
                        amount = SettingsService.AmountTooBig;
                        break;
                    }
                case AcPayoutCreatePayoutErrorCodeEnum.UserReachedTransactionLimitOrUserIsBlocked:
                    {
                        phoneNumber = SettingsService.BlockedPhoneNumber;
                        break;
                    }
                case AcPayoutCreatePayoutErrorCodeEnum.CurrenciesDoNotMatch:
                    {
                        currency = CurrencyEnum.HRK;
                        break;
                    }
                default:
                    return BadRequest();
            }
            var response = await AircashPayoutService.CreatePayout(phoneNumber, partnerTransactionID, amount, currency, Guid.NewGuid(), SettingsService.AircashPayoutPartnerId);
            return Ok(response);
        }
    }

}
