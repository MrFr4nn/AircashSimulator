using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.CobrandedCard
{
    public class UpdateCardOrderStatusRQ : ISignature
    {
        public Guid CardID { get; set; }
        public bool NewUser { get; set; }
        public string Signature { get; set; }
    }
}
