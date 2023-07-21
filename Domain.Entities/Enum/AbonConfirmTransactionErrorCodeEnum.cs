using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum AbonConfirmTransactionErrorCodeEnum
    {
        InvalidProviderId = 1,
        InvalidSignature = 2,
        InvalidCouponeCode = 3,
        CouponAleradyUsed = 4,
        ConversionModuleError = 5,
        CouponCountryNotAllowed = 7,
        LimitExceeded = 9,
    }
}
