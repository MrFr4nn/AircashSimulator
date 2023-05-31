using System;
using System.Collections.Generic;
using System.Text;

namespace AircashSimulator.Configuration
{
    public class AircashConfiguration
    {        
        public string M3StagingBaseUrl { get; set; }
        public string M3DevBaseUrl { get; set; }
        public string M2StagingBaseUrl { get; set; }
        public string M2DevBaseUrl { get; set; }
        public string AircashAbonBaseUrl { get; set; }
        public string AircashSalesBaseUrl { get; set; }
        public string ValidForPeriod { get; set; }
        public string AircashSalesDevBaseUrl { get; set; }
        public string AcPayPublicKey { get; set; }
        public string AcFramePublicKey { get; set; }
        public string AcPaymentPublicKey { get; set; }
        public int TransactionAmountPerPage { get; set; }
        public string AircashFrameTestUrl { get; set; }
        public string AircashFrameProductionUrl { get; set; }
        public string NotificationUrl { get; set; }
        public string SuccessUrl { get; set; }
        public string DeclineUrl { get; set; }
        public string AircashFrameBaseUrl { get; set; }
        public string AcFrameOriginUrl { get; set; }
        public string AcFrameApiUrl { get; set; }
        public string AircashFrameDevTestUrl { get; set; }
        public string AircashAboDevBaseUrl { get; set; }
        public string AircashFrameDevBaseUrl { get; set; }
    }
}
