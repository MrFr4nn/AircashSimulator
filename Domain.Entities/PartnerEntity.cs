using Domain.Entities.Enum;
using System;

namespace Domain.Entities
{
    public class PartnerEntity
    {
        public int Id { get; set; }

        public Guid PartnerId { get; set; }
         
        public string PartnerName { get; set; }

        public string PrivateKey { get; set; } 

        public string PrivateKeyPass { get; set; }

        public string PublicKey { get; set; }

        public int CurrencyId { get; set; }

        public string CountryCode { get; set; }
        public EnvironmentEnum Environment { get; set; }
        public bool UseDefaultPartner { get; set; }
        public string Brand { get; set; }
        public string Platform { get; set; }
        public string InternalTicket { get; set; }
        public IntegrationTypeEnum AbonType { get; set; }
        public AbonAuthorizationEnum AbonAuthorization { get; set; }
        public AbonAmoutRuleEnum AbonAmountRule { get; set; }
        public IntegrationTypeEnum WithdrawalType { get; set; }
        public WithdrawalInstantEnum WithdrawalInstant { get;set; }
        public IntegrationTypeEnum AcPayType { get;set; }
        public string MarketplacePosition { get; set; }
    }
}
