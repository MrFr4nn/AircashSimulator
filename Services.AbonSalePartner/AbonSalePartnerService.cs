using AircashSignature;
using AircashSimulator;
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


namespace Services.AbonSalePartner
{
    public class Response
    {
        public object ServiceRequest { get; set; }
        public object ServiceResponse { get; set; }
        public string Sequence { get; set; }
        public DateTime RequestDateTimeUTC { get; set; }
        public DateTime ResponseDateTimeUTC { get; set; }
    }
    public class AbonSalePartnerService : IAbonSalePartnerService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;

        private readonly string CancelCouponEndpoint = "CashRegister/CancelCoupon";
        private readonly string CreateCouponEndpoint = "CashRegister/CreateCoupon";

        public AbonSalePartnerService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
        }

        public async Task<object> CreateCoupon(decimal value, string pointOfSaleId, Guid partnerId, string isoCurrencySymbol, Guid partnerTransactionId, string privateKeyPath, string privateKeyPass)
        {
            var returnResponse=new Response();
            var createCouponResponse=new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var createCouponRequest = new CreateCouponRequest()
            {
                PartnerId = partnerId.ToString(),
                Value = value,
                PointOfSaleId = pointOfSaleId,
                ISOCurrencySymbol = isoCurrencySymbol,
                PartnerTransactionId = partnerTransactionId.ToString(),
                ContentType = null,
                ContentWidth = null
            };
            returnResponse.ServiceRequest = createCouponRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(createCouponRequest);
            returnResponse.Sequence = sequence;
            var signature = AircashSignatureService.GenerateSignature(sequence, privateKeyPath, privateKeyPass);
            createCouponRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(createCouponRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner != null? partner.Environment : EnvironmentEnum.Staging, EndpointEnum.Abon)}{CreateCouponEndpoint}");
            var responseDateTimeUTC = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<CreateCouponResponse>(response.ResponseContent);
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
                Enum.TryParse(isoCurrencySymbol, out CurrencyEnum currencyId);
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = value,
                    ISOCurrencyId = currencyId,
                    PartnerId = partnerId,
                    AircashTransactionId = successResponse.SerialNumber,
                    TransactionId = partnerTransactionId,
                    ServiceId = ServiceEnum.AbonIssued,
                    UserId = Guid.NewGuid(),
                    PointOfSaleId = pointOfSaleId,
                    RequestDateTimeUTC = requestDateTimeUTC,
                    ResponseDateTimeUTC = responseDateTimeUTC
                });
                AircashSimulatorContext.SaveChanges();
                createCouponResponse = successResponse;
            }
            else
            {
                createCouponResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            returnResponse.ServiceResponse = createCouponResponse;
            return returnResponse;
        }

        public async Task<object> CancelCoupon(string serialNumber, string pointOfSaleId, Guid partnerId, string privateKeyPath, string privateKeyPass)
        {
            var returnResponse = new Response();
            var cancelCouponResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var cancelCouponRequest = new CancelCouponRequest()
            {
                PartnerId = partnerId.ToString(),
                SerialNumber = serialNumber,
                PointOfSaleId = pointOfSaleId,
            };
            returnResponse.ServiceRequest = cancelCouponRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(cancelCouponRequest);
            returnResponse.Sequence = sequence;
            var signature = AircashSignatureService.GenerateSignature(sequence, privateKeyPath, privateKeyPass);
            cancelCouponRequest.Signature = signature;
            var response=await HttpRequestService.SendRequestAircash(cancelCouponRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner != null? partner.Environment: EnvironmentEnum.Staging, EndpointEnum.Abon)}{CancelCouponEndpoint}");
            var responseDateTimeUTC = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var transaction = AircashSimulatorContext.Transactions.Where(x => x.AircashTransactionId == serialNumber).FirstOrDefault();

                if (transaction != null)
                {
                    AircashSimulatorContext.Transactions.Add(new TransactionEntity
                    {
                        Amount = transaction.Amount,
                        ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                        PartnerId = partnerId,
                        AircashTransactionId = $"CTX-{serialNumber}",
                        TransactionId = Guid.Empty,
                        ServiceId = ServiceEnum.AbonCancelled,
                        UserId = Guid.NewGuid(),
                        PointOfSaleId = pointOfSaleId,
                        RequestDateTimeUTC = requestDateTimeUTC,
                        ResponseDateTimeUTC = responseDateTimeUTC
                    });
                    AircashSimulatorContext.SaveChanges();
                }
                cancelCouponResponse = "HTTP 200 OK";
            }
            else
            {
                cancelCouponResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            returnResponse.ServiceResponse = cancelCouponResponse;
            return returnResponse;
        }
    }
}
