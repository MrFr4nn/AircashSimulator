using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class PartnerDetailSite
    {
        public Guid PartnerId { get; set; }
        public Guid ProductionPartnerId { get; set; }
        public string PartnerName { get; set; }
        public string Brand { get; set; }
        public string Platform { get; set; }
        public string InternalTicket { get; set; }
        public string Confluence { get; set; }
        public string MarketplacePosition { get; set; }
        public string CountryCode { get; set; }
        public string AbonAmountRule { get; set;}
        public string AbonAuthorization { get; set; }
        public string AbonType { get; set; }
        public string AcPayType { get; set; }
        public string WithdrawalType { get; set; }
        public string WithdrawalInstant { get; set; }
        public List<Role> Roles { get; set; }
        public List<PartnerEndpoint> PartnerEndpoints { get; set; }
        public List<PartnerIntegrationContact> PartnerIntegrationContact { get; set; }
        public List<PartnerErrorCode> PartnerErrorCodes { get; set; }
        public List<PartnerLoginAccount> PartnerLoginAccounts { get; set; }
    }
}
