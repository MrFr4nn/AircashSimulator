using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashSignature
{
    public class AircashSignatureService:IAircashSignatureService
    {
        public  string GenerateSignatureFromPemString(string dataToSign, string pem, string certificatePass)
        {
            var rsa = RSA.Create();
            rsa.ImportFromEncryptedPem(pem.ToCharArray(), certificatePass);
            var originalData = Encoding.UTF8.GetBytes(dataToSign);
            using (rsa)
            {
                var signeddata = rsa.SignData(originalData, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                return Convert.ToBase64String(signeddata);
            }
        }
    }
}
