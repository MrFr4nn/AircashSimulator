﻿using AircashSignature;
using System.Collections.Generic;

namespace Services.AircashPosDeposit
{
    public class AircashCheckUserRQ : ISignature
    {
        public string PartnerID { get; set; }
        public string PhoneNumber { get; set; }
        public string PartnerUserID { get; set; }
        public string Signature { get; set; }
        public List<AdditionalParameter> Parameters { get; set; }
    }

    public class AdditionalParameter
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}