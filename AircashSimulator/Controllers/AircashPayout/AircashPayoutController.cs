using AircashSimulator.Controllers.AircashPayout;
using AircashSimulator.Extensions;
using CrossCutting;
using Domain.Entities.Enum;
using Microsoft.AspNetCore.Mvc;
using Service.Settings;
using Services.AircashPayout;
using Services.User;
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
        private IUserService UserService;
        private readonly Guid PartnerId = new Guid("0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6");
        private readonly Guid UserId = new Guid("358B9D22-BB9A-4311-B94D-8F6DAEB38B40");

        public AircashPayoutController(IAircashPayoutService aircashPayoutService, UserContext userContext, IUserService userService, ISettingsService settingsService, IHelperService helperService)
        {
            AircashPayoutService = aircashPayoutService;
            UserContext = userContext;
            UserService = userService;
            SettingsService = settingsService;
            HelperService = helperService;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRequest checkUserRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutService.CheckUser(checkUserRequest.PhoneNumber, UserContext.GetUserId(User).ToString(), SettingsService.AircashPayoutPartnerId, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRequest createPayoutRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, Guid.NewGuid(), createPayoutRequest.Amount, CurrencyEnum.EUR, UserContext.GetUserId(User), SettingsService.AircashPayoutPartnerId, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCashierPayout(CreatePayoutRequest createPayoutRequest)
        {
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, Guid.NewGuid(), createPayoutRequest.Amount, CurrencyEnum.EUR, Guid.NewGuid(), SettingsService.AircashPayoutPartnerId, createPayoutRequest.Environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutService.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionId, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayoutSimulateError([FromBody] AcPayoutCreatePayoutErrorCodeEnum errorCode)
        {
            var phoneNumber = SettingsService.TestPhoneNumber;
            var partnerTransactionID = Guid.NewGuid();
            var amount = SettingsService.PayoutDefaultAmount;
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
                        amount = SettingsService.PayoutAmountTooSmall;
                        break;
                    }
                case AcPayoutCreatePayoutErrorCodeEnum.AmountTooBig:
                    {
                        amount = SettingsService.PayoutAmountTooBig;
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
            var response = await AircashPayoutService.CreatePayout(phoneNumber, partnerTransactionID, amount, currency, Guid.NewGuid(), SettingsService.AircashPayoutPartnerId, EnvironmentEnum.Staging);
            return Ok(response);
        }
    }

}
