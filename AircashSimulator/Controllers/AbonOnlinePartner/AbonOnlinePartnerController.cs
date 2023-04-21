using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Services.AbonOnlinePartner;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using System;
using DataAccess;
using System.Linq;

namespace AircashSimulator
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AbonOnlinePartnerController : ControllerBase
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IAbonOnlinePartnerService AbonOnlinePartnerService;
        private UserContext UserContext;
        private readonly Guid PartnerId = new Guid("e9fb671b-154e-4918-9788-84b6758fb082");
        private readonly Guid UserId = new Guid("358B9D22-BB9A-4311-B94D-8F6DAEB38B40");

        private Guid PartnerIDSimulateError = new Guid("8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf");
        private string CouponCodeSimulateError = "6377944739582437";
        private string PrivateKeySimulateError;
        private string PrivateKeyPassSimulateError;
        public AbonOnlinePartnerController(IAbonOnlinePartnerService abonOnlinePartnerService, UserContext userContext, AircashSimulatorContext aircashSimulatorContext)
        {
            AbonOnlinePartnerService = abonOnlinePartnerService;
            UserContext = userContext;
            AircashSimulatorContext = aircashSimulatorContext;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ValidateCoupon(ValidateCouponRequest validateCouponRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var response = await AbonOnlinePartnerService.ValidateCoupon(validateCouponRequest.CouponCode, partnerId, partner.PrivateKey, partner.PrivateKeyPass, partner.Environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            PrivateKeyPassSimulateError = partner.PrivateKeyPass;
            PrivateKeySimulateError = partner.PrivateKey;
            var userId = UserContext.GetUserId(User);
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, userId, partnerId, PrivateKeySimulateError, PrivateKeyPassSimulateError);
            return Ok(response);
        }
        public async Task<IActionResult> ConfirmCashierTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == PartnerId).FirstOrDefault();
            PrivateKeyPassSimulateError = partner.PrivateKeyPass;
            PrivateKeySimulateError = partner.PrivateKey;
            var response = await AbonOnlinePartnerService.ConfirmTransaction(confirmTransactionRequest.CouponCode, UserId, PartnerId, PrivateKeySimulateError, PrivateKeyPassSimulateError);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ValidateCouponSimulateError([FromBody] int errorCode)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == PartnerIDSimulateError).FirstOrDefault();
            PrivateKeyPassSimulateError = partner.PrivateKeyPass;
            PrivateKeySimulateError = partner.PrivateKey;
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
                    return BadRequest();
            }
            var response = await AbonOnlinePartnerService.ValidateCoupon(CouponCodeSimulateError, PartnerIDSimulateError, PrivateKeySimulateError, PrivateKeyPassSimulateError, partner.Environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransactionSimulateError([FromBody] int errorCode)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == PartnerIDSimulateError).FirstOrDefault();
            PrivateKeyPassSimulateError = partner.PrivateKeyPass;
            PrivateKeySimulateError = partner.PrivateKey;
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
                case 5:
                    {
                        //PartnerIDSimulateError = new Guid("8db69a48-7d61-48e7-9be8-3160549c7f17");
                        break;
                    }
                default:
                    return BadRequest();
            }
            var userId = UserContext.GetUserId(User);
            var response = await AbonOnlinePartnerService.ConfirmTransaction(CouponCodeSimulateError, userId, PartnerIDSimulateError, PrivateKeySimulateError, PrivateKeyPassSimulateError);
            return Ok(response);
        }
    }
}
