using Domain.Entities.Enum;
using Services.AbonOnlinePartner;
using System;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AbonOnlinePartner
{
    public class AutorizationTransactionRequest
    {
        public string CouponCode { get; set; }
        public string ProviderId { get; set; }
        public string ProviderTransactionId { get; set; }
        public string UserId { get; set; }
        public EnvironmentEnum Environment { get; set; }
        public string PhoneNumber { get; set; }
        public List<AbonCheckStatusCouponParameters> Parameters { get; set; }



    }
}
