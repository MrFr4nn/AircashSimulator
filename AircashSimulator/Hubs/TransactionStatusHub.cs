using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;


namespace AircashSimulator.Hubs
{
    public class TransactionStatusHub: Hub
    {
        public async Task CallTransactionStatus (string status)
        {
            await Clients.All.SendAsync("TransactionStatus", status);
        }


    }
}
