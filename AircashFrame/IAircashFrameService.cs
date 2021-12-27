using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrame
{
    public interface IAircashFrameService
    {
        public Task<object> Initiate(InitiateRequestDTO initiateRequestDTO);
        public Task<object> TransactionStatus(Guid partnerId, string transactionId);
    }
}
