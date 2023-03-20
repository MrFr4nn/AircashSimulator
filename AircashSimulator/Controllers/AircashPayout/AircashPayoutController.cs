using AircashSimulator.Controllers.AircashPayout;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPayout;
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
        //private readonly Guid PartnerId = new Guid("0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6");
        private readonly Guid PartnerId = new Guid("8F62C8F0-7155-4C0E-8EBE-CD9357CFD1BF");
        private readonly Guid UserId = new Guid("358B9D22-BB9A-4311-B94D-8F6DAEB38B40");

        public AircashPayoutController(IAircashPayoutService aircashPayoutService, UserContext userContext)
        {
            AircashPayoutService = aircashPayoutService;
            UserContext = userContext;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRequest checkUserRequest)
        {
            var response = await AircashPayoutService.CheckUser(checkUserRequest.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User));
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRequest createPayoutRequest)
        {
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, createPayoutRequest.Amount, UserContext.GetUserId(User), UserContext.GetPartnerId(User));
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCashierPayout(CreatePayoutRequest createPayoutRequest)
        {
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, createPayoutRequest.Amount, UserId, PartnerId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var response = await AircashPayoutService.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionId);
            return Ok(response);
        }
    }

}
