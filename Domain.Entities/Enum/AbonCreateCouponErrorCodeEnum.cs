using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum AbonCreateCouponErrorCodeEnum
    {
        InvalidPartnerId = 1,
        InvalidSignature = 2,
        InvalidCouponValue = 3,
        InvalidCurrencySymbol = 5,
        CouponExistsForTheGivenPartnerTransactionId = 6,
        DailyLimitExceeded = 8,
    }
}
