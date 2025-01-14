﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Enum
{
    public enum SimulatorExceptionErrorEnum
    {
        CouponNotFound = 1,
        InvalidUsername = 2,
        InvalidPassword = 3,
        UsernameNotFound = 4,
        UsernameAlreadyTaken = 5,
        PartnerIdAlreadyTaken = 6,
        InvalidResponseSignature = 7,
        Error = 100
    }
}
