using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum SalesPartnerCheckCodeErrorEnum
    {
        InvalidBarcode = 1,
        BarcodeAlreadyUsed = 2,
        TransactionLimit = 3,
    }
}
