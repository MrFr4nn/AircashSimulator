using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class PartnerEndpointUsageEntity
    {
        public int Id { get; set; }
        public Guid? PartnerId { get; set; }
        public int EndpointId { get; set; }
        public string Request { get; set; }
        public string Response { get; set; }
    }
}
