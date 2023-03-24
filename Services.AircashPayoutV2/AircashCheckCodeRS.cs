namespace Services.AircashPayoutV2
{
    public class AircashCheckCodeRS
    {
        public decimal Amount { get; set; }
        public int CurrencyID { get; set; }
        public string BarCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
    }
}
