using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum AcFrameTransactionStatusEnum
    {
        Declined = 1,
        Success = 2,
        Cancelled = 3,
        PayoutConfirmationPending = 4,
    }
}
