using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AircashSignature;
using AircashSimulator.Controllers.AircashPayment;
using AircashSimulator.Configuration;
using Microsoft.Extensions.Options;
using Services.AircashPayment;
using System.Collections.Generic;
using System;
using AircashSimulator.Hubs;
using Microsoft.AspNetCore.SignalR;
using Service.Settings;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPaymentController : Controller
    {
        private ISettingsService SettingsService;
        private AircashConfiguration AircashConfiguration;
        private IAircashPaymentService AircashPaymentService;
        public readonly IHubContext<NotificationHub> _hubContext;

        public AircashPaymentController(IOptionsMonitor<AircashConfiguration> aircashConfiguration,IAircashPaymentService aircashPaymentService, IHubContext<NotificationHub> hubContext, ISettingsService settingsService)
        {
            AircashConfiguration = aircashConfiguration.CurrentValue;
            AircashPaymentService = aircashPaymentService;
            _hubContext = hubContext;
            SettingsService = settingsService;
        }

        public async Task SendHubMessage(string method, string msg, int status)
        {
            await _hubContext.Clients.All.SendAsync(method, msg, status);
        }

        [HttpPost]
        public async Task<IActionResult> CheckPlayer(AircashPaymentCheckPlayer aircashPaymentCheckPlayer)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashPaymentCheckPlayer);
            var signature = aircashPaymentCheckPlayer.Signature;
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPaymentPublicKey}");

            if(valid == true)
            {
                var findUser = new List<CheckPlayerParameters>();
             
                aircashPaymentCheckPlayer.Parameters.ForEach(v => findUser.Add(new CheckPlayerParameters { Key = v.Key, Value = v.Value }));

                var response = await AircashPaymentService.CheckPlayer(findUser);

                if(((CheckPlayerResponse)response).IsPlayer)
                {
                    return Ok(response);
                }
                else
                {
                    return BadRequest(response);
                }
            }
            else
            {
                return BadRequest("Invalid signature");
            }
        }

       [HttpPost]
        public async Task<IActionResult> CreateAndConfirmPayment(AircashPaymentCreateAndConfirmPayment aircashPaymentCreateAndConfirmPayment)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashPaymentCreateAndConfirmPayment);
            var signature = aircashPaymentCreateAndConfirmPayment.Signature;
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPaymentPublicKey}");

            if (valid == true)
            {
                var parameters = new List<CheckPlayerParameters>();
              
                aircashPaymentCreateAndConfirmPayment.Parameters.ForEach(v => parameters.Add(new CheckPlayerParameters { Key = v.Key, Value = v.Value }));

                var send = new CreateAndConfirmPaymentReceive
                {
                    AircashTransactionId = aircashPaymentCreateAndConfirmPayment.TransactionID,
                    Amount = aircashPaymentCreateAndConfirmPayment.Amount,
                    Parameters = parameters
                };
                var response = await AircashPaymentService.CreateAndConfirmPayment(send); 
                if (((AircashPaymentResponse)response).Success == true)
                {
                    await SendHubMessage("TransactionConfirmedMessagePayment", "Deposited: " + aircashPaymentCreateAndConfirmPayment.Amount + "€, time: " + DateTime.Now, 1);
                    return Ok(response);
                }
                else
                {
                    return BadRequest(response);
                } 
;            }
            else
            {
                return BadRequest("Invalid signature");
            }
        }

        [HttpPost]
        public async Task<AircashPaymentCheckPlayer> GenerateSignature(AircashPaymentCheckPlayer aircashPaymentCheckPlayer) {

            var sequence = AircashSignatureService.ConvertObjectToString(aircashPaymentCheckPlayer);
            aircashPaymentCheckPlayer.Signature = AircashSignatureService.GenerateSignature(sequence, SettingsService.TestAircashPaymentPath, SettingsService.TestAircashPaymentPass);
            return aircashPaymentCheckPlayer;
        }
    }
}
