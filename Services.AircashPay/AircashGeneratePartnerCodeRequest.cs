using System;
using AircashSignature;
using Domain.Entities.Enum;

namespace Services.AircashPay
{
    class AircashGeneratePartnerCodeRequest : ISignature
    {
        public Guid PartnerID { get; set; }
        public decimal Amount { get; set; }
        public CurrencyEnum CurrencyID { get; set; }
        public Guid PartnerTransactionID { get; set; }
        public string Description { get; set; }
        public string LocationID { get; set; }
        public string Signature { get; set; }
    }
}
