using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum AcFrameInitiateErrorCodeEnum
    {
        InvalidSignatureOrPartnerId = 1,
        ValidationError = 3,
        PartnerTransactionAlreadyExists = 1004,
        InvalidCurrency = 3000
    }
}
