﻿using Domain.Entities.Enum;
using System;

namespace Services.AircashFrame
{
    public class InitiateRequestDTO
    {
        public Guid PartnerId { get; set; }
        public string UserId { get; set; }
        public decimal Amount { get; set; }
        public PayTypeEnum PayType { get; set; }
        public PayMethodEnum PayMethod { get; set; }
    }
}
