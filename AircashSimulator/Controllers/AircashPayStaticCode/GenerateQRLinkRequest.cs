namespace AircashSimulator.Controllers.AircashPayStaticCode
{
    public class GenerateQRLinkRequest
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Location { get; set; }

    }
}
