using Services.Coupon;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> GetUnusedCoupon(GetUnusedCouponsRequest getUnusedCouponsRequest)
        {
            var response = await CouponService.GetUnusedCoupon(getUnusedCouponsRequest.PurchasedCurrency, getUnusedCouponsRequest.Value);
            return Ok(response);
        }
    }
}
