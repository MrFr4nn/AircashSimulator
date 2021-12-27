﻿using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrame
{
    public class AircashTransactionStatusRequest : ISignature
    {
        public string PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string Signature { get; set; }
    }
}
