using AircashSignature;
using AircashSimulator.Configuration;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.AircashPosDeposit;
using Services.MatchService;
using System;
using System.Collections.Generic;
using System.Linq;
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
        private IMatchService MatchService;

        public AircashPosDepositController(IOptionsMonitor<AircashConfiguration> aircashConfiguration, IMatchService matchService, IAircashPosDepositService aircashPosDepositService, UserContext userContext)
        {
            AircashPosDepositService = aircashPosDepositService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            MatchService = matchService;
            UserContext = userContext;
        }

        [HttpPost]
        public async Task<IActionResult> MatchPersonalData(AircashMatchPersonalData aircashMatchPersonalDataRQ)
        {
            aircashMatchPersonalDataRQ.PartnerID = UserContext.GetPartnerId(User);
            var response = await MatchService.CompareIdentity(aircashMatchPersonalDataRQ);
            return Ok(response);
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

            AircashUserData findUser = new AircashUserData();
            findUser.Identifier = checkPlayerRq.Parameters.Where(v => v.Key == "email" || v.Key == "username").Select(v => v.Value).FirstOrDefault();
            findUser.FirstName = checkPlayerRq.Parameters.Where(v => v.Key == "PayerFirstName").Select(v => v.Value).FirstOrDefault();
            findUser.LastName = checkPlayerRq.Parameters.Where(v => v.Key == "PayerLastName").Select(v => v.Value).FirstOrDefault();
            findUser.BirthDate = checkPlayerRq.Parameters.Where(v => v.Key == "PayerBirthDate").Select(v => v.Value).FirstOrDefault();

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

            AircashCreateAndComfirmData aircashCreateAndComfirmData = new AircashCreateAndComfirmData();

            aircashCreateAndComfirmData.Email = aircashPosDepositCreateAndConfirmPayment.Parameters.Where(v => v.Key == "email").Select(v => v.Value).FirstOrDefault();
            aircashCreateAndComfirmData.CurrencyID = Convert.ToInt32(aircashPosDepositCreateAndConfirmPayment.Parameters.Where(v => v.Key == "currencyID").Select(v => v.Value).FirstOrDefault());

            var send = new CreateAndConfirmPaymentReceive
            {
                AircashTransactionId = aircashPosDepositCreateAndConfirmPayment.TransactionID,
                Amount = aircashPosDepositCreateAndConfirmPayment.Amount,
                Data = aircashCreateAndComfirmData
            };
            var response = await AircashPosDepositService.CreateAndConfirmPayment(send);

            if (((AircashPaymentResponse)response).Success == true) return Ok(response);
            
            return BadRequest(response);
        }
    }
}
