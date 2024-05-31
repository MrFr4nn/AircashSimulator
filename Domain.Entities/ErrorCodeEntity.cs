using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class ErrorCodeEntity
    {
        public int Id { get; set; }
        public Guid PartnerId { get; set; }
        public int Code { get; set; }
        public string LocoKey { get; set; }
        public string Description { get; set; }
    }
}
