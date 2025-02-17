﻿using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPaymentAndPayout
{
    public class ConfirmTransactionRequest
    {
        public string PartnerId { get; set; }
        public string BarCode { get; set; }
        public string PartnerTransactionId { get; set; }
        public string LocationID { get; set; }
        public EnvironmentEnum Environment { get; set; }
    }
}
