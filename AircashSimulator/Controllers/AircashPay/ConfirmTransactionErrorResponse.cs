using Newtonsoft.Json;

namespace AircashSimulator.Controllers.AircashPay
{
    public class ConfirmTransactionErrorResponse
    {
        public bool? decision { get; set; }
        public int errorCode { get; set; }
        public string errorMessage { get; set; }
    }
}
