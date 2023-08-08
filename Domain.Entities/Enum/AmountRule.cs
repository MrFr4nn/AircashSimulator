using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum AmountRule
    {
        Default = 1,
        EqualOrLessThanCouponValue = 2,
        EqualAsCouponValue = 3,
        LessThanCouponValue = 4,
    }
}
