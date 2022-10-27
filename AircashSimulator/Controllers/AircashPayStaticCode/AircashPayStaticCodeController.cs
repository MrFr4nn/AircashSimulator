using System;
using AircashSignature;
using AircashSimulator.Configuration;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Domain.Entities.Enum;
using AircashSimulator.Controllers.AircashPayStaticCode;
using AircashSimulator.Hubs;
using Microsoft.AspNetCore.SignalR;
using Services.AircashPayStaticCode;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPayStaticCodeController : Controller
    {
        private IAircashPayStaticCodeService AircashPayStaticCodeService;
       
        private AircashConfiguration AircashConfiguration;
        public readonly IHubContext<NotificationHub> _hubContext;

        public AircashPayStaticCodeController(IAircashPayStaticCodeService aircashPayStaticCodeService, IOptionsMonitor<AircashConfiguration> aircashConfiguration, IHubContext<NotificationHub> hubContext)
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
        public async Task<IActionResult> ConfirmTransaction(AircashPayStaticCodeConfirmTransactionRequest aircashConfirmTransactionRequest)
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
                    if (true)
                    {
                    await SendHubMessage("TransactionConfirmedMessage", "QR Code Payment received, </br>amount: "+transaction.Amount+" "+transaction.ISOCurrencyId+ ", </br>time: " + DateTime.Now, 1);
                    return Ok("Transaction confirmed successfully");
                    }
                }
                else
                {
                return BadRequest("Invalid signature");
                }
        }

        [HttpPost]
        public async Task<IActionResult> GenerateQRLink(GenerateQRLinkRequest generateQRLinkRequest)
        {
            GenerateQRLinkDTO parameters = new GenerateQRLinkDTO
            {
                Amount = generateQRLinkRequest.Amount,
                Currency = generateQRLinkRequest.Currency,
                Location = generateQRLinkRequest.Location

            };
             var response = await AircashPayStaticCodeService.GenerateQRLink(parameters);
             return Ok(response);  
        }
    }
}
