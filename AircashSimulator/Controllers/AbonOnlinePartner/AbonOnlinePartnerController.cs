﻿using AircashSimulator.Extensions;
using CrossCutting;
using Domain.Entities.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Settings;
using Services.AbonOnlinePartner;
using Services.User;
using System;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AbonOnlinePartner
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
            var response = await AbonOnlinePartnerService.ValidateCoupon(validateCouponRequest.CouponCode, validateCouponRequest.ProviderId, null, null, environment);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlValidateCoupon(ValidateCouponRequest validateCouponRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request = AbonOnlinePartnerService.GetValidateCouponRequest(validateCouponRequest.CouponCode, SettingsService.AbonOnlinePartnerId.ToString(), null, null);
            var curl = HelperService.GetCurl(request, AbonOnlinePartnerService.GetValidateCouponEndpoint(environment));
            return Ok(curl);
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckStatusCoupon(CheckStatusCouponRequest checkStatusCouponRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AbonOnlinePartnerService.CheckStatusCoupon(checkStatusCouponRequest.PartnerId, checkStatusCouponRequest.CouponCode, checkStatusCouponRequest.PartnerTransactionId, checkStatusCouponRequest.NotificationUrl, checkStatusCouponRequest.UserId, checkStatusCouponRequest.UserPhoneNumber, checkStatusCouponRequest.Parameters, null, null, environment);
            return Ok(response);
        }
        [HttpGet]
        public async Task<IActionResult> AuthorizationNotification([FromQuery(Name = "partnerTransactionId")] string partnerTransactionId)
        {
            return Ok();
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, confirmTransactionRequest.ProviderId, confirmTransactionRequest.ProviderTransactionId, confirmTransactionRequest.UserId, null, null, environment);
            return Ok(response);
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransactionV2(ConfirmTransactionV2Request confirmTransactionV2Request)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AbonOnlinePartnerService.ConfirmTransactionV2(confirmTransactionV2Request.CouponCode, confirmTransactionV2Request.PartnerId, confirmTransactionV2Request.PartnerTransactionId, confirmTransactionV2Request.UserId, null, null, environment);
            return Ok(response);
        }
        public async Task<IActionResult> GetCurlConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var request = AbonOnlinePartnerService.GetConfirmTransactionRequest(confirmTransactionRequest.CouponCode, confirmTransactionRequest.UserId, confirmTransactionRequest.ProviderId, confirmTransactionRequest.ProviderTransactionId, null, null);
            var curl = HelperService.GetCurl(request, AbonOnlinePartnerService.GetConfirmTransactionEndpoint(environment));
            return Ok(curl);
        }

        public async Task<IActionResult> ConfirmCashierTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, SettingsService.AbonOnlinePartnerIdWithoutAuthorization.ToString(), Guid.NewGuid().ToString(), Guid.NewGuid().ToString(), SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, confirmTransactionRequest.Environment);
            return Ok(response);
        }

        public async Task<IActionResult> AutorizationTransactionRequest(AutorizationTransactionRequest autorizationTransactionRequest)
        {

            var notificationUrl = SettingsService.AbonCashierNotificationUrl + autorizationTransactionRequest.CouponCode;
            var response = await AbonOnlinePartnerService.CheckStatusCoupon(SettingsService.AbonOnlinePartnerId.ToString(), autorizationTransactionRequest.CouponCode, Guid.NewGuid().ToString(), notificationUrl, Guid.NewGuid().ToString(), autorizationTransactionRequest.PhoneNumber, autorizationTransactionRequest.Parameters, null, null, EnvironmentEnum.Staging);
            return Ok(response);
        }
        [HttpGet]
        public async Task<IActionResult> ConfirmPushNotificationCashier([FromQuery(Name = "partnerTransactionId")] string partnerTransactionId, [FromQuery(Name = "CouponCode")] string CouponCode)
        {
     
            var response = await AbonOnlinePartnerService.ConfirmTransactionV2(CouponCode, SettingsService.AbonOnlinePartnerIdWithoutAuthorization.ToString(), partnerTransactionId, Guid.NewGuid().ToString(), SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, EnvironmentEnum.Staging);
            return Ok();
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
            var response = await AbonOnlinePartnerService.ValidateCoupon(couponCode, partnerId.ToString(), privateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, EnvironmentEnum.Staging);
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
            var response = await AbonOnlinePartnerService.ConfirmTransaction(couponCode, partnerId.ToString(), Guid.NewGuid().ToString(), userId.ToString(), privateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass, EnvironmentEnum.Staging);
            return Ok(response);
        }
    }
}
