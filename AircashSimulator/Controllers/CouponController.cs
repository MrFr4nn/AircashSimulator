using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Coupon;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CouponController : ControllerBase
    {
        private ICouponService CouponService;
        public CouponController(ICouponService couponService)
        {
            CouponService = couponService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUnusedCoupons(int PurchasedCurrency)
        {
            var response = CouponService.GetUnusedCoupons();
            return Ok(response);
        }
    }
}
