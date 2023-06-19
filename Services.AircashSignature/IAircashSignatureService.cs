using System;

namespace Services.AircashSignature
{
    public interface IAircashSignatureService
    {
        string GenerateSignatureFromPemString(string dataToSign, string pem, string certificatePass);
    }
}
