using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Services.AbonOnlinePartner;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using System;
using Service.Settings;
using Domain.Entities.Enum;
using CrossCutting;
using Newtonsoft.Json;
using Services.User;

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
        private IUserService UserService;
        public AbonOnlinePartnerController(IAbonOnlinePartnerService abonOnlinePartnerService, UserContext userContext, ISettingsService settingsService, IHelperService helperService, IUserService userService)
        {
            AbonOnlinePartnerService = abonOnlinePartnerService;
            UserContext = userContext;
            SettingsService = settingsService;
            HelperService = helperService;
            UserService = userService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ValidateCoupon(ValidateCouponRequest validateCouponRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AbonOnlinePartnerService.ValidateCoupon(validateCouponRequest.CouponCode, SettingsService.AbonOnlinePartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, environment);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlValidateCoupon(ValidateCouponRequest validateCouponRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request = AbonOnlinePartnerService.GetValidateCouponRequest(validateCouponRequest.CouponCode, SettingsService.AbonOnlinePartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            var curl = HelperService.GetCurl(request, AbonOnlinePartnerService.GetValidateCouponEndpoint(environment));
            return Ok(curl);
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, UserContext.GetUserId(User), SettingsService.AbonOnlinePartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, environment);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request = AbonOnlinePartnerService.GetConfirmTransactionRequest(confirmTransactionRequest.CouponCode, UserContext.GetUserId(User), SettingsService.AbonOnlinePartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            var curl = HelperService.GetCurl(request, AbonOnlinePartnerService.GetConfirmTransactionEndpoint(environment));
            return Ok(curl);
        }
        public async Task<IActionResult> ConfirmCashierTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, Guid.NewGuid(), SettingsService.AbonOnlinePartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, confirmTransactionRequest.Environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ValidateCouponSimulateError([FromBody] AbonValidateCouponErrorCodeEnum errorCode)
        {
            var privateKeyPath = SettingsService.AircashSimulatorPrivateKeyPath;
            var partnerId = SettingsService.AbonOnlinePartnerId;
            var couponCode = SettingsService.ValidCuponCodeForSimulatingError;
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
                    couponCode = HelperService.RandomNumber(16);
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
            var response = await AbonOnlinePartnerService.ValidateCoupon(couponCode, partnerId, privateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, EnvironmentEnum.Staging);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransactionSimulateError([FromBody] AbonConfirmTransactionErrorCodeEnum errorCode)
        {
            var privateKeyPath = SettingsService.AircashSimulatorPrivateKeyPath;
            var partnerId = SettingsService.AbonOnlinePartnerId;
            var couponCode = SettingsService.ValidCuponCodeForSimulatingError;
            var userId = Guid.NewGuid();
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
                    couponCode = HelperService.RandomNumber(16);
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
                case AbonConfirmTransactionErrorCodeEnum.LimitExceeded:
                {
                    userId = SettingsService.BlockedUserId;
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
            var response = await AbonOnlinePartnerService.ConfirmTransaction(couponCode, userId, partnerId, privateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, EnvironmentEnum.Staging);
            return Ok(response);
        }
    }
}
