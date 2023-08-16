using Domain.Entities.Enum;

namespace AircashSimulator.Controllers.AircashPaymentAndPayout
{
    public class CheckDigitsRequest
    {
        public string PartnerID { get; set; }
        public string DigitCode { get; set; }
        public string LocationID { get; set; }
        public int CurrencyID { get; set; }
        public EnvironmentEnum Environment { get; set; }
    }
}
