﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Authentication
{
    public class PartnerIdDTO
    {
        public string AbonOnlinePartnerId { get; set; }
        public string AbonOnlinePartnerIdWithoutAuthorization { get; set; }
        public string AbonGeneratePartnerId { get; set; }
        public string AircashFramePartnerId { get; set; }
        public string AircashFramePartnerIdWithMatchPersonalData { get; set; }
        public string SalesPartnerId { get; set; }
        public string AircashPayoutPartnerId { get; set; }
        public string AircashPayoutV4PartnerId { get; set; }
        public string C2DPayoutPartnerId { get; set; }
        public string C2DDepositPartnerId { get; set; }
        public string AcPayPartnerId { get; set; }
        public string InAppPayPartnerId { get; set; }
        public string DefaulrPartnerId { get; set; }
        public string MatchPersonalDataDefault { get; set; }
        public string MatchPersonalDataDateOnly { get; set; }
    }
}
