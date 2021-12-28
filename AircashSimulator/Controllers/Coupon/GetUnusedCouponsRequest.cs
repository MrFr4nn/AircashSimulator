using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    public class GetUnusedCouponsRequest
    {
        public int PurchasedCurrency { get; set; }
        public decimal Value { get; set; }
    }
}
