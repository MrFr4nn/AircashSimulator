namespace Services.AircashPaymentAndPayout
{
    public class CheckDigitsV2Response
    {
        public string BarCode { get; set; }
        public string DigitCode { get; set; }
        public decimal Amount { get; set; }
        public int CurrencyID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
    }
}
