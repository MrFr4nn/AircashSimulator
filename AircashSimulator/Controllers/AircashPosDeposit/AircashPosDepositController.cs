using AircashSignature;
using AircashSimulator.Configuration;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.AircashPosDeposit;
using Services.MatchService;
using Services.User;
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
        private IUserService UserService;

        public AircashPosDepositController(IOptionsMonitor<AircashConfiguration> aircashConfiguration, IUserService userService, IMatchService matchService, IAircashPosDepositService aircashPosDepositService, UserContext userContext)
        {
            AircashPosDepositService = aircashPosDepositService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            MatchService = matchService;
            UserContext = userContext;
            UserService = userService;
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
            var response = new CheckPlayerResponse();
            var dataToVerify = AircashSignatureService.ConvertObjectToString(checkPlayerRq);
            var signature = checkPlayerRq.Signature;
            var valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPayPublicKey}");

            if (valid != true) 
            {
                response = new CheckPlayerResponse
                {
                    IsPlayer = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 501,
                        ErrorMessage = "Invalid signature"
                    },
                    Parameters = null
                };
                return Ok(response);
            }

            var user = await UserService.GetUserByIdentifier(checkPlayerRq.Parameters.Where(v => v.Key == "email" || v.Key == "username").Select(v => v.Value).FirstOrDefault());
            if (user == null) 
            {
                response = new CheckPlayerResponse
                {
                    IsPlayer = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 500,
                        ErrorMessage = "Unable to find user account"
                    },
                    Parameters = null
                };
                return Ok(response);
            }

            var aircashMatchPersonalData = new AircashMatchPersonalData
            {
                PartnerID = user.PartnerId,
                AircashUser = new PersonalData
                {
                    FirstName = checkPlayerRq.Parameters.Where(v => v.Key == "PayerFirstName").Select(v => v.Value).FirstOrDefault(),
                    LastName = checkPlayerRq.Parameters.Where(v => v.Key == "PayerLastName").Select(v => v.Value).FirstOrDefault(),
                    BirthDate = checkPlayerRq.Parameters.Where(v => v.Key == "PayerBirthDate").Select(v => v.Value).FirstOrDefault()
                },
                PartnerUser = new PersonalData
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    BirthDate = user.BirthDate
                }
            };

            var data = await MatchService.CompareIdentity(aircashMatchPersonalData);

            if (!data.matchResult) {
                response = new CheckPlayerResponse
                {
                    IsPlayer = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 503,
                        ErrorMessage = "Data do not match, Birth date match: " + data.birthDateMatch
                    },
                    Parameters = null
                };
                return Ok(response);
            }

            response = new CheckPlayerResponse
            {
                IsPlayer = true,
                Error = null,
                Parameters = new List<CheckPlayeParameter> 
                {
                    new CheckPlayeParameter
                    {
                        Key = "partnerUserID",
                        Value = user.UserId,
                        Type = "String"
                    }
                }
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAndConfirmPayment(AircashPosDepositCreateAndConfirmPayment aircashPosDepositCreateAndConfirmPayment)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashPosDepositCreateAndConfirmPayment);
            var signature = aircashPosDepositCreateAndConfirmPayment.Signature;
            var valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPayPublicKey}");

            if (valid != true) return BadRequest("Invalid signature");

            var aircashCreateAndComfirmData = new AircashCreateAndComfirmData {
                Email = aircashPosDepositCreateAndConfirmPayment.Parameters.Where(v => v.Key == "email").Select(v => v.Value).FirstOrDefault(),
                CurrencyID = Convert.ToInt32(aircashPosDepositCreateAndConfirmPayment.Parameters.Where(v => v.Key == "currencyID").Select(v => v.Value).FirstOrDefault())
            };

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
