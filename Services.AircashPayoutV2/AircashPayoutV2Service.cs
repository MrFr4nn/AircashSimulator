﻿using DataAccess;
using Services.HttpRequest;
using System;
using System.Linq;
using AircashSignature;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using Domain.Entities;
using Domain.Entities.Enum;
using System.Collections.Generic;
using Services.Signature;

namespace Services.AircashPayoutV2
{
    public class Response
    {
        public object ServiceRequest { get; set; }
        public object ServiceResponse { get; set; }
        public string Sequence { get; set; }
        public DateTime RequestDateTimeUTC { get; set; }
        public DateTime ResponseDateTimeUTC { get; set; }
    }
    public class AircashPayoutV2Service : IAircashPayoutV2Service
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private ISignatureService SignatureService;

        private readonly string AircashCheckUserV4Endpoint = "PartnerV4/CheckUser";
        private readonly string AircashCreatePayoutV4Endpoint = "PartnerV4/CreatePayout";
        private readonly string ConfirmTransactionEndpoint = "SalesPartner/ConfirmTransaction";
        private readonly string CheckTransactionStatusEndpoint = "PartnerV2/CheckTransactionStatus";
        private readonly string SalesPartnerV2CheckCode = "SalesPartnerV2/CheckCode";

        public AircashPayoutV2Service(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, ISignatureService signatureService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            SignatureService = signatureService;
        }

        public async Task<object> CheckUser(string phoneNumber, string partnerUserId, Guid partnerId, List<Parameters> parameters, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var request = GetCheckUserRequest(phoneNumber, partnerUserId, partnerId, parameters);
            returnResponse.ServiceRequest = request;
            returnResponse.Sequence = AircashSignatureService.ConvertObjectToString(request);
            request.Signature = SignatureService.GenerateSignature(partnerId, returnResponse.Sequence);
            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, GetCheckUserEndpoint(environment));

            returnResponse.ServiceResponse = JsonConvert.DeserializeObject<AircashCheckUserResponse>(response.ResponseContent);
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;

            return returnResponse;
        }
        public AircashCheckUserRQ GetCheckUserRequest(string phoneNumber, string partnerUserId, Guid partnerId, List<Parameters> parameters)
        {
            Response returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var request = new AircashCheckUserRQ()
            {
                PartnerID = partnerId.ToString(),
                PhoneNumber = phoneNumber,
                PartnerUserID = partnerUserId,
                Parameters = parameters,

            };
            returnResponse.Sequence = AircashSignatureService.ConvertObjectToString(request);
            request.Signature = SignatureService.GenerateSignature(partnerId, returnResponse.Sequence);

            return request;
        }
        public string GetCheckUserEndpoint(EnvironmentEnum environment)
        {
           
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{AircashCheckUserV4Endpoint}";
        }
        public async Task<object> CreatePayout(Guid partnerId, decimal amount, string phoneNumber, string partnerUserID, List<Parameters> parameters, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var request = GetCreatePayoutRequest(partnerId, amount, phoneNumber, partnerUserID, parameters);
            returnResponse.ServiceRequest = request;
            returnResponse.Sequence = AircashSignatureService.ConvertObjectToString(request);

            request.Signature = SignatureService.GenerateSignature(partnerId, returnResponse.Sequence);
            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, GetCreatePayoutEndpoint(environment));
            var responseDateTimeUTC = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var serviceResponse = JsonConvert.DeserializeObject<AircashCreatePayoutRS>(response.ResponseContent);
                returnResponse.ServiceResponse = serviceResponse;
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = amount,
                    ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                    PartnerId = partnerId,
                    AircashTransactionId = serviceResponse.AircashTransactionID,
                    TransactionId = request.PartnerTransactionID,
                    ServiceId = ServiceEnum.AircashPayout,
                    UserId = partnerUserID,
                    RequestDateTimeUTC = returnResponse.RequestDateTimeUTC,
                    ResponseDateTimeUTC = responseDateTimeUTC
                });
                AircashSimulatorContext.SaveChanges();
            }
            else 
            {
                returnResponse.ServiceResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }

            returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;

            return returnResponse;
        }
        public AircashCreatePayoutRQ GetCreatePayoutRequest(Guid partnerId, decimal amount, string phoneNumber, string partnerUserID, List<Parameters> parameters)
        {
            Response returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
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
            returnResponse.Sequence = AircashSignatureService.ConvertObjectToString(request);
            request.Signature = SignatureService.GenerateSignature(partnerId, returnResponse.Sequence);
            return request;
        }
        public string GetCreatePayoutEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{AircashCreatePayoutV4Endpoint}";
        }
        public async Task<object> CheckCode(Guid partnerId, string barCode, EnvironmentEnum environment)
        {
            var returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var request = new AircashCheckCodeRQ()
            {
                PartnerID = partnerId.ToString(),
                BarCode = barCode
            };
            returnResponse.ServiceRequest = request;
            returnResponse.Sequence = AircashSignatureService.ConvertObjectToString(request);

            request.Signature = SignatureService.GenerateSignature(partnerId, returnResponse.Sequence);

            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.SalesV2)}{SalesPartnerV2CheckCode}");

            var serviceResponse = JsonConvert.DeserializeObject<AircashCheckCodeRS>(response.ResponseContent);
            returnResponse.ServiceResponse = serviceResponse;
            var responseDateTimeUTC = DateTime.UtcNow;
            return returnResponse;
        }

        public async Task<object> ConfirmTransaction(string barCode, Guid partnerId, string userId, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var confirmTransactionResponse = new object();
            var partnerTransactionID = Guid.NewGuid().ToString();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var confirmTransactionRequest = new ConfirmTransactionRequest()
            {
                PartnerID = partnerId.ToString(),
                BarCode = barCode,
                PartnerTransactionID = partnerTransactionID
            };
            var sequence = AircashSignatureService.ConvertObjectToString(confirmTransactionRequest);
            returnResponse.Sequence = sequence;
            var signature = SignatureService.GenerateSignature(partnerId, returnResponse.Sequence);
            confirmTransactionRequest.Signature = signature;
            returnResponse.ServiceRequest = confirmTransactionRequest;
            var response = await HttpRequestService.SendRequestAircash(confirmTransactionRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}" + $"{ConfirmTransactionEndpoint}");
            var responseDateTimeUTC = DateTime.UtcNow;
            returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                ConfirmTransactionResponse successResponse = JsonConvert.DeserializeObject<ConfirmTransactionResponse>(response.ResponseContent);
                ServiceEnum serviceId;
                if (successResponse.Amount >= 0) { serviceId = ServiceEnum.AircashSalePartnerPayment; }
                else { serviceId = ServiceEnum.AircashSalePartnerPayout; }
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = successResponse.Amount,
                    ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                    PartnerId = partnerId,
                    AircashTransactionId = successResponse.AircashTransactionID,
                    TransactionId = partnerTransactionID,
                    ServiceId = serviceId,
                    UserId = userId,
                    PointOfSaleId = confirmTransactionRequest.LocationID,
                    RequestDateTimeUTC = requestDateTimeUTC,
                    ResponseDateTimeUTC = responseDateTimeUTC
                });
                AircashSimulatorContext.SaveChanges();
                confirmTransactionResponse = successResponse;
            }
            else
            {
                confirmTransactionResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = confirmTransactionResponse;
            return returnResponse;

        }

        public async Task<object> CheckTransactionStatus(string partnerTransactionId, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var checkTransactionStatusResponse = new object();
            var transaction = AircashSimulatorContext.Transactions.Where(x => x.TransactionId == partnerTransactionId).FirstOrDefault();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == transaction.PartnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var checkTransactionStatusRequest = new AircashCheckTransactionStatusRequest()
            {
                PartnerID = transaction.PartnerId.ToString(),
                PartnerTransactionID = partnerTransactionId.ToString(),
            };
            returnResponse.ServiceRequest = checkTransactionStatusRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(checkTransactionStatusRequest);
            returnResponse.Sequence = sequence;
            var signature = SignatureService.GenerateSignature(transaction.PartnerId, returnResponse.Sequence);
            checkTransactionStatusRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(checkTransactionStatusRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{CheckTransactionStatusEndpoint}");
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AircashCheckTransactionStatusResponse>(response.ResponseContent);
                checkTransactionStatusResponse = successResponse;
            }
            else
            {
                checkTransactionStatusResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = checkTransactionStatusResponse;
            return returnResponse;
        }
    }
}
