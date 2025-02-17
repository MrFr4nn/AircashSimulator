﻿using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class InititateRequestV2Dto
    {
        public Guid PartnerId { get; set; }
        public string UserId { get; set; }
        public string PartnerTransactionId { get; set; }
        public decimal Amount { get; set; }
        public List<CustomParameterModel> MatchParameters { get; set; }
        public PayTypeEnum PayType { get; set; }
        public PayMethodEnum PayMethod { get; set; }
        public string Locale { get; set; }
        public CurrencyEnum Currency { get; set; }
        public string NotificationUrl { get; set; }
        public string SuccessUrl { get; set; }
        public string DeclineUrl { get; set; }
        public string OriginUrl { get; set; }
        public string CancelUrl { get; set; }
    }
}
