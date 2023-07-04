using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum AcFrameConfirmPayoutErrorCodeEnum
    {
        TransactionDoesntExistOrItIsAlreadyProcessed = 1000,
        TransactionConfirmationNotAllowed = 1005,
        UserReachedTransactionLimitOrUserIsBlocked = 3008,
        AmountMismatch = 3016,
    }
}
