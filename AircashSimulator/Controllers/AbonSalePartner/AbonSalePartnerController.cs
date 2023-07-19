using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Services.AbonSalePartner;
using Microsoft.AspNetCore.Authorization;
using Domain.Entities.Enum;
using CrossCutting;
using Service.Settings;
using AircashSimulator.Extensions;
using Services.User;
using System.Collections.Generic;
using DataAccess;
using System.Linq;
using Services.PartnerAbonDenominations;

namespace AircashSimulator
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AbonSalePartnerController : ControllerBase
    {
        private ISettingsService SettingsService;
        private IHelperService HelperService;
        private IAbonSalePartnerService AbonSalePartnerService;
        private AircashSimulatorContext AircashSimulatorContext;
        private UserContext UserContext;
        private IUserService UserService;
        private IPartnerAbonDenominationService PartnerAbonDenominationService;

        public AbonSalePartnerController(IAbonSalePartnerService abonSalePartnerService, ISettingsService settingsService, IHelperService helperService, UserContext userContext, IUserService userService, AircashSimulatorContext aircashSimulatorContext, IPartnerAbonDenominationService denominationService)
        {
            AbonSalePartnerService = abonSalePartnerService;
            SettingsService = settingsService;
            HelperService = helperService;
            UserContext = userContext;
            UserService = userService;
            AircashSimulatorContext = aircashSimulatorContext;
            PartnerAbonDenominationService = denominationService;
        }

        [HttpPost]
        public async Task<IActionResult> CashierCreateCouponOnlinePartner([FromQuery(Name = "Environment")] EnvironmentEnum environment)
        {
            var response = await AbonSalePartnerService.CreateCoupon(SettingsService.AbonDefaultValue, SettingsService.PointOfSaleIdCashier, SettingsService.AbonGeneratePartnerId, CurrencyEnum.EUR.ToString(), Guid.NewGuid().ToString(), SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, environment, null, null);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCoupon(CreateCouponRequest createCouponRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AbonSalePartnerService.CreateCoupon(createCouponRequest.Value, createCouponRequest.PointOfSaleId, new Guid(createCouponRequest.PartnerId), createCouponRequest.IsoCurrencySymbol, createCouponRequest.PartnerTransactionId, null, null, environment, createCouponRequest.ContentType, (int?)createCouponRequest.ContentWidth);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateMultipleCoupons(MultipleCouponRequest request)
        {
            var abonRq = new MultipleCouponABONRequest
            {
                PartnerId = request.PartnerId,
                PointOfSaleId = request.PointOfSaleId,
                ISOCurrencySymbol = request.ISOCurrencySymbol,
                ContentType = request.ContentType,
                ContentWidth = request.ContentWidth,
                Denominations = request.Denominations.Select(x => new AbonDenomination
                {
                    Value = x.Value,
                    PartnerTransactionId = x.PartnerTransactionId
                }).ToList()
            };
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AbonSalePartnerService.CreateMultipleCoupons(abonRq, null, null, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCashierCoupon(CreateCashierCouponRequest createCouponRequest)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == new Guid(createCouponRequest.PartnerId)).FirstOrDefault();
            var response = await AbonSalePartnerService.CreateCoupon(createCouponRequest.Value, SettingsService.PointOfSaleIdCashier, partner.PartnerId, ((CurrencyEnum)partner.CurrencyId).ToString(), Guid.NewGuid().ToString(), SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, EnvironmentEnum.Staging, null, null);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMultipleCashierCoupon(CreateCashierCouponRequest createCouponRequest)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == new Guid(createCouponRequest.PartnerId)).FirstOrDefault();
            var denominations = await PartnerAbonDenominationService.GetDenominations(partner.PartnerId);
            var coupons = new List<string>();
            foreach (decimal value in denominations)
            {
                coupons.Add("Denomination: " + value.ToString() + " " + ((CurrencyEnum)partner.CurrencyId).ToString());
                for (int i = 0; i < SettingsService.AbonSPCashierNumberOfCouponCodesPerDenomination; i++)
                {
                    var response = await AbonSalePartnerService.CreateCouponCashier(value, SettingsService.PointOfSaleIdCashier, partner.PartnerId, ((CurrencyEnum)partner.CurrencyId).ToString(), Guid.NewGuid().ToString(), SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, EnvironmentEnum.Staging);
                    coupons.Add(response);
                }
                coupons.Add("");
            }
            return Ok(coupons);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelCoupon(CancelCouponRequest cancelCouponRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AbonSalePartnerService.CancelCoupon(cancelCouponRequest.SerialNumber, cancelCouponRequest.PointOfSaleId, new Guid(cancelCouponRequest.PartnerId), cancelCouponRequest.PartnerTransactionId, null, null, environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCouponSimulateError([FromBody] AbonCreateCouponErrorCodeEnum errorCode)
        {
            var partnerId = SettingsService.AbonGeneratePartnerId;
            var privateKeyPath = SettingsService.AircashSimulatorPrivateKeyPath;
            var privateKeyPass = SettingsService.AircashSimulatorPrivateKeyPass;

            var partnerTransactionId = Guid.NewGuid().ToString();
            var abonValue = SettingsService.AbonDefaultValue;
            var isoCurrencySymbol = CurrencyEnum.EUR.ToString();
            var pointOfSaleId = SettingsService.PointOfSaleId;
            switch (errorCode)
            {
                case AbonCreateCouponErrorCodeEnum.InvalidPartnerId:
                    {
                        partnerId = Guid.NewGuid();
                        break;
                    }
                case AbonCreateCouponErrorCodeEnum.InvalidSignature:
                    {
                        privateKeyPath = SettingsService.PrivateKeyForInvalidSignature;
                        break;
                    }
                case AbonCreateCouponErrorCodeEnum.InvalidCouponValue:
                    {
                        abonValue = SettingsService.AbonInvalidValue;
                        break;
                    }
                case AbonCreateCouponErrorCodeEnum.InvalidCurrencySymbol:
                    {
                        isoCurrencySymbol = SettingsService.AbonInvalidCurrencySymbol;
                        break;
                    }
                case AbonCreateCouponErrorCodeEnum.CouponExistsForTheGivenPartnerTransactionId:
                    {
                        partnerTransactionId = SettingsService.CouponExistsForTheGivenPartnerTransactionId;
                        break;
                    }
                case AbonCreateCouponErrorCodeEnum.DailyLimitExceeded:
                    {
                        partnerId = SettingsService.AbonGenerateBlockedPartnerId;
                        break;
                    }
                default:
                    return BadRequest();
            }
            var response = await AbonSalePartnerService.CreateCoupon(abonValue, pointOfSaleId, partnerId, isoCurrencySymbol, partnerTransactionId, privateKeyPath, privateKeyPass, EnvironmentEnum.Staging, null, null);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateMultipleCouponsSimulateError([FromBody] AbonCreateCouponErrorCodeEnum errorCode)
        {
            var privateKeyPass = SettingsService.AircashSimulatorPrivateKeyPass;
            var privateKeyPath = SettingsService.AircashSimulatorPrivateKeyPath;
            var request = new MultipleCouponABONRequest()
            {
                ContentType = "pdf",
                ISOCurrencySymbol = CurrencyEnum.EUR.ToString(),
                PartnerId = SettingsService.AbonGeneratePartnerId,
                Denominations = new List<AbonDenomination>() { new AbonDenomination() { Value = SettingsService.AbonDefaultValue, PartnerTransactionId = Guid.NewGuid().ToString() } },
                PointOfSaleId = SettingsService.PointOfSaleId
            };

            switch (errorCode)
            {
                case AbonCreateCouponErrorCodeEnum.InvalidPartnerId:
                    {
                        request.PartnerId = Guid.NewGuid();
                        break;
                    }
                case AbonCreateCouponErrorCodeEnum.InvalidSignature:
                    {
                        privateKeyPath = SettingsService.PrivateKeyForInvalidSignature;
                        break;
                    }
                case AbonCreateCouponErrorCodeEnum.InvalidCouponValue:
                    {
                        request.Denominations.First().Value = SettingsService.AbonInvalidValue;
                        break;
                    }
                case AbonCreateCouponErrorCodeEnum.InvalidCurrencySymbol:
                    {
                        request.ISOCurrencySymbol = SettingsService.AbonInvalidCurrencySymbol;
                        break;
                    }
                case AbonCreateCouponErrorCodeEnum.CouponExistsForTheGivenPartnerTransactionId:
                    {
                        request.Denominations.First().PartnerTransactionId = SettingsService.CouponExistsForTheGivenPartnerTransactionId;
                        break;
                    }
                case AbonCreateCouponErrorCodeEnum.DailyLimitExceeded:
                    {
                        request.PartnerId = SettingsService.AbonGenerateBlockedPartnerId;
                        break;
                    }
                default:
                    return BadRequest();
            }
            var response = await AbonSalePartnerService.CreateMultipleCoupons(request, privateKeyPath, privateKeyPass, EnvironmentEnum.Staging);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelCouponSimulateError([FromBody] AbonCancelCouponErrorCodeEnum errorCode)
        {
            var partnerId = SettingsService.AbonGeneratePartnerId;
            var privateKeyPath = SettingsService.AircashSimulatorPrivateKeyPath;
            var privateKeyPass = SettingsService.AircashSimulatorPrivateKeyPass;

            var pointOfSaleId = SettingsService.PointOfSaleId;
            var serialNumber = SettingsService.AbonUnusedCouponSerialNumber;

            switch (errorCode)
            {
                case AbonCancelCouponErrorCodeEnum.InvalidPartnerId:
                    {
                        partnerId = Guid.NewGuid();
                        break;
                    }
                case AbonCancelCouponErrorCodeEnum.InvalidSignature:
                    {
                        privateKeyPath = SettingsService.PrivateKeyForInvalidSignature;
                        break;
                    }
                case AbonCancelCouponErrorCodeEnum.InvalidCouponSerialNumberOrPartnerTransactionId:
                    {
                        serialNumber = HelperService.RandomNumber(16);
                        break;
                    }
                case AbonCancelCouponErrorCodeEnum.PartnerIdsDoNotMatch:
                    {
                        partnerId = SettingsService.AbonGeneratePartnerIdsDoNotMatch;
                        break;
                    }
                case AbonCancelCouponErrorCodeEnum.PointOfSalesIdsDoNotMatch:
                    {
                        pointOfSaleId = SettingsService.AbonPointOfSalesIdsDoNotMatch;
                        break;
                    }
                case AbonCancelCouponErrorCodeEnum.CouponHasBeenAlreadyCanceled:
                    {
                        serialNumber = SettingsService.AbonCanceledCouponSerialNumber;
                        break;
                    }
                case AbonCancelCouponErrorCodeEnum.CouponHasBeenAlreadyUsed:
                    {
                        serialNumber = SettingsService.AbonAlradyUsedCouponSerialNumber;
                        break;
                    }
                case AbonCancelCouponErrorCodeEnum.CouponHasAlreadyExpired:
                    {
                        serialNumber = SettingsService.AbonExpiredCouponSerialNumber;
                        break;
                    }
                case AbonCancelCouponErrorCodeEnum.CouponCannotBeCancelledTimeoutExpired:
                    {
                        serialNumber = SettingsService.AbonTimedOutCouponSerialNumber;
                        break;
                    }
                default:
                    return BadRequest();
            }
            var response = await AbonSalePartnerService.CancelCoupon(serialNumber, pointOfSaleId, partnerId, null, privateKeyPath, privateKeyPass, EnvironmentEnum.Staging);
            return Ok(response);
        }
    }

}
