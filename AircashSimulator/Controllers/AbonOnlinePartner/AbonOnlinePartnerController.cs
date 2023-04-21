using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Services.AbonOnlinePartner;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using System;
using DataAccess;
using System.Linq;
using Service.Settings;

namespace AircashSimulator
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AbonOnlinePartnerController : ControllerBase
    {
        private ISettingsService SettingsService;
        private IAbonOnlinePartnerService AbonOnlinePartnerService;
        private UserContext UserContext;

        private Guid PartnerIDSimulateError = new Guid("8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf");
        private string CouponCodeSimulateError = "6377944739582437";
        private string PrivateKeySimulateError;
        private string PrivateKeyPassSimulateError;
        public AbonOnlinePartnerController(IAbonOnlinePartnerService abonOnlinePartnerService, UserContext userContext, ISettingsService settingsService)
        {
            AbonOnlinePartnerService = abonOnlinePartnerService;
            UserContext = userContext;
            SettingsService = settingsService;
            PrivateKeySimulateError = SettingsService.AircashSimulatorPrivateKeyPath;
            PrivateKeyPassSimulateError = SettingsService.AircashSimulatorPrivateKeyPass;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ValidateCoupon(ValidateCouponRequest validateCouponRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var response = await AbonOnlinePartnerService.ValidateCoupon(validateCouponRequest.CouponCode, partnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var userId = UserContext.GetUserId(User);
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, userId, partnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }
        public async Task<IActionResult> ConfirmCashierTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, Guid.NewGuid(), SettingsService.AbonOnlinePartnerCashierPartnerId, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ValidateCouponSimulateError([FromBody] int errorCode)
        {
            switch (errorCode)
            {
                case 1:
                    {
                        PartnerIDSimulateError = new Guid("8db69a48-7d61-48e7-9be8-3160549c7f17");
                        break;
                    }
                case 2:
                    {
                        PrivateKeySimulateError = @"C:\Users\Korisnik\Desktop\Key\PrivateKeyPfxFile.pfx";
                        PrivateKeyPassSimulateError = @"Aircash123";
                        break;
                    }
                case 3:
                    {
                        CouponCodeSimulateError = "0000000000000000";
                        break;
                    }
                //case 4:
                //    {
                //        //CouponCodeSimulateError = "0000000000000000";
                //        break;
                //    }
                default:
                    return Ok();
            }
            var response = await AbonOnlinePartnerService.ValidateCoupon(CouponCodeSimulateError, PartnerIDSimulateError, PrivateKeySimulateError, PrivateKeyPassSimulateError);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransactionSimulateError([FromBody] int errorCode)
        {
            switch (errorCode)
            {
                case 1:
                    {
                        PartnerIDSimulateError = new Guid("8db69a48-7d61-48e7-9be8-3160549c7f17");
                        break;
                    }
                case 2:
                    {
                        PrivateKeySimulateError = @"C:\Users\Korisnik\Desktop\Key\PrivateKeyPfxFile.pfx";
                        PrivateKeyPassSimulateError = @"Aircash123";
                        break;
                    }
                case 3:
                    {
                        CouponCodeSimulateError = "0000000000000000";
                        break;
                    }
                case 4:
                    {
                        CouponCodeSimulateError = "5557573568498952";
                        break;
                    }
                //case 5:
                //    {
                //        //PartnerIDSimulateError = new Guid("8db69a48-7d61-48e7-9be8-3160549c7f17");
                //        break;
                //    }
                default:
                    return Ok();
            }
            var userId = UserContext.GetUserId(User);
            var response = await AbonOnlinePartnerService.ConfirmTransaction(CouponCodeSimulateError, userId, PartnerIDSimulateError, PrivateKeySimulateError, PrivateKeyPassSimulateError);
            return Ok(response);
        }
    }
}
