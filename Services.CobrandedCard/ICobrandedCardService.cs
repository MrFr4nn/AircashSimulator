using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.CobrandedCard
{
    public interface ICobrandedCardService
    {
       Task<Response> OrderNewCard(OrderCardRequest request);
        Task<Response> UpadateCardStatus(UpdateStatusCardRQ request);
       // Task<Response> UpdateCardOrderStatus(UpdateCardOrderStatusRQ request);
    }
}
