﻿using AircashSimulator.Controllers.AircashC2DPayout;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPayoutV2;
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
        private readonly Guid PartnerId = new Guid("386bf082-d1b5-42e1-9852-8077b7f704c6");
        private readonly Guid UserId = new Guid("358B9D22-BB9A-4311-B94D-8F6DAEB38B40");
        public AircashC2DPayoutController(IAircashPayoutV2Service aircashPayoutV2Service, UserContext userContext, IHelperService helperService) {
            AircashPayoutV2Service = aircashPayoutV2Service;
            UserContext = userContext;
            HelperService = helperService;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRQ checkUserRQV2)
        {
            var response = await AircashPayoutV2Service.CheckUser(checkUserRQV2.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User), checkUserRQV2.Parameters);
            return Ok(response);
        }
        public object GetCurlCheckUser(CheckUserRQ checkUserRQV2)
        {
            var user = UserContext.GetPartnerId(User);
            var request =AircashPayoutV2Service.GetCheckUserRequest(checkUserRQV2.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User), checkUserRQV2.Parameters);
            var curl = HelperService.GetCurl(request, AircashPayoutV2Service.GetCheckUserEndpoint(UserContext.GetPartnerId(User)));
            return Ok(curl);
        }
        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var response = await AircashPayoutV2Service.CreatePayout(UserContext.GetPartnerId(User), createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), createPayoutRQ.Parameters);
            return Ok(response);
        }
        public object GetCurlCreatePayout(CreatePayoutRQ createPayoutRQ)
        {
      
            var request =  AircashPayoutV2Service.GetCreatePayoutRequest(UserContext.GetPartnerId(User), createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), createPayoutRQ.Parameters);
            var curl = HelperService.GetCurl(request, AircashPayoutV2Service.GetCreatePayoutEndpoint(UserContext.GetPartnerId(User)));
            return Ok(curl);
        }

        [HttpPost]
        public async Task<IActionResult> CashierCreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var response = await AircashPayoutV2Service.CreatePayout(PartnerId, createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserId.ToString(), createPayoutRQ.Parameters);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckCode(CheckCodeDTO checkCodeDTO)
        {
            var response = await AircashPayoutV2Service.CheckCode(PartnerId, checkCodeDTO.Barcode);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierConfirmTransaction(ConfirmTransactionRQ confirmTransactionRQ)
        {
            var response = await AircashPayoutV2Service.ConfirmTransaction(confirmTransactionRQ.BarCode, PartnerId, UserId);
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
