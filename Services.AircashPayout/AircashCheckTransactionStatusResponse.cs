﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayout
{
    public class AircashCheckTransactionStatusResponse
    {
        public int Status { get; set; }
        public string AircashTransactionId { get; set; }
    }
}
