using AircashSignature;
using System.Collections.Generic;

namespace Services.AircashPosDeposit
{
    public class AircashCreatePayoutRQ : ISignature
    {
        public string PartnerID { get; set; }
        public string PartnerTransactionID { get; set; }
        public decimal Amount { get; set; }
        public string PhoneNumber { get; set; }
        public string PartnerUserID { get; set; }
        public List<Parameter> Parameters { get; set; }
        public int CurrencyID { get; set; }
        public string Signature { get; set; }
    }

    public class Parameter
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
