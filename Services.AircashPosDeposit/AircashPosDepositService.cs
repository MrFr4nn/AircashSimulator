using AircashSignature;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
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

        private readonly string AircashCheckUserV4Endpoint = "PartnerV4/CheckUser";
        private readonly string AircashCreatePayoutV4Endpoint = "PartnerV4/CreatePayout";

        public AircashPosDepositService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
        }

        public async Task<object> CheckUser(string phoneNumber, string partnerUserId, Guid partnerId, List<AdditionalParameter> parameters, EnvironmentEnum environment)
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

            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{AircashCheckUserV4Endpoint}");

            returnResponse.ServiceResponse = JsonConvert.DeserializeObject<AircashCheckUserRS>(response.ResponseContent);
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;

            return returnResponse;
        }

        public async Task<object> CreatePayout(Guid partnerId, decimal amount, string phoneNumber, string partnerUserID, List<Parameter> parameters, EnvironmentEnum environment)
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

            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{AircashCreatePayoutV4Endpoint}");

            //var serviceResponse = JsonConvert.DeserializeObject<AircashCreatePayoutRS>(response.ResponseContent);
            //returnResponse.ServiceResponse = serviceResponse;
            var responseDateTimeUTC = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var serviceResponse = JsonConvert.DeserializeObject<AircashCreatePayoutRS>(response.ResponseContent);
                returnResponse.ServiceResponse = serviceResponse;
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
            else
            {
                var serviceResponse = JsonConvert.DeserializeObject<AircashCreatePayoutErrorRS>(response.ResponseContent);
                returnResponse.ServiceResponse = serviceResponse;
            }

            returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;

            return returnResponse;
        }
    }
}
