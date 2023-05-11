using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Services.AbonSalePartner;
using Microsoft.AspNetCore.Authorization;
using Domain.Entities.Enum;
using CrossCutting;
using Service.Settings;
using AircashSimulator.Extensions;

namespace AircashSimulator
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AbonSalePartnerController : ControllerBase
    {
        private ISettingsService SettingsService;
        private IHelperService HelperService;
        private IAbonSalePartnerService AbonSalePartnerService;
        private UserContext UserContext;

        public AbonSalePartnerController(IAbonSalePartnerService abonSalePartnerService, ISettingsService settingsService, IHelperService helperService, UserContext userContext)
        {
            AbonSalePartnerService = abonSalePartnerService;
            SettingsService = settingsService;
            HelperService = helperService;
            UserContext = userContext;
        }

        [HttpPost]
        public async Task<IActionResult> CashierCreateCouponOnlinePartner()
        {
            var response = await AbonSalePartnerService.CreateCoupon(SettingsService.AbonDefaultValue, SettingsService.PointOfSaleIdCashier, UserContext.GetUserId(User), SettingsService.AbonGeneratePartnerId, CurrencyEnum.EUR.ToString(), Guid.NewGuid(), SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCoupon(CreateCouponRequest createCouponRequest)
        {
            var response=await AbonSalePartnerService.CreateCoupon(createCouponRequest.Value, createCouponRequest.PointOfSaleId, UserContext.GetUserId(User), SettingsService.AbonGeneratePartnerId, CurrencyEnum.EUR.ToString(), Guid.NewGuid(), SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelCoupon(CancelCouponRequest cancelCouponRequest)
        {
            var response = await AbonSalePartnerService.CancelCoupon(cancelCouponRequest.SerialNumber, cancelCouponRequest.PointOfSaleId, UserContext.GetUserId(User), SettingsService.AbonGeneratePartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCouponSimulateError([FromBody] AbonCreateCouponErrorCodeEnum errorCode)
        {
            var partnerId = SettingsService.AbonGeneratePartnerId;
            var privateKeyPath = SettingsService.AircashSimulatorPrivateKeyPath;
            var privateKeyPass = SettingsService.AircashSimulatorPrivateKeyPass;

            var partnerTransactionId = Guid.NewGuid();
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
            var response = await AbonSalePartnerService.CreateCoupon(abonValue, pointOfSaleId, Guid.NewGuid(), partnerId, isoCurrencySymbol, partnerTransactionId, privateKeyPath, privateKeyPass);
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
            var response = await AbonSalePartnerService.CancelCoupon(serialNumber, pointOfSaleId, Guid.NewGuid(), partnerId, privateKeyPath, privateKeyPass);
            return Ok(response);
        }
    }

}
