using System;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class PersonalDataToCompare
    {
        public Guid PartnerID { get; set; }
        public PersonalData AircashUser { get; set; }
        public PersonalData PartnerUser { get; set; }
        
    }
}
