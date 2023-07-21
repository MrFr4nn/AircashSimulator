using Domain.Entities.Enum;

namespace AircashSimulator.Controllers.AircashC2DPayout
{
    public class ConfirmTransactionRQ
    {
        public string BarCode { get; set; }
        public EnvironmentEnum Environment { get; set; }
    }
}
