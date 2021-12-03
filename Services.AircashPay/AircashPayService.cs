using AircashSignature;
using AircashSimulator.Configuration;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Services.HttpRequest;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Services.AircashPay
{
    public class AircashPayService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AircashConfiguration AircashConfiguration;

        public AircashPayService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AircashConfiguration> aircashConfiguration)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
        }
        async Task<object> GeneratePartnerCode(string partnerId, decimal amount, string isoCurrencyId, string description, int validForPeriod, string locationId)
        {

            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == new Guid(partnerId)).FirstOrDefault();
            var preparedTransaction = new PreparedAircashTransactionEntity
            {
                PartnerId = new Guid(partnerId),
                Amount = amount,
                ISOCurrencyId = (CurrencyEnum)int.Parse(isoCurrencyId),
                Description = description,
                ValidForPeriod = validForPeriod,
                LocationId = locationId
            };
            AircashSimulatorContext.Add(preparedTransaction);
            AircashSimulatorContext.SaveChanges();
            var aircashGeneratePartnerCodeResponse = new object();
            var aircashGeneratePartnerCodeRequest = new AircashGeneratePartnerCodeRequest
            {
                PartnerId = partnerId,
                Amount = amount,
                ISOCurrencyId = isoCurrencyId,
                Description = description,
                ValidForPeriod = validForPeriod,
                LocationId = locationId

            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashGeneratePartnerCodeRequest);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashGeneratePartnerCodeRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashGeneratePartnerCodeRequest, HttpMethod.Post, $"{AircashConfiguration.BaseUrl}{AircashConfiguration.GeneratePartnerCodeEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashGeneratePartnerCodeResponse = JsonConvert.DeserializeObject<AircashGeneratePartnerCodeResponse>(response.ResponseContent);
            }
            else
            {
                aircashGeneratePartnerCodeResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            return aircashGeneratePartnerCodeResponse;
        }
    }
}
