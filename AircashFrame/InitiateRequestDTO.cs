using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrame
{
    public class InitiateRequestDTO
    {
        public Guid PartnerId { get; set; }
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public int Currency { get; set; }
        public int PayType { get; set; }
        public int PayMethod { get; set; }
    }
}
