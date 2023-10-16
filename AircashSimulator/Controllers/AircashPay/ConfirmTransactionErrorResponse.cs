using Newtonsoft.Json;

namespace AircashSimulator.Controllers.AircashPay
{
    public class ConfirmTransactionErrorResponse
    {
        public bool? ExitTransaction { get; set; }
        public int ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
    }
}
