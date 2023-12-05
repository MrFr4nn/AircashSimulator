using AircashSignature;
using AircashSimulator.Controllers.AircashPayment;
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
            var response = await AircashPayoutService.CheckUser(checkUserRequest.PhoneNumber, checkUserRequest.PartnerUserID, checkUserRequest.PartnerID, environment);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlCheckUser(CheckUserRequest checkUserRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request = AircashPayoutService.GetCheckUserRequest(checkUserRequest.PhoneNumber, UserContext.GetUserId(User), UserContext.GetPartnerId(User));
            var curl = HelperService.GetCurl(request, AircashPayoutService.GetCheckUserEndpoint(environment));
            return Ok(curl);
        }

        [HttpPost]
        public async Task<IActionResult> CheckUserV4(CheckUserv4DTO checkUserV4Request)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutService.CheckUserV4(checkUserV4Request.PhoneNumber, checkUserV4Request.PartnerUserID, checkUserV4Request.PartnerID, checkUserV4Request.Parameters, environment);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlCheckUserV4(CheckUserv4DTO checkUserV4Request)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request = AircashPayoutService.GetCheckUserV4Request(checkUserV4Request.PhoneNumber, checkUserV4Request.PartnerUserID, checkUserV4Request.PartnerID, checkUserV4Request.Parameters);
            var curl = HelperService.GetCurl(request, AircashPayoutService.GetCheckUserV4Endpoint(environment));
            return Ok(curl);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRequest createPayoutRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, createPayoutRequest.PartnerTransactionID, createPayoutRequest.Amount, createPayoutRequest.CurrencyID, createPayoutRequest.PartnerUserID, createPayoutRequest.PartnerID, environment);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlCreatePayout(CreatePayoutRequest createPayoutRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request = AircashPayoutService.GetCreatePayoutRequest(createPayoutRequest.PhoneNumber, createPayoutRequest.PartnerTransactionID, createPayoutRequest.Amount, createPayoutRequest.CurrencyID, createPayoutRequest.PartnerUserID, createPayoutRequest.PartnerID);
            var curl = HelperService.GetCurl(request, AircashPayoutService.GetCreatePayoutEndpoint(environment));
            return Ok(curl);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayoutV4(CreatePayoutV4DTO createPayoutV4DTO)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutService.CreatePayoutV4(createPayoutV4DTO.PhoneNumber, createPayoutV4DTO.PartnerTransactionID, createPayoutV4DTO.Amount, createPayoutV4DTO.CurrencyID, createPayoutV4DTO.PartnerUserID, createPayoutV4DTO.PartnerID, createPayoutV4DTO.Parameters, environment);
            return Ok(response);
        }

        public async Task<IActionResult> GetCurlCreatePayoutV4(CreatePayoutV4DTO createPayoutV4DTO)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request = AircashPayoutService.GetCreatePayoutV4Request(createPayoutV4DTO.PhoneNumber, createPayoutV4DTO.PartnerTransactionID, createPayoutV4DTO.Amount, createPayoutV4DTO.CurrencyID, createPayoutV4DTO.PartnerUserID, createPayoutV4DTO.PartnerID, createPayoutV4DTO.Parameters);
            var curl = HelperService.GetCurl(request, AircashPayoutService.GetCreatePayoutV4Endpoint(environment));
            return Ok(curl);
        }
        [HttpPost]
        public async Task<IActionResult> CreateCashierPayout(CreatePayoutRequest createPayoutRequest)
        {
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, Guid.NewGuid().ToString(), createPayoutRequest.Amount, CurrencyEnum.EUR, Guid.NewGuid().ToString(), SettingsService.AircashPayoutPartnerId, createPayoutRequest.Environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutService.CheckTransactionStatus(checkTransactionStatusRequest.PartnerId, checkTransactionStatusRequest.PartnerTransactionId, checkTransactionStatusRequest.AircashTransactionId, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayoutSimulateError([FromBody] AcPayoutCreatePayoutErrorCodeEnum errorCode)
        {
            var phoneNumber = SettingsService.TestPhoneNumber;
            var partnerTransactionID = Guid.NewGuid().ToString();
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
            var response = await AircashPayoutService.CreatePayout(phoneNumber, partnerTransactionID, amount, currency, Guid.NewGuid().ToString(), SettingsService.AircashPayoutPartnerId, EnvironmentEnum.Staging);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlCheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {

            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request = AircashPayoutService.GetCheckTransactionStatusRequest(checkTransactionStatusRequest.PartnerId, checkTransactionStatusRequest.PartnerTransactionId, checkTransactionStatusRequest.AircashTransactionId);
            var curl = HelperService.GetCurl(request, AircashPayoutService.GetCheckTransactionStatusEndpoint(environment));
            return Ok(curl);
        }

        public async Task<object> GenerateCheckUserSignature(CheckUserv4DTO checkUserV4Request) {
            var checkUserRequest = AircashPayoutService.GetCheckUserV4Request(checkUserV4Request.PhoneNumber, checkUserV4Request.PartnerUserID, checkUserV4Request.PartnerID, checkUserV4Request.Parameters);
            var sequence = AircashSignatureService.ConvertObjectToString(checkUserRequest);
            checkUserRequest.Signature = AircashSignatureService.GenerateSignature(sequence, SettingsService.TestAircashPaymentPath, SettingsService.TestAircashPaymentPass);

            return new { AircashPayoutCheckUser = checkUserRequest, Sequence = sequence };
        }
        //public async Task<object> GenerateCreatePayoutSignature(CreatePayoutV4DTO createPayoutV4DTO) { }
    }

}
