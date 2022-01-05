using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class PartnerAbonDenominationsEntity
    {
        public int Id { get; set; }
        public Guid PartnerId { get; set; }
        public decimal Denomination { get; set; }
    }
}
