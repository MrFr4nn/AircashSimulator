using System;

namespace AircashSimulator.Controllers.CobrandedCard
{
    public class CobrandedCardDTO
    {
        public string PhoneNumber { get; set; }
        public Guid PartnerID { get; set; }
        public string PartnerCardID { get; set; }
        public string PartnerUserID { get; set; }
        public string CardTypeID { get; set; }
        public string PersonalID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NameOnCard { get; set; }
        public string DeliveryTypeID { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
    }
}
