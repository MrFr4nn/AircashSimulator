using Domain.Entities.Enum;

namespace AircashSimulator.Controllers.AircashC2DPayout
{
    public class CheckCodeDTO
    {
        public string Barcode { get; set; }
        public EnvironmentEnum Environment { get; set; }
    }
}
