﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPay
{
    public class CancelTransaction
    {
        public string PartnerID { get; set; }
        public string PartnerTransactionID { get; set; }
    }
}