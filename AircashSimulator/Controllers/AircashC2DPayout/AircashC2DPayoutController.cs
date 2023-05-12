using AircashSimulator.Controllers.AircashC2DPayout;
using AircashSimulator.Extensions;
using Domain.Entities.Enum;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPayoutV2;
using Services.User;
using System;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashC2DPayoutController : Controller
    {
        private IAircashPayoutV2Service AircashPayoutV2Service;
        private UserContext UserContext;
        private IUserService UserService;
        private readonly Guid PartnerId = new Guid("386bf082-d1b5-42e1-9852-8077b7f704c6");
        private readonly Guid UserId = new Guid("358B9D22-BB9A-4311-B94D-8F6DAEB38B40");
        public AircashC2DPayoutController(IAircashPayoutV2Service aircashPayoutV2Service, UserContext userContext, IUserService userService) {
            AircashPayoutV2Service = aircashPayoutV2Service;
            UserContext = userContext;
            UserService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRQ checkUserRQV2)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutV2Service.CheckUser(checkUserRQV2.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User), checkUserRQV2.Parameters, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutV2Service.CreatePayout(UserContext.GetPartnerId(User), createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), createPayoutRQ.Parameters, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierCreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var response = await AircashPayoutV2Service.CreatePayout(PartnerId, createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserId.ToString(), createPayoutRQ.Parameters, EnvironmentEnum.Staging);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckCode(CheckCodeDTO checkCodeDTO)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutV2Service.CheckCode(PartnerId, checkCodeDTO.Barcode, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierConfirmTransaction(ConfirmTransactionRQ confirmTransactionRQ)
        {
            var response = await AircashPayoutV2Service.ConfirmTransaction(confirmTransactionRQ.BarCode, PartnerId, UserId, EnvironmentEnum.Staging);
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
