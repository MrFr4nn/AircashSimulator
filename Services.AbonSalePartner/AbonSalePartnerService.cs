using AircashSignature;
using AircashSimulator;
using AircashSimulator.Configuration;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Services.HttpRequest;
using Services.Signature;
using System;
using System.Collections.Generic;
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
        private ISignatureService SignatureService;

        private readonly string CancelCouponEndpoint = "CashRegister/CancelCoupon";
        private readonly string CreateCouponEndpoint = "CashRegister/CreateCoupon";
        private readonly string CreateMultipleCouponsEndpoint = "CashRegister/CreateMultipleCoupons";
        private readonly string CreateMultipleCouponsV2Endpoint = "v2/CashRegister/CreateMultipleCoupons";

        public AbonSalePartnerService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, ISignatureService signatureService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            SignatureService = signatureService;
        }

        public async Task<object> CreateCoupon(decimal value, string pointOfSaleId, Guid partnerId, string isoCurrencySymbol, string partnerTransactionId, string privateKeyPath, string privateKeyPass, EnvironmentEnum environment, string contentType, int? contentWidth)
        {
            var returnResponse=new Response();
            var createCouponResponse=new object();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var createCouponRequest = new CreateCouponRequest()
            {
                PartnerId = partnerId.ToString(),
                Value = value,
                PointOfSaleId = pointOfSaleId,
                ISOCurrencySymbol = isoCurrencySymbol,
                PartnerTransactionId = partnerTransactionId.ToString(),
                ContentType = contentType,
                ContentWidth = contentWidth
            };
            returnResponse.ServiceRequest = createCouponRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(createCouponRequest);
            returnResponse.Sequence = sequence;
            string signature;
            if (privateKeyPath != null)
            {
                signature = AircashSignatureService.GenerateSignature(sequence, privateKeyPath, privateKeyPass);
            }
            else 
            {
                signature = SignatureService.GenerateSignature(partnerId, sequence);
            }
            createCouponRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(createCouponRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Abon)}{CreateCouponEndpoint}");
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
                    UserId = Guid.NewGuid().ToString(),
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
        
        public async Task<object> CancelCoupon(string serialNumber, string pointOfSaleId, Guid partnerId, string partnerTransactionId, string privateKeyPath, string privateKeyPass, EnvironmentEnum environment)
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
                PartnerTransactionId = partnerTransactionId,
                PointOfSaleId = pointOfSaleId,
            };
            returnResponse.ServiceRequest = cancelCouponRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(cancelCouponRequest);
            returnResponse.Sequence = sequence;
            string signature;
            if (privateKeyPath != null)
            {
                signature = AircashSignatureService.GenerateSignature(sequence, privateKeyPath, privateKeyPass);
            }
            else
            {
                signature = SignatureService.GenerateSignature(partnerId, sequence);
            }
            cancelCouponRequest.Signature = signature;
            var response=await HttpRequestService.SendRequestAircash(cancelCouponRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Abon)}{CancelCouponEndpoint}");
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
                        TransactionId = partnerTransactionId,
                        ServiceId = ServiceEnum.AbonCancelled,
                        UserId = Guid.NewGuid().ToString(),
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

        public async Task<object> CreateMultipleCoupons(MultipleCouponABONRequest request, string privateKeyPath, string privateKeyPass, EnvironmentEnum environment)
        {
            var returnResponse = new Response();
            var creationResponses = new List<object>();
            var errorResponse = new object();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;

            returnResponse.ServiceRequest = request;
            var sequence = AircashSignatureService.ConvertObjectToString(request);
            returnResponse.Sequence = sequence;
            string signature;
            if (privateKeyPath != null)
            {
                signature = AircashSignatureService.GenerateSignature(sequence, privateKeyPath, privateKeyPass);
            }
            else
            {
                signature = SignatureService.GenerateSignature(request.PartnerId, sequence);
            }
            request.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Abon)}{CreateMultipleCouponsEndpoint}");
            var responseDateTimeUTC = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponses = JsonConvert.DeserializeObject<List<CreateCouponResponse>>(response.ResponseContent);
                foreach (var successResponse in successResponses)
                {
                    returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
                    Enum.TryParse(request.ISOCurrencySymbol, out CurrencyEnum currencyId);
                    AircashSimulatorContext.Transactions.Add(new TransactionEntity
                    {
                        Amount = successResponse.Value,
                        ISOCurrencyId = currencyId,
                        PartnerId = request.PartnerId,
                        AircashTransactionId = successResponse.SerialNumber,
                        TransactionId = successResponse.PartnerTransactionId,
                        ServiceId = ServiceEnum.AbonIssued,
                        UserId = Guid.NewGuid().ToString(),
                        PointOfSaleId = request.PointOfSaleId,
                        RequestDateTimeUTC = requestDateTimeUTC,
                        ResponseDateTimeUTC = responseDateTimeUTC
                    });
                    creationResponses.Add(successResponse);
                }
                AircashSimulatorContext.SaveChanges();
            }
            else
            {
                errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }

            returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            returnResponse.ServiceResponse = creationResponses.Count == 0 ? errorResponse : creationResponses;
            return returnResponse;
		}

		public async Task<object> CreateMultipleCouponsV2(MultipleCouponABONV2Request request, string privateKeyPath, string privateKeyPass, EnvironmentEnum environment)
		{
			var returnResponse = new Response();
			var creationResponses = new List<object>();
			var errorResponse = new object();
			var requestDateTimeUTC = DateTime.UtcNow;
			returnResponse.RequestDateTimeUTC = requestDateTimeUTC;

			returnResponse.ServiceRequest = request;
			var sequence = AircashSignatureService.ConvertObjectToString(request);
			returnResponse.Sequence = sequence;
			string signature;
			if (privateKeyPath != null)
			{
				signature = AircashSignatureService.GenerateSignature(sequence, privateKeyPath, privateKeyPass);
			}
			else
			{
				signature = SignatureService.GenerateSignature(request.PartnerId, sequence);
			}
			request.Signature = signature;
			var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Abon)}{CreateMultipleCouponsV2Endpoint}");
			var responseDateTimeUTC = DateTime.UtcNow;
			if (response.ResponseCode == System.Net.HttpStatusCode.OK)
			{
				var successResponses = JsonConvert.DeserializeObject<List<CreateCouponResponse>>(response.ResponseContent);
				foreach (var successResponse in successResponses)
				{
					returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
					Enum.TryParse(request.ISOCurrencySymbol, out CurrencyEnum currencyId);
					AircashSimulatorContext.Transactions.Add(new TransactionEntity
					{
						Amount = successResponse.Value,
						ISOCurrencyId = currencyId,
						PartnerId = request.PartnerId,
						AircashTransactionId = successResponse.SerialNumber,
						TransactionId = successResponse.PartnerTransactionId,
						ServiceId = ServiceEnum.AbonIssued,
						UserId = Guid.NewGuid().ToString(),
						PointOfSaleId = request.PointOfSaleId,
						RequestDateTimeUTC = requestDateTimeUTC,
						ResponseDateTimeUTC = responseDateTimeUTC
					});
					creationResponses.Add(successResponse);
				}
				await AircashSimulatorContext.SaveChangesAsync();
			}
			else
			{
				errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
			}

			returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
			returnResponse.ServiceResponse = creationResponses.Count == 0 ? errorResponse : creationResponses;
			return returnResponse;
		}

		public async Task<string> CreateCouponCashier(decimal value, string pointOfSaleId, Guid partnerId, string isoCurrencySymbol, string partnerTransactionId, string privateKeyPath, string privateKeyPass, EnvironmentEnum environment)
        {
            var returnResponse = "";
            var requestDateTimeUTC = DateTime.UtcNow;
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
            var sequence = AircashSignatureService.ConvertObjectToString(createCouponRequest);
            var signature = AircashSignatureService.GenerateSignature(sequence, privateKeyPath, privateKeyPass);
            createCouponRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(createCouponRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Abon)}{CreateCouponEndpoint}");
            var responseDateTimeUTC = DateTime.UtcNow;
            
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<CreateCouponResponse>(response.ResponseContent);
                returnResponse = successResponse.CouponCode;
                Enum.TryParse(isoCurrencySymbol, out CurrencyEnum currencyId);
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = value,
                    ISOCurrencyId = currencyId,
                    PartnerId = partnerId,
                    AircashTransactionId = successResponse.SerialNumber,
                    TransactionId = partnerTransactionId,
                    ServiceId = ServiceEnum.AbonIssued,
                    UserId = Guid.NewGuid().ToString(),
                    PointOfSaleId = pointOfSaleId,
                    RequestDateTimeUTC = requestDateTimeUTC,
                    ResponseDateTimeUTC = responseDateTimeUTC
                });
                AircashSimulatorContext.SaveChanges();
            }
            else
            {
                var createCouponResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
                throw new SimulatorException(SimulatorExceptionErrorEnum.Error, createCouponResponse.Message);
            }
            return returnResponse;
        }
    }
}
