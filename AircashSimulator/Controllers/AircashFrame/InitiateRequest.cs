namespace AircashSimulator.Controllers.AircashFrame
{
    public class InitiateRequest
    {
        public int PayType { get; set; }
        public int PayMethod { get; set; }
        public decimal Amount { get; set; }
        public string SuccessUrl { get; set; }
        public string DeclineUrl { get; set; }
        public string OriginUrl { get; set; }
        public string CancelUrl { get; set; }
    }
}
