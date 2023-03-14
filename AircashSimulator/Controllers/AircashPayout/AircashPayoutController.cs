using AircashSimulator.Controllers.AircashPayout;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPayout;
using Services.AircashPayoutV2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPayoutController : ControllerBase
    {
        private IAircashPayoutService AircashPayoutService;
        private IAircashPayoutV2Service AircashPayoutV2Service;
        private UserContext UserContext;
        private const string PartnerId = "8F62C8F0-7155-4C0E-8EBE-CD9357CFD1BF";
        private const string UserId = "358B9D22-BB9A-4311-B94D-8F6DAEB38B40";

        public AircashPayoutController(IAircashPayoutService aircashPayoutService, IAircashPayoutV2Service aircashPayoutV2Service, UserContext userContext)
        {
            AircashPayoutService = aircashPayoutService;
            AircashPayoutV2Service = aircashPayoutV2Service;
            UserContext = userContext;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRequest checkUserRequest)
        {
            var response = await AircashPayoutService.CheckUser(checkUserRequest.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User));
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckUserV2(CheckUserRQV2 checkUserRQV2)
        {
            var response = await AircashPayoutV2Service.CheckUser(checkUserRQV2.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User), checkUserRQV2.Parameters);
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
            var partnerId = new Guid(PartnerId);
            var userId = new Guid(UserId);
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, createPayoutRequest.Amount, userId, partnerId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayoutV2(CreatePayoutRQV2 createPayoutRQ)
        {
            var response = await AircashPayoutV2Service.CreatePayout(UserContext.GetPartnerId(User), createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), createPayoutRQ.Parameters);
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
