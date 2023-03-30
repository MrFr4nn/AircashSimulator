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
        private readonly Guid PartnerIdCashier = new Guid("9be565cb-762a-403b-bb77-420ffdf46c61");
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
        public async Task<IActionResult> CreateCashierCoupon(CreateCashierCouponRequest createCouponRequest)
        {
            //var partnerId = UserContext.GetPartnerId(User);
            Guid partnerId = new Guid(createCouponRequest.PartnerId);
            var response = await AbonSalePartnerService.CreateCoupon(createCouponRequest.Value, createCouponRequest.PointOfSaleId, partnerId);
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
