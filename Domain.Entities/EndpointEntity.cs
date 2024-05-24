using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class EndpointEntity
    {
        public int Id { get; set; }
        public EndpointTypeEnum EndpointType { get; set; }
        public string Url { get; set; }
    }
}
