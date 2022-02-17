
namespace AircashSimulator.Controllers
{
    public class GetUnusedCouponsRequest
    {
        public int PurchasedCurrency { get; set; }
        public decimal Value { get; set; }
    }
}
