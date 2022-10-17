﻿using System;
using AircashSignature;
using AircashSimulator.Configuration;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Services.AircashStaticCodePay;
using Microsoft.Extensions.Options;
using Domain.Entities.Enum;
using AircashSimulator.Controllers.AircashPayStaticCode;
using AircashSimulator.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPayStaticCodeController : Controller
    {
        private IAircashStaticCodePayService AircashPayStaticCodeService;
       
        private AircashConfiguration AircashConfiguration;
        public readonly IHubContext<NotificationHub> _hubContext;

        public AircashPayStaticCodeController(IAircashStaticCodePayService aircashPayStaticCodeService, IOptionsMonitor<AircashConfiguration> aircashConfiguration, IHubContext<NotificationHub> hubContext)
        {
            AircashPayStaticCodeService = aircashPayStaticCodeService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
             _hubContext = hubContext; 
        }

        public async Task SendHubMessage(string method, string msg, int status)
        {
            await _hubContext.Clients.All.SendAsync(method,msg,status);
        }

       [HttpPost]
        public async Task<IActionResult> ConfirmTransaction(AircashStaticCodeConfirmTransactionRequest aircashConfirmTransactionRequest)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashConfirmTransactionRequest);
            var signature = aircashConfirmTransactionRequest.Signature;
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPayPublicKey}");  
            
            if (valid == true)
                {
                var transaction = new TransactionDTO
                {
                    Amount = aircashConfirmTransactionRequest.Amount,
                    ISOCurrencyId = (CurrencyEnum)aircashConfirmTransactionRequest.ISOCurrencyID,
                    PartnerId = new Guid(aircashConfirmTransactionRequest.PartnerID),
                    AircashTransactionId = aircashConfirmTransactionRequest.AircashTransactionID,
                    PartnerTransactionId = new Guid(aircashConfirmTransactionRequest.PartnerTransactionID)
                    };
                    var response = await AircashPayStaticCodeService.ConfirmTransaction(transaction);
                    if (((ConfirmResponse)response).ResponseCode == 1)
                    {
                    await SendHubMessage("TransactionConfirmedMessage", "QR Code Payment received, </br>amount: "+transaction.Amount+" "+transaction.ISOCurrencyId+ ", </br>time: " + DateTime.Now, 1);
                    return Ok("Transaction confirmed successfully");
                    }
                    else
                    {
                    await SendHubMessage("TransactionFailedMessage", "Unable to find transaction </br>" + DateTime.Now, 2);
                    return BadRequest("Unable to find transaction");
                    }
                }
                else
                {
                await SendHubMessage("InvalidSignatureMessage", "Invalid signature </br>" + DateTime.Now, 3);
                return BadRequest("Invalid signature");
                }
        }
    }
}
