using AircashSignature;
using AircashSimulator.Configuration;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Services.HttpRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Services.AircashPosDeposit
{
    public class Response
    {
        public object ServiceRequest { get; set; }
        public object ServiceResponse { get; set; }
        public string Sequence { get; set; }
        public DateTime RequestDateTimeUTC { get; set; }
        public DateTime ResponseDateTimeUTC { get; set; }
    }


    public class AircashPosDepositService : IAircashPosDepositService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AircashConfiguration AircashConfiguration;

        public AircashPosDepositService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AircashConfiguration> aircashConfiguration)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
        }
        public async Task<object> MatchPersonalData(AircashMatchPersonalData aircashMatchPersonalData) 
        {
            Response returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == aircashMatchPersonalData.PartnerID).FirstOrDefault();
            var request = new AircashMatchPersonalDataRQ()
            {
                PartnerID = aircashMatchPersonalData.PartnerID.ToString(),
                AircashUser = aircashMatchPersonalData.AircashUser,
                PartnerUser = aircashMatchPersonalData.PartnerUser,
            };

            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.M2)}{AircashConfiguration.MatchCompareIdentity}");

            returnResponse.ServiceResponse = JsonConvert.DeserializeObject<AircashMatchPersonalDataRS>(response.ResponseContent);
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;
  
            return returnResponse;
        }
        public async Task<object> CheckUser(string phoneNumber, string partnerUserId, Guid partnerId, List<AdditionalParameter> parameters)
        {
            Response returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var request = new AircashCheckUserRQ()
            {
                PartnerID = partnerId.ToString(),
                PhoneNumber = phoneNumber,
                PartnerUserID = partnerUserId,
                Parameters = parameters,

            };
            returnResponse.ServiceRequest = request;
            returnResponse.Sequence = AircashSignatureService.ConvertObjectToString(request);

            request.Signature = AircashSignatureService.GenerateSignature(returnResponse.Sequence, partner.PrivateKey, partner.PrivateKeyPass);

            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.M2)}{AircashConfiguration.AircashCheckUserV4Endpoint}");

            returnResponse.ServiceResponse = JsonConvert.DeserializeObject<AircashCheckUserRS>(response.ResponseContent);
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;

            return returnResponse;
        }

        public async Task<object> CreatePayout(Guid partnerId, decimal amount, string phoneNumber, string partnerUserID, List<Parameter> parameters)
        {
            Response returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var request = new AircashCreatePayoutRQ()
            {
                PartnerID = partnerId.ToString(),
                PartnerTransactionID = Guid.NewGuid().ToString(),
                Amount = amount,
                PhoneNumber = phoneNumber,
                PartnerUserID = partnerUserID,
                Parameters = parameters,
                CurrencyID = partner.CurrencyId,

            };
            returnResponse.ServiceRequest = request;
            returnResponse.Sequence = AircashSignatureService.ConvertObjectToString(request);

            request.Signature = AircashSignatureService.GenerateSignature(returnResponse.Sequence, partner.PrivateKey, partner.PrivateKeyPass);

            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.M2)}{AircashConfiguration.AircashCreatePayoutV4Endpoint}");

            var serviceResponse = JsonConvert.DeserializeObject<AircashCreatePayoutRS>(response.ResponseContent);
            returnResponse.ServiceResponse = serviceResponse;
            var responseDateTimeUTC = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = amount,
                    ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                    PartnerId = partnerId,
                    AircashTransactionId = serviceResponse.AircashTransactionID,
                    TransactionId = Guid.Parse(request.PartnerTransactionID),
                    ServiceId = ServiceEnum.AircashPayout,
                    UserId = Guid.Parse(partnerUserID),
                    RequestDateTimeUTC = returnResponse.RequestDateTimeUTC,
                    ResponseDateTimeUTC = responseDateTimeUTC
                });
                AircashSimulatorContext.SaveChanges();
            }

            returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;

            return returnResponse;
        }

        public async Task<object> CheckPlayer(AircashUserData checkPlayer)
        {
            var response = new CheckPlayerResponse();
            UserEntity User = ReturnUser(checkPlayer.Identifier);
            int errorcode = 0;
            string errormessage = "";

            AircashMatchPersonalData aircashMatchPersonalData = new AircashMatchPersonalData();
            PersonalData personalDataUser = new PersonalData();
            personalDataUser.FirstName = User.FirstName;
            personalDataUser.LastName = User.LastName;
            personalDataUser.BirthDate = User.BirthDate.Value.ToString("yyyy-MM-dd");
            PersonalData personalDataRequest = new PersonalData();
            personalDataRequest.FirstName = checkPlayer.FirstName;
            personalDataRequest.LastName = checkPlayer.LastName;
            personalDataRequest.BirthDate = checkPlayer.BirthDate;

            aircashMatchPersonalData.AircashUser = personalDataUser;
            aircashMatchPersonalData.PartnerUser = personalDataRequest;
            aircashMatchPersonalData.PartnerID = User.PartnerId;

            dynamic data = await MatchPersonalData(aircashMatchPersonalData);
            

            if (User == null)
            {
                errorcode = 500;
                errormessage = "Unable to find user account";
            }
            else if (!data.ServiceResponse.matchResult)
            {
                errorcode = 5001;
                errormessage = "Data do not match, Birth date match: "+ data.ServiceResponse.birthDateMatch;
            }
            if (errorcode != 0)
            {
                response = new CheckPlayerResponse
                {
                    IsPlayer = false,
                    Error = new ResponseError
                    {
                        ErrorCode = errorcode,
                        ErrorMessage = errormessage
                    },
                    Parameters = null
                };
                return response;
            }
            var parameters = new List<Parameters>();
            parameters.Add(new Parameters
            {
                Key = "partnerUserID",
                Value = User.UserId.ToString(),
                Type = "String"
            }); 
            response = new CheckPlayerResponse
            {
                IsPlayer = true,
                Error = null,
                Parameters = parameters
            };
            return response;

        }

        public UserEntity ReturnUser(string checkPlayerIdentifier)
        {
            UserEntity user = null;

            user = AircashSimulatorContext.Users.FirstOrDefault(v => checkPlayerIdentifier.Contains(v.Username));
            if (user == null)
            {
                user = AircashSimulatorContext.Users.FirstOrDefault(v => checkPlayerIdentifier.Contains(v.Email));
            }
            return user != null ? user : null;
        }

        public async Task<object> CreateAndConfirmPayment(CreateAndConfirmPaymentReceive ReceiveData)
        {
            var response = new AircashPaymentResponse();
            UserEntity user = ReturnUser(ReceiveData.Data.Email);

            if (user == null)
            {
                response = new AircashPaymentResponse
                {
                    Success = false,
                    Error = new ResponseError
                    {
                        ErrorCode = 500,
                        ErrorMessage = "Unable to find user account"
                    },
                    Parameters = null
                };
                return response;
            }

            TransactionEntity transactionEntity = new TransactionEntity
            {
                Amount = ReceiveData.Amount,
                TransactionId = Guid.NewGuid(),
                PartnerId = new Guid("3fb0c0a6-2bc0-4c9c-b1a9-fc5f8e7c4b20"),
                UserId = user.UserId,
                AircashTransactionId = ReceiveData.AircashTransactionId,
                ISOCurrencyId = (CurrencyEnum)ReceiveData.Data.CurrencyID,
                ServiceId = ServiceEnum.AircashPayment,
                RequestDateTimeUTC = DateTime.Today,
                ResponseDateTimeUTC = DateTime.Now,
            };
            AircashSimulatorContext.Transactions.Add(transactionEntity);
            await AircashSimulatorContext.SaveChangesAsync();

            response = new AircashPaymentResponse
            {
                Success = true,
                PartnerTransactionId = transactionEntity.TransactionId.ToString(),
                Parameters = new List<Parameters>
                {
                new Parameters
                    {
                      Key = "partnerUserId",
                      Value = user.UserId.ToString(),
                      Type = "string"
                    }
                }
            };
            return response;
        }
    }
}
