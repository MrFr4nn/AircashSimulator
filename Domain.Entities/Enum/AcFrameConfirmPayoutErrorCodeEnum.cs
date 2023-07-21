using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum AcFrameConfirmPayoutErrorCodeEnum
    {
        InvalidSignatureOrPartnerId = 1,
        ValidationError = 3,
        TransactionDoesntExistOrItIsAlreadyProcessed = 1000,
        TransactionConfirmationNotAllowed = 1005,
        InvalidCurrency = 3000,
        AmountTooSmall = 3006,
        AmountTooBig = 3007,
        UserReachedTransactionLimitOrUserIsBlocked = 3008,
        AmountMismatch = 3016,
    }
}
