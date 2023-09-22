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
        public async Task<IActionResult> CheckPlayerPartner(CheckPlayerPartnerRequest checkPlayerPartnerRequest)
        {
            var response = await AircashPaymentService.CheckPlayerPartner(checkPlayerPartnerRequest.Parameters, checkPlayerPartnerRequest.Endpoint);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAndConfirmPartner(CreateAndConfirmPartnerRequest createAndConfirmPartnerRequest)
        {
            var response = await AircashPaymentService.CreateAndConfirmPartner(createAndConfirmPartnerRequest.Parameters, createAndConfirmPartnerRequest.Endpoint, createAndConfirmPartnerRequest.Amount, createAndConfirmPartnerRequest.TransactionId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckPlayer(AircashPaymentCheckPlayer aircashPaymentCheckPlayer)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashPaymentCheckPlayer);
            var signature = aircashPaymentCheckPlayer.Signature;
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPaymentPublicKey}");

            if(valid == true)
            {
                var findUser = new List<AircashPaymentParameters>();
             
                aircashPaymentCheckPlayer.Parameters.ForEach(v => findUser.Add(new AircashPaymentParameters { Key = v.Key, Value = v.Value }));

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
                var parameters = new List<AircashPaymentParameters>();

                aircashPaymentCreateAndConfirmPayment.Parameters.ForEach(v => parameters.Add(new AircashPaymentParameters { Key = v.Key, Value = v.Value }));

                var send = new CreateAndConfirmPaymentReceive
                {
                    AircashTransactionId = aircashPaymentCreateAndConfirmPayment.TransactionID,
                    Amount = aircashPaymentCreateAndConfirmPayment.Amount,
                    Parameters = parameters
                };
                var response = await AircashPaymentService.CreateAndConfirmPayment(send);
                if (((CreateAndConfirmRS)response).Success == true)
                {
                    await SendHubMessage("TransactionConfirmedMessagePayment", "Deposited: " + aircashPaymentCreateAndConfirmPayment.Amount + "€, time: " + DateTime.Now, 1);
                }
                return Ok(response);
            }
            else
            {
                return BadRequest("Invalid signature");
            }
        }

        [HttpPost]
        public async Task<object> GenerateCheckPlayerSignature(AircashPaymentCheckPlayer aircashPaymentCheckPlayer) {

            var sequence = AircashSignatureService.ConvertObjectToString(aircashPaymentCheckPlayer);
            aircashPaymentCheckPlayer.Signature = AircashSignatureService.GenerateSignature(sequence, SettingsService.TestAircashPaymentPath, SettingsService.TestAircashPaymentPass);
            
        
            return new  {AircashPaymentCheckPlayer = aircashPaymentCheckPlayer,Sequence = sequence}; ;
        }

        [HttpPost]
        public async Task<object> GenerateCreateAndConfirmSignature(AircashPaymentCreateAndConfirmPayment aircashPaymentCreateAndConfirmPayment)
        {
            aircashPaymentCreateAndConfirmPayment.TransactionID = Guid.NewGuid().ToString();
            var sequence = AircashSignatureService.ConvertObjectToString(aircashPaymentCreateAndConfirmPayment);
            aircashPaymentCreateAndConfirmPayment.Signature = AircashSignatureService.GenerateSignature(sequence, SettingsService.TestAircashPaymentPath, SettingsService.TestAircashPaymentPass);
            return new{AircashPaymentCreateAndConfirmPayment = aircashPaymentCreateAndConfirmPayment,Sequence = sequence}; ;
        }
    }
}
