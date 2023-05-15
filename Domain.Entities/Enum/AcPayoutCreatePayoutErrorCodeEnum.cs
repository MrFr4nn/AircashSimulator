using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum AcPayoutCreatePayoutErrorCodeEnum
    {
        UnknownPhoneNumber = 4000,
        PartnerTransactionIDAlreadyExists = 4002,
        AmountTooSmall = 4003,
        AmountTooBig = 4004,
        UserReachedTransactionLimitOrUserIsBlocked = 4005,
        CurrenciesDoNotMatch = 4006,
    }
}
