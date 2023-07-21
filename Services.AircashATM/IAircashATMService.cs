using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashATM
{
    public interface IAircashATMService
    {
        Task<object> UseOneTimePayoutCode(UseOneTimePayoutCodeRQ useOneTimePayoutCodeRQ);
        Task<object> CancelTransaction(CancelTransactionRQ cancelTransactionRQ);
    }
}
