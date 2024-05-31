using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class IntegrationContactEntity
    {
        public int Id { get; set; }
        public Guid? PartnerId { get; set; }
        public string ContactName { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhoneNumber { get; set; }
    }
}
