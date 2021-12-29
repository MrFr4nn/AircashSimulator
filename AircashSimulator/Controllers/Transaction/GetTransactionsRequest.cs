using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.Transaction
{
    public class GetTransactionsRequest
    {
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public List<ServiceEnum> Services { get; set; }
    }
}
