using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using Services.AbonSalePartner;
using Microsoft.AspNetCore.Authorization;
using AircashSimulator.Extensions;

namespace AircashSimulator
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AbonSalePartnerController : ControllerBase
    {
        private IAbonSalePartnerService AbonSalePartnerService;
        private UserContext UserContext;
        public AbonSalePartnerController(IAbonSalePartnerService abonSalePartnerService, UserContext userContext)
        {
            AbonSalePartnerService = abonSalePartnerService;
            UserContext = userContext;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCoupon(CreateCouponRequest createCouponRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var response=await AbonSalePartnerService.CreateCoupon(createCouponRequest.Value, createCouponRequest.PointOfSaleId, partnerId);
            return Ok(response);
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelCoupon(CancelCouponRequest cancelCouponRequest)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var response=await AbonSalePartnerService.CancelCoupon(cancelCouponRequest.SerialNumber, cancelCouponRequest.PointOfSaleId, partnerId);
            return Ok(response);
        }
    }

}
