using AircashSignature;
using AircashSimulator.Configuration;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.AircashPosDeposit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPosDepositController : ControllerBase
    {
        private UserContext UserContext;
        private AircashConfiguration AircashConfiguration;
        private IAircashPosDepositService AircashPosDepositService;

        public AircashPosDepositController(IOptionsMonitor<AircashConfiguration> aircashConfiguration, IAircashPosDepositService aircashPosDepositService, UserContext userContext)
        {
            AircashPosDepositService = aircashPosDepositService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            UserContext = userContext;
        }

        [HttpPost]
        public async Task<IActionResult> MatchPersonalData(PersonalDataToCompare personalDataToCompare)
        {
            return Ok();
        }


        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRQ checkUserRQ)
        {
            var response = await AircashPosDepositService.CheckUser(checkUserRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User), checkUserRQ.Parameters);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var response = await AircashPosDepositService.CreatePayout(UserContext.GetPartnerId(User), createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), createPayoutRQ.Parameters);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckPlayer(CheckPlayerRQ checkPlayerRq)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(checkPlayerRq);
            var signature = checkPlayerRq.Signature;
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPayPublicKey}");

            if (valid != true) 
                return BadRequest("Invalid signature");

            var findUser = new List<CheckPlayerParameters>();
            checkPlayerRq.Parameters.ForEach(v => findUser.Add(new CheckPlayerParameters { Key = v.Key, Value = v.Value }));
            var response = await AircashPosDepositService.CheckPlayer(findUser);

            if (!((CheckPlayerResponse)response).IsPlayer) 
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAndConfirmPayment(AircashPosDepositCreateAndConfirmPayment aircashPosDepositCreateAndConfirmPayment)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashPosDepositCreateAndConfirmPayment);
            var signature = aircashPosDepositCreateAndConfirmPayment.Signature;
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPayPublicKey}");

            if (valid != true) return BadRequest("Invalid signature");

            var parameters = new List<CheckPlayerParameters>();
            aircashPosDepositCreateAndConfirmPayment.Parameters.ForEach(v => parameters.Add(new CheckPlayerParameters { Key = v.Key, Value = v.Value }));

            var send = new CreateAndConfirmPaymentReceive
            {
                AircashTransactionId = aircashPosDepositCreateAndConfirmPayment.TransactionID,
                Amount = aircashPosDepositCreateAndConfirmPayment.Amount,
                Parameters = parameters
            };
            var response = await AircashPosDepositService.CreateAndConfirmPayment(send);

            if (((AircashPaymentResponse)response).Success == true) return Ok(response);
            
            return BadRequest(response);
        }
    }
}
