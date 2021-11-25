using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Coupon
{
    public interface ICouponService
    {
        Task<object> GetUnusedCoupons(int PurchasedCurrency);
    }
}
