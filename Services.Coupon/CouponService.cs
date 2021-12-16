using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Services.Coupon
{
    public class CouponService : ICouponService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        public CouponService(AircashSimulatorContext aircashSimulatorContext)
        {
            AircashSimulatorContext = aircashSimulatorContext;
        }
        public async Task<object> GetUnusedCoupons(int PurchasedCurrency, decimal Value)
        {
            var ValidCoupons =  AircashSimulatorContext.Coupons.Where(x =>  x.UsedOnUTC == null & 
                                                                            x.CancelledOnUTC == null & 
                                                                            x.PurchasedCurrency == (CurrencyEnum)PurchasedCurrency &
                                                                            x.PurchasedAmount == Value).ToList();
            return ValidCoupons;
        }
    }
}
