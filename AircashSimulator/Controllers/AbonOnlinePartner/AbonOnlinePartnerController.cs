using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Services.AbonOnlinePartner;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using System;
using DataAccess;
using System.Linq;
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

        
        private string CouponCodeSimulateError;
        private Guid PartnerIDSimulateError;
        private string PrivateKeySimulateError;
        public AbonOnlinePartnerController(IAbonOnlinePartnerService abonOnlinePartnerService, UserContext userContext, ISettingsService settingsService, IHelperService helperService)
        {
            AbonOnlinePartnerService = abonOnlinePartnerService;
            UserContext = userContext;
            SettingsService = settingsService;
            HelperService = helperService;
            PrivateKeySimulateError = SettingsService.AircashSimulatorPrivateKeyPath;
            PartnerIDSimulateError = SettingsService.AbonOnlinePartnerPartnerId;
            CouponCodeSimulateError = SettingsService.ValidCuponCodeForSimulatingError;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ValidateCoupon(ValidateCouponRequest validateCouponRequest)
        {
            var response = await AbonOnlinePartnerService.ValidateCoupon(validateCouponRequest.CouponCode, SettingsService.AbonOnlinePartnerPartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var userId = UserContext.GetUserId(User);
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, userId, SettingsService.AbonOnlinePartnerPartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }
        public async Task<IActionResult> ConfirmCashierTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, Guid.NewGuid(), SettingsService.AbonOnlinePartnerPartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ValidateCouponSimulateError([FromBody] AbonValidateCouponErrorCodeEnum errorCode)
        {
            switch (errorCode)
            {
                case AbonValidateCouponErrorCodeEnum.InvalidProviderId:
                    {
                        PartnerIDSimulateError = Guid.NewGuid();
                        break;
                    }
                case AbonValidateCouponErrorCodeEnum.InvalidSignature:
                    {
                        PrivateKeySimulateError = SettingsService.PrivateKeyForInvalidSignature;
                        break;
                    }
                case AbonValidateCouponErrorCodeEnum.InvalidCouponeCode:
                    {
                        CouponCodeSimulateError = HelperService.RandomString(16);
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
            var response = await AbonOnlinePartnerService.ValidateCoupon(CouponCodeSimulateError, PartnerIDSimulateError, PrivateKeySimulateError, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransactionSimulateError([FromBody] ConfirmTransactionErrorCodeEnum errorCode)
        {
            switch (errorCode)
            {
                case ConfirmTransactionErrorCodeEnum.InvalidProviderId:
                    {
                        PartnerIDSimulateError = Guid.NewGuid();
                        break;
                    }
                case ConfirmTransactionErrorCodeEnum.InvalidSignature:
                    {
                        PrivateKeySimulateError = SettingsService.PrivateKeyForInvalidSignature;
                        break;
                    }
                case ConfirmTransactionErrorCodeEnum.InvalidCouponeCode:
                    {
                        CouponCodeSimulateError = HelperService.RandomString(16);
                        break;
                    }
                case ConfirmTransactionErrorCodeEnum.CouponAleradyUsed:
                    {
                        CouponCodeSimulateError = SettingsService.UsedCuponCodeForSimulatingError;
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
            var response = await AbonOnlinePartnerService.ConfirmTransaction(CouponCodeSimulateError, Guid.NewGuid(), PartnerIDSimulateError, PrivateKeySimulateError, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }
    }
}
