using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using Services.AbonSalePartner;
using Microsoft.AspNetCore.Authorization;
using AircashSimulator.Extensions;
using Domain.Entities.Enum;
using CrossCutting;
using Service.Settings;

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

        private Guid ParterID = new Guid("8F62C8F0-7155-4C0E-8EBE-CD9357CFD1BF");

        public AbonSalePartnerController(IAbonSalePartnerService abonSalePartnerService, UserContext userContext, ISettingsService settingsService, IHelperService helperService)
        {
            AbonSalePartnerService = abonSalePartnerService;
            UserContext = userContext;
            SettingsService = settingsService;
            HelperService = helperService;
        }

        [HttpPost]
        public async Task<IActionResult> CashierCreateCouponOnlinePartner()
        {
            var response = await AbonSalePartnerService.CreateCoupon(SettingsService.AbonDefaultValue, SettingsService.PointOfSaleIdCashier, ParterID, CurrencyEnum.EUR.ToString(), Guid.NewGuid(), SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCoupon(CreateCouponRequest createCouponRequest)
        {
            var response=await AbonSalePartnerService.CreateCoupon(createCouponRequest.Value, createCouponRequest.PointOfSaleId, ParterID, CurrencyEnum.EUR.ToString(), Guid.NewGuid(), SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelCoupon(CancelCouponRequest cancelCouponRequest)
        {
            var response = await AbonSalePartnerService.CancelCoupon(cancelCouponRequest.SerialNumber, cancelCouponRequest.PointOfSaleId, ParterID, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
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
                    partnerTransactionId = new Guid("84ba908f-cef9-4713-9396-edad8f8c2c12");
                    break;
                }
                //case AbonCreateCouponErrorCodeEnum.DailyLimitExceeded:
                // {

                //     return BadRequest();
                // }
                default:
                    return BadRequest();
            }
            var response = await AbonSalePartnerService.CreateCoupon(abonValue, pointOfSaleId, partnerId, isoCurrencySymbol, partnerTransactionId, privateKeyPath, privateKeyPass);
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
            var serialNumber = "0565130009558536";

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
                case AbonCancelCouponErrorCodeEnum.InvalidPointOfSaleId:
                {
                    pointOfSaleId = "";
                    break;
                }
                case AbonCancelCouponErrorCodeEnum.InvalidCouponSerialNumberOrPartnerTransactionId:
                {
                    serialNumber = HelperService.RandomNumber(16);
                    break;
                }
                case AbonCancelCouponErrorCodeEnum.PartnerIdsDoNotMatch:
                {
                    partnerId = new Guid("8db69a48-7d61-48e7-9be8-3160549c7f17");
                    break;
                }
                case AbonCancelCouponErrorCodeEnum.PointOfSalesIdsDoNotMatch:
                {
                    pointOfSaleId = "error";
                    break;
                }
                case AbonCancelCouponErrorCodeEnum.CouponHasBeenAlreadyCanceled:
                {
                    serialNumber = "0207037936248882";
                    break;
                }
                case AbonCancelCouponErrorCodeEnum.CouponHasBeenAlreadyUsed:
                {
                    serialNumber = "8111271745690701";
                    break;
                }
                //case AbonCancelCouponErrorCodeEnum.CouponHasAlreadyExpired:
                //    {

                //        return BadRequest();
                //    }
                //case AbonCancelCouponErrorCodeEnum.CouponCannotBeCancelledTimeoutExpired:
                //    {

                //        return BadRequest();
                //    }
                //case AbonCancelCouponErrorCodeEnum.RequestFailed:
                //    {
                //        return BadRequest();
                //    }
                default:
                    return BadRequest();
            }
            var response = await AbonSalePartnerService.CancelCoupon(serialNumber, pointOfSaleId, partnerId, privateKeyPath, privateKeyPass);
            return Ok(response);
        }
    }

}
