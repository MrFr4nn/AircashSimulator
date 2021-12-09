﻿using System;
using System.Collections.Generic;
using System.Text;

namespace AircashSimulator.Configuration
{
    public class AircashConfiguration
    {
        public string M3BaseUrl { get; set; }
        public string M2BaseUrl { get; set; }
        public string GeneratePartnerCodeEndpoint { get; set; }
        public string CheckUserEndpoint { get; set; }
        public string CreatePayoutEndpoint { get; set; }
        public string CheckTransactionStatusEndpoint { get; set; }
        public string CancelTransactionEndpoint { get; set; }
        public string ValidForPeriod { get; set; }
        public string AcPayPublicKey { get; set; }
    }
}
