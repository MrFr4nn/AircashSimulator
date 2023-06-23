using AircashSimulator.Controllers.AircashC2DPayout;
using AircashSimulator.Extensions;
using Domain.Entities.Enum;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPayoutV2;
using Services.User;
using System;
using System.Threading.Tasks;
using CrossCutting;

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
        private readonly Guid PartnerId = new Guid("386bf082-d1b5-42e1-9852-8077b7f704c6");
        private readonly Guid UserId = new Guid("358B9D22-BB9A-4311-B94D-8F6DAEB38B40");
        public AircashC2DPayoutController(IAircashPayoutV2Service aircashPayoutV2Service, UserContext userContext, IUserService userService, IHelperService helperService) {
            AircashPayoutV2Service = aircashPayoutV2Service;
            UserContext = userContext;
            HelperService = helperService;
            UserService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRQ checkUserRQV2)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutV2Service.CheckUser(checkUserRQV2.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User), checkUserRQV2.Parameters, environment);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlCheckUser(CheckUserRQ checkUserRQV2)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request =AircashPayoutV2Service.GetCheckUserRequest(checkUserRQV2.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User), checkUserRQV2.Parameters);
            var curl = HelperService.GetCurl(request, AircashPayoutV2Service.GetCheckUserEndpoint(environment));
            return Ok(curl);
        }
        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutV2Service.CreatePayout(UserContext.GetPartnerId(User), createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), createPayoutRQ.Parameters, environment);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlCreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request =  AircashPayoutV2Service.GetCreatePayoutRequest(UserContext.GetPartnerId(User), createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), createPayoutRQ.Parameters);
            var curl = HelperService.GetCurl(request, AircashPayoutV2Service.GetCreatePayoutEndpoint(environment));
            return Ok(curl);
        }

        [HttpPost]
        public async Task<IActionResult> CashierCreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var response = await AircashPayoutV2Service.CreatePayout(PartnerId, createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserId.ToString(), createPayoutRQ.Parameters, createPayoutRQ.Environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckCode(CheckCodeDTO checkCodeDTO)
        {
            var environment = checkCodeDTO.Environment == null? await UserService.GetUserEnvironment(UserContext.GetUserId(User)): checkCodeDTO.Environment;
            var response = await AircashPayoutV2Service.CheckCode(PartnerId, checkCodeDTO.Barcode, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierConfirmTransaction(ConfirmTransactionRQ confirmTransactionRQ)
        {
            var response = await AircashPayoutV2Service.ConfirmTransaction(confirmTransactionRQ.BarCode, PartnerId, UserId.ToString(), confirmTransactionRQ.Environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutV2Service.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionId, environment);
            return Ok(response);
        }

    }
}
