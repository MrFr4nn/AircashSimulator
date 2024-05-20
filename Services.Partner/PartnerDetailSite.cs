﻿using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class PartnerDetailSite
    {
        public Guid? PartnerId { get; set; }
        public string PartnerName { get; set; }
        public string Brand { get; set; }
        public string Platform { get; set; }
        public string InternalTicket { get; set; }
        public string MarketplacePosition { get; set; }
        public string CountryCode { get; set; }
        public string AbonAmountRule { get; set;}
        public string AbonAuthorization { get; set; }
        public string AbonType { get; set; }
        public string AcPayType { get; set; }
        public string WithdrawalType { get; set; }
        public string WithdrawalInstant { get; set; }
        public List<Role> Roles { get; set; }
        public List<KeyValuePair<int,string>> IntegrationTypeEnums { get; set; }
        public List<KeyValuePair<int, string>> AbonAuthorizationEnums { get; set; }
        public List<KeyValuePair<int, string>> AbonAmoutRuleEnums { get; set; }
        public List<KeyValuePair<int, string>> WithdrawalInstantEnums { get; set; }
    }
}
