using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum AcFrameTransactionStatusErrorCodeEnum
    {
        InvalidSignatureOrPartnerId = 1,
        ValidationError = 3,
        TransactionDoesNotExist = 1002,
        TransactionNotProcessed = 1003
    }
}
