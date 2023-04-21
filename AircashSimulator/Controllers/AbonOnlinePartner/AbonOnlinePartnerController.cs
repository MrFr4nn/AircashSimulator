using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Services.AbonOnlinePartner;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using System;
using Service.Settings;
using Domain.Entities.Enum;
using CrossCutting;

namespace AircashSimulator
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AbonOnlinePartnerController : ControllerBase
    {
        private ISettingsService SettingsService;
        private IHelperService HelperService;
        private IAbonOnlinePartnerService AbonOnlinePartnerService;
        private UserContext UserContext;
        public AbonOnlinePartnerController(IAbonOnlinePartnerService abonOnlinePartnerService, UserContext userContext, ISettingsService settingsService, IHelperService helperService)
        {
            AbonOnlinePartnerService = abonOnlinePartnerService;
            UserContext = userContext;
            SettingsService = settingsService;
            HelperService = helperService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ValidateCoupon(ValidateCouponRequest validateCouponRequest)
        {
            var response = await AbonOnlinePartnerService.ValidateCoupon(validateCouponRequest.CouponCode, SettingsService.AbonOnlinePartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var userId = UserContext.GetUserId(User);
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, userId, SettingsService.AbonOnlinePartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }
        public async Task<IActionResult> ConfirmCashierTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, Guid.NewGuid(), SettingsService.AbonOnlinePartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ValidateCouponSimulateError([FromBody] AbonValidateCouponErrorCodeEnum errorCode)
        {
            string privateKeyPath = SettingsService.AircashSimulatorPrivateKeyPath;
            Guid partnerId = SettingsService.AbonOnlinePartnerId;
            string couponCode = SettingsService.ValidCuponCodeForSimulatingError;
            switch (errorCode)
            {
                case AbonValidateCouponErrorCodeEnum.InvalidProviderId:
                {
                    partnerId = Guid.NewGuid();
                    break;
                }
                case AbonValidateCouponErrorCodeEnum.InvalidSignature:
                {
                    privateKeyPath = SettingsService.PrivateKeyForInvalidSignature;
                    break;
                }
                case AbonValidateCouponErrorCodeEnum.InvalidCouponeCode:
                {
                    couponCode = HelperService.RandomString(16);
                    break;
                }
                case AbonValidateCouponErrorCodeEnum.CouponCountryNotAllowed:
                {
                    couponCode = SettingsService.SixteenDigitCodeBA;
                    break;
                }
                //case AbonValidateCouponErrorCodeEnum.ConversionModuleError:
                //    {
                //        //CouponCodeSimulateError = "0000000000000000";
                //        break;
                //    }
                default:
                    return Ok();
            }
            var response = await AbonOnlinePartnerService.ValidateCoupon(couponCode, partnerId, privateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransactionSimulateError([FromBody] AbonConfirmTransactionErrorCodeEnum errorCode)
        {
            string privateKeyPath = SettingsService.AircashSimulatorPrivateKeyPath;
            Guid partnerId = SettingsService.AbonOnlinePartnerId;
            string couponCode = SettingsService.ValidCuponCodeForSimulatingError;
            switch (errorCode)
            {
                case AbonConfirmTransactionErrorCodeEnum.InvalidProviderId:
                {
                    partnerId = Guid.NewGuid();
                    break;
                }
                case AbonConfirmTransactionErrorCodeEnum.InvalidSignature:
                {
                    privateKeyPath = SettingsService.PrivateKeyForInvalidSignature;
                    break;
                }
                case AbonConfirmTransactionErrorCodeEnum.InvalidCouponeCode:
                {
                    couponCode = HelperService.RandomString(16);
                    break;
                }
                case AbonConfirmTransactionErrorCodeEnum.CouponAleradyUsed:
                {
                    couponCode = SettingsService.UsedCuponCodeForSimulatingError;
                    break;
                }
                case AbonConfirmTransactionErrorCodeEnum.CouponCountryNotAllowed:
                {
                    couponCode = SettingsService.SixteenDigitCodeBA;
                    break;
                }
                //case ConfirmTransactionErrorCodeEnum.ConversionModuleError:
                //    {
                //        //PartnerIDSimulateError = new Guid("8db69a48-7d61-48e7-9be8-3160549c7f17");
                //        break;
                //    }
                default:
                    return Ok();
            }
            var response = await AbonOnlinePartnerService.ConfirmTransaction(couponCode, Guid.NewGuid(), partnerId, privateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }
    }
}
