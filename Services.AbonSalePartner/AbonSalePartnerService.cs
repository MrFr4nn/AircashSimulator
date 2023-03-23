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

        public async Task<object> CreateCoupon(decimal value, string pointOfSaleId, Guid partnerId)
        {
            Response returnResponse=new Response();
            var createCouponResponse=new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var transactionId = Guid.NewGuid();
            var createCouponRequest = new CreateCouponRequest()
            {
                PartnerId = partnerId.ToString(),
                Value = value,
                PointOfSaleId = pointOfSaleId,
                ISOCurrencySymbol = ((CurrencyEnum)partner.CurrencyId).ToString(),
                PartnerTransactionId = transactionId.ToString(),
                ContentType = null,
                ContentWidth = null
            };
            returnResponse.ServiceRequest = createCouponRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(createCouponRequest);
            returnResponse.Sequence = sequence;
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            createCouponRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(createCouponRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.Abon)}{CreateCouponEndpoint}");
            if(response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<CreateCouponResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = value,
                    ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                    PartnerId = partnerId,
                    AircashTransactionId = successResponse.SerialNumber,
                    TransactionId = transactionId,
                    ServiceId = ServiceEnum.AbonIssued,
                    UserId = Guid.NewGuid(),
                    PointOfSaleId = createCouponRequest.PointOfSaleId,
                    RequestDateTimeUTC = requestDateTimeUTC,
                    ResponseDateTimeUTC = responseDateTimeUTC
                });

                //spremanje kupona u Coupons tablicu
                AircashSimulatorContext.Coupons.Add(new CouponEntity
                {
                    SerialNumber = successResponse.SerialNumber,
                    PurchasedPartnerID = partner.Id,
                    PurchasedAmount = value,
                    PurchasedCurrency = (CurrencyEnum)partner.CurrencyId,
                    PurchasedCountryIsoCode = partner.CountryCode,
                    PurchasedOnUTC = requestDateTimeUTC,
                    Content = successResponse.Content,
                    CouponCode = successResponse.CouponCode
                });
                AircashSimulatorContext.SaveChanges();
                createCouponResponse = successResponse;
            }
            else
            {
                createCouponResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = createCouponResponse;
            return returnResponse;
        }

        public async Task<object> CancelCoupon(string serialNumber, string pointOfSaleId, Guid partnerId)
        {
            Response returnResponse = new Response();
            var cancelCouponResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var coupon = AircashSimulatorContext.Coupons.Where(x => x.SerialNumber == serialNumber).FirstOrDefault();
            var transaction = AircashSimulatorContext.Transactions.Where(x => x.AircashTransactionId == serialNumber).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            if (coupon == null)
                throw new Exception("Coupon not found");
            
            var cancelCouponRequest = new CancelCouponRequest()
            {
                PartnerId = partnerId.ToString(),
                SerialNumber = serialNumber,
                PartnerTransactionId = transaction.TransactionId.ToString(),
                PointOfSaleId = pointOfSaleId,
            };
            returnResponse.ServiceRequest = cancelCouponRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(cancelCouponRequest);
            returnResponse.Sequence = sequence;
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            cancelCouponRequest.Signature = signature;
            var response=await HttpRequestService.SendRequestAircash(cancelCouponRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.Abon)}{CancelCouponEndpoint}");
            var responseDateTimeUTC = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {   
                   
                coupon.CancelledOnUTC = responseDateTimeUTC;
                
                AircashSimulatorContext.Coupons.Update(coupon);
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = coupon.PurchasedAmount,
                    ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,                       
                    PartnerId = partnerId,
                    AircashTransactionId = $"CTX-{serialNumber}",
                    TransactionId = transaction.TransactionId,
                    ServiceId = ServiceEnum.AbonCancelled,
                    UserId = Guid.NewGuid(),
                    PointOfSaleId = pointOfSaleId,
                    RequestDateTimeUTC = requestDateTimeUTC,
                    ResponseDateTimeUTC = responseDateTimeUTC
                });
                AircashSimulatorContext.SaveChanges();
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
