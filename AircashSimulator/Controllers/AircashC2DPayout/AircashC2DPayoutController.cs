using AircashSimulator.Controllers.AircashC2DPayout;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPayoutV2;
using Services.User;
using System.Collections.Generic;
using System.Linq;
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
        private const string PARTNER_ID = "8F62C8F0-7155-4C0E-8EBE-CD9357CFD1BF";
        private const string USER_ID = "358B9D22-BB9A-4311-B94D-8F6DAEB38B40";
        public AircashC2DPayoutController(IAircashPayoutV2Service aircashPayoutV2Service, UserContext userContext, IUserService userService) {
            AircashPayoutV2Service = aircashPayoutV2Service;
            UserContext = userContext;
            UserService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRQ checkUserRQV2)
        {
            var response = await AircashPayoutV2Service.CheckUser(checkUserRQV2.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User), checkUserRQV2.Parameters);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var response = await AircashPayoutV2Service.CreatePayout(UserContext.GetPartnerId(User), createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), createPayoutRQ.Parameters);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierCreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var response = await AircashPayoutV2Service.CreatePayout(new Guid(PARTNER_ID), createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, USER_ID, createPayoutRQ.Parameters);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckCode(CheckCodeDTO checkCodeDTO)
        {
            var response = await AircashPayoutV2Service.CheckCode(new Guid(PARTNER_ID), checkCodeDTO.Barcode);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierConfirmTransaction(ConfirmTransactionRQ confirmTransactionRQ)
        {
            var response = await AircashPayoutV2Service.ConfirmTransaction(confirmTransactionRQ.BarCode, new Guid(PARTNER_ID), new Guid(USER_ID));
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var response = await AircashPayoutV2Service.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionId);
            return Ok(response);
        }

    }
}
