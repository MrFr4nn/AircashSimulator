using AircashSignature;
using AircashSimulator.Configuration;
using AircashSimulator.Extensions;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
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
        private AircashSimulatorContext AircashSimulatorContext;
        private IAircashPosDepositService AircashPosDepositService;
        private IMatchService MatchService;
        private IUserService UserService;
        private const decimal MinAmout = 1;
        private const decimal MaxAmout = 1000;
        private const string BlockedUsername = "BLOCKED_USERNAME";
        private const string BlockedEmail = "BLOCKED_USER@gmail.com";
        private const string PartnerId = "3fb0c0a6-2bc0-4c9c-b1a9-fc5f8e7c4b20";

        public AircashPosDepositController(IOptionsMonitor<AircashConfiguration> aircashConfiguration, AircashSimulatorContext aircashSimulatorContext, IUserService userService, IMatchService matchService, IAircashPosDepositService aircashPosDepositService, UserContext userContext)
        {
            AircashPosDepositService = aircashPosDepositService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            MatchService = matchService;
            UserContext = userContext;
            UserService = userService;
            AircashSimulatorContext = aircashSimulatorContext;
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
            var valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPaymentPublicKey}");

            if (valid != true) 
            {
                return Ok(new CheckPlayerResponse
                {
                    IsPlayer = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 501,
                        ErrorMessage = "Invalid signature"
                    },
                    Parameters = null
                });
            }

            var user = await UserService.GetUserByIdentifier(checkPlayerRq.Parameters.Where(v => v.Key == "email" || v.Key == "username").Select(v => v.Value).FirstOrDefault());
            if (user == null) 
            {
                return Ok(new CheckPlayerResponse
                {
                    IsPlayer = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 500,
                        ErrorMessage = "Unable to find user account"
                    },
                    Parameters = null
                });
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

            if (!data.matchResult) 
            {
                return Ok(new CheckPlayerResponse
                {
                    IsPlayer = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 503,
                        ErrorMessage = "Data do not match, Birth date match: " + data.birthDateMatch
                    },
                    Parameters = null
                });
            }

            return Ok(new CheckPlayerResponse
            {
                IsPlayer = true,
                Error = null,
                Parameters = new List<CheckPlayerParameter>
                {
                    new CheckPlayerParameter
                    {
                        Key = "partnerUserID",
                        Value = user.UserId.ToString(),
                        Type = "String"
                    }
                }
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateAndConfirmPayment(AircashPosDepositCreateAndConfirmPayment aircashPosDepositCreateAndConfirmPayment)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashPosDepositCreateAndConfirmPayment);
            var signature = aircashPosDepositCreateAndConfirmPayment.Signature;
            var valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPaymentPublicKey}");

            if (valid != true)
            {
                return Ok(new AircashCreateAndConfirmResponseError
                {
                    Success = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 501,
                        ErrorMessage = "Invalid signature"
                    },
                    Parameters = null
                });
            }

            var identifier = aircashPosDepositCreateAndConfirmPayment.Parameters.Where(v => v.Key == "email" || v.Key == "username").Select(v => v.Value).FirstOrDefault();
            if (BlockedUsername == identifier || BlockedEmail == identifier)
            {
                return Ok(new AircashCreateAndConfirmResponseError
                {
                    Success = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 505,
                        ErrorMessage = "Account is blocked"
                    },
                    Parameters = null
                });
            }

            var user = await UserService.GetUserByIdentifier(identifier);
            if (user == null)
            {
                return Ok(new AircashCreateAndConfirmResponseError
                {
                    Success = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 500,
                        ErrorMessage = "Unable to find user account"
                    },
                    Parameters = null
                });
            }

            if (aircashPosDepositCreateAndConfirmPayment.Amount < MinAmout) 
            {
                return Ok(new AircashCreateAndConfirmResponseError
                {
                    Success = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 502,
                        ErrorMessage = "Amount smaller then limit"
                    },
                    Parameters = null
                });
            } 
            if (aircashPosDepositCreateAndConfirmPayment.Amount > MaxAmout) 
            {
                return Ok(new AircashCreateAndConfirmResponseError
                {
                    Success = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 503,
                        ErrorMessage = "Amout bigger then limit"
                    },
                    Parameters = null
                });
            }

            var transactionEntity = new TransactionEntity
            {
                Amount = aircashPosDepositCreateAndConfirmPayment.Amount,
                TransactionId = Guid.NewGuid(),
                PartnerId = new Guid(PartnerId),
                UserId = user.UserId,
                AircashTransactionId = aircashPosDepositCreateAndConfirmPayment.TransactionID,
                ISOCurrencyId = (CurrencyEnum)Convert.ToInt32(aircashPosDepositCreateAndConfirmPayment.Parameters.Where(v => v.Key == "currencyID").Select(v => v.Value).FirstOrDefault()),
                ServiceId = ServiceEnum.AircashPayment,
                RequestDateTimeUTC = DateTime.Today,
                ResponseDateTimeUTC = DateTime.Now,
            };
            AircashSimulatorContext.Transactions.Add(transactionEntity);
            await AircashSimulatorContext.SaveChangesAsync();

            return Ok(new AircashCreateAndConfirmResponseSuccess
            {
                Success = true,
                PartnerTransactionId = transactionEntity.TransactionId.ToString(),
                Parameters = new List<CheckPlayerParameter>
                {
                new CheckPlayerParameter
                    {
                      Key = "partnerUserId",
                      Value = user.UserId.ToString(),
                      Type = "string"
                    }
                }
            });
        }
    }
}
