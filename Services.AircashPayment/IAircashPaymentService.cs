using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public interface IAircashPaymentService
    {
         Task<object> CreateAndConfirmPayment(TransactionPayment transaction);
    }
}
