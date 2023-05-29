using Domain.Entities.Enum;
using Services.AircashPosDeposit;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class C2dPaymentRQ
    {
        public decimal Amount { get; set; }
        public string PhoneNumber { get; set; }
        public List<Services.AircashPosDeposit.Parameter> ParametersCreatePayout { get; set; }
        public List<AdditionalParameter> ParametersCheckUser { get; set; }
        public EnvironmentEnum Environment { get; set; }
        

    }
}
