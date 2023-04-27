using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum AbonCancelCouponErrorCodeEnum
    {
        InvalidPartnerId = 1,
        InvalidSignature = 2,
        InvalidPointOfSaleId = 3,
        InvalidCouponSerialNumberOrPartnerTransactionId = 4,
        PartnerIdsDoNotMatch = 5,
        PointOfSalesIdsDoNotMatch = 6,
        CouponHasBeenAlreadyCanceled = 7,
        CouponHasBeenAlreadyUsed = 8,
        CouponHasAlreadyExpired = 9,
        CouponCannotBeCancelledTimeoutExpired = 10,
        RequestFailed = 11,
    }
}
