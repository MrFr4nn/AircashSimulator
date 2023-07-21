using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum SalesPartnerCancelTransactionErrorCodeEnum
    {
        UnableToCancelPayout = 7,
        TransactionAlreadyCanceled = 8,
        TransactionInWrongStatus = 9,
        CancellationPeriodExpired = 10,
    }
}
