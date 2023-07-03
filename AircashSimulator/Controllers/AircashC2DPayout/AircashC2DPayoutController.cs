using AircashSimulator.Controllers.AircashC2DPayout;
using AircashSimulator.Extensions;
using Domain.Entities.Enum;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPayoutV2;
using Services.User;
using System;
using System.Threading.Tasks;
using CrossCutting;
using Service.Settings;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashC2DPayoutController : Controller
    {
        private IHelperService HelperService;
        private IAircashPayoutV2Service AircashPayoutV2Service;
        private UserContext UserContext;
        private IUserService UserService;
        private ISettingsService SettingsService;
        public AircashC2DPayoutController(IAircashPayoutV2Service aircashPayoutV2Service, UserContext userContext, IUserService userService, IHelperService helperService, ISettingsService settingsService) {
            AircashPayoutV2Service = aircashPayoutV2Service;
            UserContext = userContext;
            HelperService = helperService;
            UserService = userService;
            SettingsService = settingsService;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRQ checkUserRQV2)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutV2Service.CheckUser(checkUserRQV2.PhoneNumber, UserContext.GetUserId(User).ToString(), checkUserRQV2.PartnerId, checkUserRQV2.Parameters, environment);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlCheckUser(CheckUserRQ checkUserRQV2)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request =AircashPayoutV2Service.GetCheckUserRequest(checkUserRQV2.PhoneNumber, UserContext.GetUserId(User).ToString(), checkUserRQV2.PartnerId, checkUserRQV2.Parameters);
            var curl = HelperService.GetCurl(request, AircashPayoutV2Service.GetCheckUserEndpoint(environment));
            return Ok(curl);
        }
        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutV2Service.CreatePayout(createPayoutRQ.PartnerId, createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), createPayoutRQ.Parameters, environment);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlCreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request =  AircashPayoutV2Service.GetCreatePayoutRequest(createPayoutRQ.PartnerId, createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), createPayoutRQ.Parameters);
            var curl = HelperService.GetCurl(request, AircashPayoutV2Service.GetCreatePayoutEndpoint(environment));
            return Ok(curl);
        }

        [HttpPost]
        public async Task<IActionResult> CashierCreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var response = await AircashPayoutV2Service.CreatePayout(SettingsService.C2DPayoutPartnerId, createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, Guid.NewGuid().ToString(), createPayoutRQ.Parameters, createPayoutRQ.Environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckCode(CheckCodeDTO checkCodeDTO)
        {
            var environment = checkCodeDTO.Environment == null? await UserService.GetUserEnvironment(UserContext.GetUserId(User)): checkCodeDTO.Environment;
            var response = await AircashPayoutV2Service.CheckCode(SettingsService.C2DPayoutPartnerId, checkCodeDTO.Barcode, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierConfirmTransaction(ConfirmTransactionRQ confirmTransactionRQ)
        {
            var response = await AircashPayoutV2Service.ConfirmTransaction(confirmTransactionRQ.BarCode, SettingsService.C2DPayoutPartnerId, Guid.NewGuid().ToString(), confirmTransactionRQ.Environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatus checkTransactionStatusRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutV2Service.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionId, environment);
            return Ok(response);
        }

    }
}
