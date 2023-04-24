using AircashSimulator.Controllers.AircashPayout;
using AircashSimulator.Extensions;
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
        private IAircashPayoutService AircashPayoutService;
        private UserContext UserContext;

        public AircashPayoutController(IAircashPayoutService aircashPayoutService, UserContext userContext, ISettingsService settingsService)
        {
            AircashPayoutService = aircashPayoutService;
            UserContext = userContext;
            SettingsService = settingsService;
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
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, createPayoutRequest.Amount, UserContext.GetUserId(User), SettingsService.AircashPayoutPartnerId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCashierPayout(CreatePayoutRequest createPayoutRequest)
        {
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, createPayoutRequest.Amount, Guid.NewGuid(), SettingsService.AircashPayoutPartnerId);
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
            var PhoneNumberSimulateError = "385993072021";
            var PartnerTransactionIDSimulateError = Guid.NewGuid().ToString();
            var AmoutSimulateError = 10m;
            var CurrencySimulateError = CurrencyEnum.EUR;

            switch (errorCode)
            {
                case AcPayoutCreatePayoutErrorCodeEnum.UnknownPhoneNumber:
                    {
                        PhoneNumberSimulateError = "385000000000";
                        break;
                    }
                case AcPayoutCreatePayoutErrorCodeEnum.PartnerTransactionIDAlreadyExists:
                    {
                        PartnerTransactionIDSimulateError = "C456EEE8-CCAA-4C10-B6E9-7F8C9CA3D2D8";
                        break;
                    }
                case AcPayoutCreatePayoutErrorCodeEnum.AmountTooSmall:
                    {
                        AmoutSimulateError = 0.5m;
                        break;
                    }
                case AcPayoutCreatePayoutErrorCodeEnum.AmountTooBig:
                    {
                        AmoutSimulateError = 1100;
                        break;
                    }
                case AcPayoutCreatePayoutErrorCodeEnum.UserReachedTransactionLimitOrUserIsBlocked:
                    {
                        AmoutSimulateError = 999999999999;
                        break;
                    }
                case AcPayoutCreatePayoutErrorCodeEnum.CurrenciesDoNotMatch:
                    {
                        CurrencySimulateError = CurrencyEnum.HRK;
                        break;
                    }
                default:
                    return BadRequest();
            }
            //var response = await AircashPayoutService.CreatePayoutSimulateError(PhoneNumberSimulateError, AmoutSimulateError, PartnerTransactionIDSimulateError, CurrencySimulateError, UserContext.GetUserId(User), SettingsService.AircashPayoutPartnerId);
            return Ok();
        }
    }

}
