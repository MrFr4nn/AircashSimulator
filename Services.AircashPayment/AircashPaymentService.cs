using DataAccess;
using System.Threading.Tasks;
using Domain.Entities;
using System;
using Domain.Entities.Enum;
using System.Collections.Generic;
using System.Linq;
using AircashSignature;
using System.Net.Http;
using Services.HttpRequest;
using Service.Settings;
using Newtonsoft.Json;
using System.Globalization;

namespace Services.AircashPayment
{
    public class Response
    {
        public object ServiceRequest { get; set; }
        public object ServiceResponse { get; set; }
        public string Sequence { get; set; }
        public DateTime RequestDateTimeUTC { get; set; }
        public DateTime ResponseDateTimeUTC { get; set; }
    }
    public class AircashPaymentService : IAircashPaymentService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private ISettingsService SettingsService;

        public AircashPaymentService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, ISettingsService settingsService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            SettingsService = settingsService;
        }

        public async Task<object> CheckPlayer(List<AircashPaymentParameters> checkPlayerParameters)
        {
            string UserId = ReturnUser(checkPlayerParameters);

            if (UserId != "")
            {
                var parameters = new List<Parameters>();
                parameters.Add(new Parameters
                {
                    Key = "partnerUserID",
                    Type = "String",
                    Value = UserId.ToString()
                });
                var response = new CheckPlayerResponse
                {
                    IsPlayer = true,
                    Error = null,
                    Parameters = parameters
                };
                 return response;
            }
            else
            {
                var response = new CheckPlayerResponse
                {
                    IsPlayer = false,
                    Error = new ResponseError 
                    {
                        ErrorCode = 500,
                        ErrorMessage = "Unable to find user account"
                    },
                    Parameters = null
                };
                return response;
            } 
        }

        public async Task<object> CreateAndConfirmPayment(CreateAndConfirmPaymentReceive ReceiveData)
        {
            string UserId = ReturnUser(ReceiveData.Parameters);
            if (UserId != "")
            {
                TransactionEntity transactionEntity = new TransactionEntity
                {
                    Amount = ReceiveData.Amount,
                    TransactionId = Guid.NewGuid().ToString(),
                    PartnerId = new Guid("8F62C8F0-7155-4C0E-8EBE-CD9357CFD1BF"),
                    UserId = UserId,
                    AircashTransactionId = ReceiveData.AircashTransactionId,
                    ISOCurrencyId = (CurrencyEnum)978,
                    ServiceId = ServiceEnum.AircashPayment,
                    RequestDateTimeUTC = DateTime.Today,
                    ResponseDateTimeUTC = DateTime.Now,
                };
                AircashSimulatorContext.Transactions.Add(transactionEntity);
                await AircashSimulatorContext.SaveChangesAsync();

                var response = new CreateAndConfirmRS
                {
                    Success = true,
                    PartnerTransactionID = transactionEntity.TransactionId.ToString(),
                    Parameters = {
                    new Parameters
                    {
                      Key = "partnerUserId",
                      Type = "string",
                      Value = UserId.ToString()
                    }
                }
                };
                return response;
            }
            else
              {
                var response = new CreateAndConfirmRS
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
        }

        public async Task<object> CheckPlayerPartner(List<AircashPaymentParameters> checkPlayerParameters , string endpoint)
        {
            var returnResponse = new Response();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var request = new CheckPlayerPartnerRQ
            {
                Parameters = checkPlayerParameters,
            };
            returnResponse.ServiceRequest = request;
            var sequence = AircashSignatureService.ConvertObjectToString(request);
            returnResponse.Sequence = sequence;
            var signature = AircashSignatureService.GenerateSignature(sequence, SettingsService.TestAircashPaymentPath, SettingsService.TestAircashPaymentPass);
            request.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, endpoint);
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;
            returnResponse.ServiceResponse = JsonConvert.DeserializeObject<CheckPlayerResponse>(response.ResponseContent);
            return returnResponse;
        }
        
        public async Task<object> CreateAndConfirmPartner(List<AircashPaymentParameters> checkPlayerParameters, string endpoint, decimal amount, string transactionId)
        {
            var returnResponse = new Response();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var request = new CreateAndConfirmPartnerRQ
            {
                TransactionID = transactionId,
                Parameters = checkPlayerParameters,
                Amount = amount
            };
            returnResponse.ServiceRequest = request;
            var sequence = AircashSignatureService.ConvertObjectToString(request);
            returnResponse.Sequence = sequence;
            var signature = AircashSignatureService.GenerateSignature(sequence, SettingsService.TestAircashPaymentPath, SettingsService.TestAircashPaymentPass);
            request.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, endpoint);
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;
            returnResponse.ServiceResponse = JsonConvert.DeserializeObject<CreateAndConfirmRS>(response.ResponseContent);
            return returnResponse;
        }

        

        public string ReturnUser(List<AircashPaymentParameters> checkPlayerParameters)
        {
            UserEntity user = null;
            if (checkPlayerParameters.Select(attribute => attribute.Key).Contains("username"))
            {
                user = AircashSimulatorContext.Users.FirstOrDefault(v => checkPlayerParameters.Select(attribute => attribute.Value).Contains(v.Username));
            }
            else if (checkPlayerParameters.Select(attribute => attribute.Key).Contains("email"))
            {
                user = AircashSimulatorContext.Users.FirstOrDefault(v => checkPlayerParameters.Select(attribute => attribute.Value).Contains(v.Email));
            }
            return user != null ? user.UserId : "";
        }

    }
}
