using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum ConfirmTransactionErrorCodeEnum
    {
        InvalidProviderId = 1,
        InvalidSignature = 2,
        InvalidCouponeCode = 3,
        CouponAleradyUsed = 4,
        ConversionModuleError = 5
    }
}
