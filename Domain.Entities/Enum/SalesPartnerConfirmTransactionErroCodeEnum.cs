using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum SalesPartnerConfirmTransactionErroCodeEnum
    {
        BarcodeAlreadyUsed = 2,
        TransactionLimit = 3,
        PartnerTransactionIdIsNotUnique = 4,
        UnableToConfirmTransactionWithoutCallingCheckBarcodeFirst = 6,
    }
}
