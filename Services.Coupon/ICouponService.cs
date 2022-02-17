using System.Threading.Tasks;

namespace Services.Coupon
{
    public interface ICouponService
    {
        Task<object> GetUnusedCoupon(int PurchasedCurrency, decimal Value);
    }
}
