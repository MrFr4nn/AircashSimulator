namespace AircashSimulator.Controllers.Signature
{
    public class ValidateSignatureDTO
    {
        public string dataToSign {get; set;}
        public string signatureToValidate { get; set; }
    }
}
