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
    public class AircashPayService : IAircashPayService
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
        public async Task<object> GeneratePartnerCode(GeneratePartnerCodeDTO generatePartnerCodeDTO)
        {

            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == generatePartnerCodeDTO.PartnerId).FirstOrDefault();
            var preparedTransaction = new PreparedAircashTransactionEntity
            {
                PartnerId = generatePartnerCodeDTO.PartnerId,
                Amount = generatePartnerCodeDTO.Amount,
                ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                PartnerTransactionId = Guid.NewGuid(),
                Description = generatePartnerCodeDTO.Description,
                ValidForPeriod = int.Parse($"{ AircashConfiguration.ValidForPeriod }"),
                LocationId = generatePartnerCodeDTO.LocationId
            };
            AircashSimulatorContext.Add(preparedTransaction);
            AircashSimulatorContext.SaveChanges();
            var aircashGeneratePartnerCodeResponse = new object();
            var aircashGeneratePartnerCodeRequest = new AircashGeneratePartnerCodeRequest 
            {
                PartnerID = preparedTransaction.PartnerId,
                Amount = preparedTransaction.Amount,
                CurrencyID = preparedTransaction.ISOCurrencyId,
                PartnerTransactionID = preparedTransaction.PartnerTransactionId,
                Description = preparedTransaction.Description,
                LocationID = preparedTransaction.LocationId
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

        public Task<object> ConfirmTransaction(TransactionDTO transactionDTO)
        {
            AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = transactionDTO.Amount,
                    ISOCurrencyId = (CurrencyEnum)transactionDTO.ISOCurrencyId,
                    PartnerId = transactionDTO.PartnerId,
                    AircashTransactionId = transactionDTO.AircashTransactionId,
                    TransactionId = transactionDTO.PartnerTransactionId,
                    ServiceId = ServiceEnum.AircashPayment,
                    UserId = transactionDTO.UserId,
                    RequestDateTimeUTC = DateTime.UtcNow,
                    ResponseDateTimeUTC = DateTime.UtcNow
                });
            return (Task<object>)new object();
        }
    }
}
