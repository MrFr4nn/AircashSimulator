
using Domain.Entities.Enum;

namespace AircashSimulator.Controllers.AircashFrame
{
    public class InitiateRequest
    {
        public int PayType { get; set; }
        public int PayMethod { get; set; }
        public decimal Amount { get; set; }
        public int Currency { get; set; }
    }
}
