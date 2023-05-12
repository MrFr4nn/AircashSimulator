using AircashSimulator.Controllers.AircashPayout;
using AircashSimulator.Extensions;
using Domain.Entities.Enum;
using Microsoft.AspNetCore.Mvc;
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
        private IAircashPayoutService AircashPayoutService;
        private UserContext UserContext;
        private IUserService UserService;
        private readonly Guid PartnerId = new Guid("0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6");
        private readonly Guid UserId = new Guid("358B9D22-BB9A-4311-B94D-8F6DAEB38B40");

        public AircashPayoutController(IAircashPayoutService aircashPayoutService, UserContext userContext, IUserService userService)
        {
            AircashPayoutService = aircashPayoutService;
            UserContext = userContext;
            UserService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRequest checkUserRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutService.CheckUser(checkUserRequest.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User), environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRequest createPayoutRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, createPayoutRequest.Amount, UserContext.GetUserId(User), UserContext.GetPartnerId(User), environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCashierPayout(CreatePayoutRequest createPayoutRequest)
        {
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, createPayoutRequest.Amount, UserId, PartnerId, EnvironmentEnum.Staging);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayoutService.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionId, environment);
            return Ok(response);
        }
    }

}
