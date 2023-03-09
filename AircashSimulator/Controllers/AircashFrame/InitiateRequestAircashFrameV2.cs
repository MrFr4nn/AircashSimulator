﻿using Domain.Entities.Enum;

namespace AircashSimulator.Controllers.AircashFrame
{
    public class InitiateRequestAircashFrameV2
    {
        public PayTypeEnum PayType { get; set; }
        public PayMethodEnum PayMethod { get; set; }
        public decimal Amount { get; set; }
        public AcFrameIntegrationCheckoutTypeEnum AcFrameOption { get; set; }
        public string NotificationUrl { get; set; }
        public string SuccessUrl { get; set; }
        public string DeclineUrl { get; set; }
        public string OriginUrl { get; set; }
        public string CancelUrl { get; set; }       
    }
}
