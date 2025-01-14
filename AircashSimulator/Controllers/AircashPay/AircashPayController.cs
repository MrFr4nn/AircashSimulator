﻿using System;
using AircashSignature;
using Services.AircashPay;
using Domain.Entities.Enum;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AircashSimulator.Extensions;
using Microsoft.Extensions.Options;
using AircashSimulator.Configuration;
using Microsoft.AspNetCore.Authorization;
using AircashSimulator.Controllers.AircashPay;
using Services.User;
using Service.Settings;
using AircashSimulator.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPayController : Controller
    {
        private IAircashPayService AircashPayService;
        private UserContext UserContext;
        private AircashConfiguration AircashConfiguration;
        private IUserService UserService;
        private ISettingsService SettingsService;
        public readonly IHubContext<NotificationHub> _hubContext;
        public AircashPayController(IAircashPayService aircashPayService, UserContext userContext, IOptionsMonitor<AircashConfiguration> aircashConfiguration, IUserService userService, ISettingsService settingsService, IHubContext<NotificationHub> hubContext)
        {
            AircashPayService = aircashPayService;
            UserContext = userContext;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            UserService = userService;
            SettingsService = settingsService;
            _hubContext = hubContext;
        }
        
        [HttpPost]
        public async Task<IActionResult> GeneratePartnerCode(GeneratePartnerCodeRequest generatePartnerCodeRequest)
        {
            var generatePartnerCodeDTO = new GeneratePartnerCodeDTO
            {
                PartnerId = generatePartnerCodeRequest.PartnerId,
                Amount = generatePartnerCodeRequest.Amount,
                Description = generatePartnerCodeRequest.Description,
                LocationId = generatePartnerCodeRequest.LocationID,
                UserId = UserContext.GetUserId(User),
                CurrencyId = generatePartnerCodeRequest.CurrencyId,
                PartnerTransactionId = generatePartnerCodeRequest.PartnerTransactionId,
                ValidForPeriod = generatePartnerCodeRequest.ValidForPeriod,
            };
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayService.GeneratePartnerCode(generatePartnerCodeDTO, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmTransaction(AircashConfirmTransactionRequest aircashConfirmTransactionRequest)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashConfirmTransactionRequest);
            var signature = aircashConfirmTransactionRequest.Signature;
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPayPublicKey}");
            if (valid == true)
            {
                if (aircashConfirmTransactionRequest.Amount > 1000) {
                    return BadRequest(new ConfirmTransactionErrorResponse {
                        ExitTransaction = true,
                        ErrorCode = 4001,
                        ErrorMessage = "Amount over the limit"
                    });
                }
                var transactionDTO = new TransactionDTO
                {
                    Amount = aircashConfirmTransactionRequest.Amount,
                    ISOCurrencyId = (CurrencyEnum)aircashConfirmTransactionRequest.CurrencyID,
                    PartnerId = new Guid(aircashConfirmTransactionRequest.PartnerID),
                    AircashTransactionId = aircashConfirmTransactionRequest.AircashTransactionID,
                    PartnerTransactionId = aircashConfirmTransactionRequest.PartnerTransactionID
                };
                var response = await AircashPayService.ConfirmTransaction(transactionDTO);
                if (((ConfirmResponse)response).ResponseCode == 1)
                {
                    return Ok("Transaction confirmed successfully");
                }
                else
                {
                    return BadRequest("Unable to find transaction");
                }

            }
            else
            {
                return BadRequest("Invalid signatue");
            }
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmTransactionTest(AircashConfirmTransactionRequest aircashConfirmTransactionRequest)
        {
            return Ok("Transaction confirmed successfully");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelTransaction(CancelTransaction cancelTransactionRequest)
        {
            var cancelTransactionDTO = new CancelTransactionDTO
            {
                PartnerId = cancelTransactionRequest.PartnerId,
                PartnerTransactionId = cancelTransactionRequest.PartnerTransactionID,
                UserId = UserContext.GetUserId(User)
            };
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayService.CancelTransaction(cancelTransactionDTO, environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> RefundTransaction(RefundTransaction refundTransactionRequest)
        {
            var refundTransactionDTO = new RefundTransactionDTO
            {
                PartnerId = refundTransactionRequest.PartnerID,
                PartnerTransactionId = refundTransactionRequest.PartnerTransactionID,
                RefundPartnerTransactionId = refundTransactionRequest.RefundTransactionID,
                Amount= refundTransactionRequest.Amount
            };
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPayService.RefundTransaction(refundTransactionDTO, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> GenerateCashierPartnerCode(GeneratePartnerCodeRequest generatePartnerCodeRequest)
        {
            var generatePartnerCodeDTO = new GeneratePartnerCodeDTO
            {
                PartnerId = SettingsService.AcPayPartnerId,
                Amount = generatePartnerCodeRequest.Amount,
                Description = generatePartnerCodeRequest.Description,
                LocationId = generatePartnerCodeRequest.LocationID,
                CurrencyId = 978,
                UserId = Guid.NewGuid().ToString(),
                PartnerTransactionId = generatePartnerCodeRequest.PartnerTransactionId != null? generatePartnerCodeRequest.PartnerTransactionId: Guid.NewGuid().ToString(),
            };

            var response = await AircashPayService.GeneratePartnerCode(generatePartnerCodeDTO, generatePartnerCodeRequest.Environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> GeneratePartnerCodeCashRegister(GeneratePartnerCodeRequest generatePartnerCodeRequest)
        {
            var generatePartnerCodeDTO = new GeneratePartnerCodeDTO
            {
                PartnerId = SettingsService.AcPayCashRegisterId,
                Amount = generatePartnerCodeRequest.Amount,
                Description = generatePartnerCodeRequest.Description,
                LocationId = generatePartnerCodeRequest.LocationID,
                CurrencyId = generatePartnerCodeRequest.CurrencyId,
                UserId = Guid.NewGuid().ToString(),
                PartnerTransactionId = Guid.NewGuid().ToString(),
                ValidForPeriod = 300,
            };
            var response = await AircashPayService.GeneratePartnerCodeCashRegister(generatePartnerCodeDTO, EnvironmentEnum.Staging);
            return Ok(response);
        }

        [HttpPost]
        public async Task ConfirmTransactionCashRegister(AircashConfirmTransactionRequest aircashConfirmTransactionRequest)
        {
            await _hubContext.Clients.All.SendAsync("TransactionStatus", "OK");
        }
    }
}
