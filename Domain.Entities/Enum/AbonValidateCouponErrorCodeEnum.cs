using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum AbonValidateCouponErrorCodeEnum
    {
        InvalidProviderId = 1,
        InvalidSignature = 2,
        InvalidCouponeCode = 3,
        ConversionModuleError = 4,
        CouponCountryNotAllowed = 7
    }
}
