
using Domain.Entities.Enum;
using System;

namespace AircashSimulator.Controllers
{
    public class GeneratePartnerCodeRequest
    {
        public Guid PartnerId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string LocationID { get; set; }
        public string PartnerTransactionId { get; set; }
        public int CurrencyId { get; set; }
        public int? ValidForPeriod { get; set; }
        public EnvironmentEnum Environment { get; set; }
    }
}
