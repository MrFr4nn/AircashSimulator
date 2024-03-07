using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Newtonsoft.Json;
using Services.HttpRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Services.Signature;
using AircashSignature;
using Service.Settings;
using Microsoft.Extensions.Logging;

namespace Services.Resources
{

    public class ResourcesService: IResourcesService
    {

        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private ISignatureService SignatureService;
        private ISettingsService SettingsService;
        private ILogger<ResourcesService> Logger;

        private readonly string CreateCouponEndpoint = "CashRegister/CreateCoupon";

        public ResourcesService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, ISignatureService signatureService, ISettingsService settingsService, ILogger<ResourcesService> logger)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            SignatureService = signatureService;
            SettingsService = settingsService;
            Logger = logger;
        }

        public async Task<string> CreateCoupon(string currencyIsoCode)
        {
            var partnerIds = new Dictionary<CurrencyEnum, Guid> {
                { CurrencyEnum.EUR, SettingsService.GenerateAbonPartnerIdDE},
                { CurrencyEnum.RON, SettingsService.GenerateAbonPartnerIdRO},
                { CurrencyEnum.CZK, SettingsService.GenerateAbonPartnerIdCZ},
                { CurrencyEnum.PLN, SettingsService.GenerateAbonPartnerIdPL},
                { CurrencyEnum.BGN, SettingsService.GenerateAbonPartnerIdBG}

            };
            var sentCurrency = (CurrencyEnum)Enum.Parse(typeof(CurrencyEnum), currencyIsoCode.ToUpper());
            var partnerId = partnerIds.Where(x => x.Key == sentCurrency).Select(x => x.Value).FirstOrDefault();

            

            string returnToPartner;
            var amount = AircashSimulatorContext.PartnerAbonDenominations.Where(x => x.PartnerId == partnerId).Select(x => x.Denomination).FirstOrDefault();

            if (amount == 0) {
                Logger.LogError("Couldn't find denomination for PartnerId: " + partnerId);
                throw new Exception("Aircash configuration error");
            }

            var createCouponRequest = new CreateCouponRequest()
            {
                PartnerId = partnerId.ToString(),
                Value = amount,
                PointOfSaleId = "SimulatorResources",
                ISOCurrencySymbol = currencyIsoCode.ToUpper(),
                PartnerTransactionId = Guid.NewGuid().ToString(),
                ContentType = null,
                ContentWidth = null
            };
            var sequence = AircashSignatureService.ConvertObjectToString(createCouponRequest);
            string signature;
            
            signature = SignatureService.GenerateSignature(partnerId, sequence);
            
            createCouponRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(createCouponRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(EnvironmentEnum.Staging, EndpointEnum.Abon)}{CreateCouponEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<CreateCouponResponse>(response.ResponseContent);
                returnToPartner = successResponse.CouponCode;
            }
            else
            {
                var errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
                throw new Exception(errorResponse.Message);
            }
            
            return returnToPartner;
        }
    }
}
