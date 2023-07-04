using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace AircashSimulator.Hubs
{
    [EnableCors]
    public class NotificationHub : Hub
    {
        public async Task TransactionConfirmed(string msg, int status)
        {
            await Clients.All.SendAsync("TransactionConfirmedMessage", msg, status);
        }

        public async Task TransactionFailed(string msg, int status)
        {
            await Clients.All.SendAsync("TransactionFailedMessage", msg, status);
        }

        public async Task InvalidSingature(string msg, int status)
        {
            await Clients.All.SendAsync("InvalidSignatureMessage", msg, status);
        }
        public async Task TransactionConfirmedPayment(string msg, int status)
        {
            await Clients.All.SendAsync("TransactionConfirmedMessagePayment", msg, status);
        }


    }
}
