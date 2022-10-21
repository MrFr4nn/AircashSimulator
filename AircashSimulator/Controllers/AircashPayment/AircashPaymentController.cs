using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AircashSignature;
using AircashSimulator.Controllers.AircashPayment;
using AircashSimulator.Configuration;
using Microsoft.Extensions.Options;
using Services.AircashPayment;
using System;
using System.Collections.Generic;
using DataAccess;
using Domain.Entities.Enum;
using Domain.Entities;
using System.Linq;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPaymentController : Controller
    {
        private AircashConfiguration AircashConfiguration;
        private IAircashPaymentService AircashPaymentService;
        private AircashSimulatorContext AircashSimulatorContext;

        public AircashPaymentController(IOptionsMonitor<AircashConfiguration> aircashConfiguration,IAircashPaymentService aircashPaymentService, AircashSimulatorContext aircashSimulatorContext)
        {
            AircashConfiguration = aircashConfiguration.CurrentValue;
            AircashPaymentService = aircashPaymentService;
            AircashSimulatorContext = aircashSimulatorContext;
        }


        [HttpPost]
        public async Task<IActionResult> CheckPlayer(AircashPaymentCheckPlayer aircashPaymentCheckPlayer)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashPaymentCheckPlayer);
            var signature = aircashPaymentCheckPlayer.Signature;
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPayPublicKey}");

            if(valid == true)
            {
                 var findUser = new List<CheckPlayerParameters>();
               // var findUser = new CheckPlayerParameters 
                //{
                //    Key = aircashPaymentCheckPlayer.Parameters.Key,
                //    Value = aircashPaymentCheckPlayer.Parameters.Value
                //};
                foreach (var d in aircashPaymentCheckPlayer.Parameters)
                {
                    findUser.Add(new CheckPlayerParameters
                    {
                        Key = d.Key,
                        Value = d.Value
                    });
                }


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
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPayPublicKey}");

            if (valid == true)
            {
                var parameters = new List<CheckPlayerParameters>();
                foreach (var d in aircashPaymentCreateAndConfirmPayment.Parameters)
                {
                    parameters.Add(new CheckPlayerParameters
                    {
                        Key = d.Key,
                        Value = d.Value
                    });
                }
                var send = new CreateAndConfirmPaymentReceive
                {
                    AircashTransactionId = aircashPaymentCreateAndConfirmPayment.TransactionID,
                    Amount = aircashPaymentCreateAndConfirmPayment.Amount,
                    Parameters = parameters
                };

                var response = await AircashPaymentService.CreateAndConfirmPayment(send); 
                if (((AircashPaymentResponse)response).Success == true)
                {
                    //return Ok("Transaction confirmed successfully");
                    return Ok(response);
                }
                else
                {
                    return BadRequest("Unable to find transaction");
                } 
               
;            }
            else
            {
                return BadRequest("Invalid signature");
            }
        }



    }
}
