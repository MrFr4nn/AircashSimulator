using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class SavePartnerSite
    {
        public Guid PartnerId { get; set; }
        public Guid PublicPartnerId { get; set; }
        public string PartnerName { get; set; }
        public string Brand { get; set; }
        public string Platform { get; set; }
        public string InternalTicket { get; set; }
        public string Confluence { get; set; }
        public string MarketplacePosition { get; set; }
        public string CountryCode { get; set; }
        public int AbonAmountRule { get; set; }
        public int AbonAuthorization { get; set; }
        public int AbonType { get; set; }
        public int AcPayType { get; set; }
        public int WithdrawalType { get; set; }
        public int WithdrawalInstant { get; set; }
        public List<PartnerEndpoint> PartnerEndpoints { get; set; }
        public List<PartnerIntegrationContact> PartnerIntegrationContact { get; set; }
        public List<PartnerErrorCode> PartnerErrorCodes { get; set; }
        public List<PartnerLoginAccount> PartnerLoginAccounts { get; set; }
    }
}
