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
        private IUserService UserService;

        public AbonSalePartnerController(IAbonSalePartnerService abonSalePartnerService, ISettingsService settingsService, IHelperService helperService, UserContext userContext, IUserService userService)
        {
            AbonSalePartnerService = abonSalePartnerService;
            SettingsService = settingsService;
            HelperService = helperService;
            UserContext = userContext;
            UserService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CashierCreateCouponOnlinePartner([FromQuery(Name = "Environment")] EnvironmentEnum environment)
        {
            var response = await AbonSalePartnerService.CreateCoupon(SettingsService.AbonDefaultValue, SettingsService.PointOfSaleIdCashier, SettingsService.AbonGeneratePartnerId, CurrencyEnum.EUR.ToString(), Guid.NewGuid(), SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCoupon(CreateCouponRequest createCouponRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response=await AbonSalePartnerService.CreateCoupon(createCouponRequest.Value, createCouponRequest.PointOfSaleId, SettingsService.AbonGeneratePartnerId, CurrencyEnum.EUR.ToString(), Guid.NewGuid(), SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelCoupon(CancelCouponRequest cancelCouponRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AbonSalePartnerService.CancelCoupon(cancelCouponRequest.SerialNumber, cancelCouponRequest.PointOfSaleId, SettingsService.AbonGeneratePartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, environment);
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
            var response = await AbonSalePartnerService.CreateCoupon(abonValue, pointOfSaleId, partnerId, isoCurrencySymbol, partnerTransactionId, privateKeyPath, privateKeyPass, EnvironmentEnum.Staging);
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
            var response = await AbonSalePartnerService.CancelCoupon(serialNumber, pointOfSaleId, partnerId, privateKeyPath, privateKeyPass, EnvironmentEnum.Staging);
            return Ok(response);
        }
    }

}
