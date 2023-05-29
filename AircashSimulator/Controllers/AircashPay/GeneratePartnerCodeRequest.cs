
using Domain.Entities.Enum;

namespace AircashSimulator.Controllers
{
    public class GeneratePartnerCodeRequest
    {
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string LocationID { get; set; }
        public EnvironmentEnum Environment { get; set; }
    }
}
