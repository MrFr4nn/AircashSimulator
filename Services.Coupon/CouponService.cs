﻿using DataAccess;
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
        public async Task<object> GetUnusedCoupons(int PurchasedCurrency)
        {
            var ValidCoupons =  AircashSimulatorContext.Coupons.Where(x => x.UsedOnUTC == null & x.CancelledOnUTC == null & x.PurchasedCurrency == (CurrencyEnum)PurchasedCurrency).ToList();
            int a = 1;
            return ValidCoupons;
        }
    }
}
