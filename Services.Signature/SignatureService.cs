using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using DataAccess;
using Service.Settings;
using AircashSignature;

namespace Services.Signature
{
    public class SignatureService: ISignatureService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private ISettingsService SettingsService;
        public SignatureService(AircashSimulatorContext aircashSimulatorContext, ISettingsService settingsService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            SettingsService = settingsService;
        }
        public string GenerateSignatureFromPemString(string dataToSign, string pem, string certificatePass)
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

        public string GenerateSignature(Guid partnerId, string dataToSign)
        {
            var keys = GetKeyToSing(partnerId);
            var valid = ValidatePartnerKey(new ValidateAndSavePartnerKeyRequest
            {
                PrivateKey = keys.PrivateKey,
                Password = keys.PrivateKeyPass,
                PublicKey = keys.PublicKey,
            });
            if (valid)
            {
                return GenerateSignatureFromPemString(dataToSign, keys.PrivateKey, keys.PrivateKeyPass);
            }

            return AircashSignatureService.GenerateSignature(dataToSign, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
        }

        public bool ValidatePartnerKey(ValidateAndSavePartnerKeyRequest validateAndSavePartnerKeyRequest)
        {
            var result = false;
            try
            {
                var key = RSA.Create();
                key.ImportFromEncryptedPem(validateAndSavePartnerKeyRequest.PrivateKey.ToCharArray(), validateAndSavePartnerKeyRequest.Password.ToCharArray());
                var bytePublicKey = Encoding.UTF8.GetBytes(validateAndSavePartnerKeyRequest.PublicKey);
                var certificate = new X509Certificate2(bytePublicKey);
                var signature = key.SignData(Encoding.UTF8.GetBytes("test"), HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                var dataToVerifyBytes = Encoding.UTF8.GetBytes("test");

                using (var sha256 = new SHA256Managed())
                {
                    using (var rsa = certificate.GetRSAPublicKey())
                    {
                        result = rsa.VerifyData(dataToVerifyBytes, signature, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                    }
                }
            }
            catch
            {
                result = false;
            }
            return result;
        }

        public async Task<string> SavePartnerKey(ValidateAndSavePartnerKeyRequest validateAndSavePartnerKeyRequest, Guid partnerId) 
        {
            if (ValidatePartnerKey(validateAndSavePartnerKeyRequest) || (validateAndSavePartnerKeyRequest.PrivateKey == "" && validateAndSavePartnerKeyRequest.Password == "" && validateAndSavePartnerKeyRequest.PublicKey == "")) 
            {
                var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
                partner.PrivateKey = validateAndSavePartnerKeyRequest.PrivateKey;
                partner.PublicKey = validateAndSavePartnerKeyRequest.PublicKey;
                partner.PrivateKeyPass = validateAndSavePartnerKeyRequest.Password;
                AircashSimulatorContext.SaveChanges();
                return "Success";
            }
            return "Provided keys are invalid";
        }

        public KeyToSing GetKeyToSing(Guid partnerId)
        {
            string privateKey = null;
            string privateKeyPass = null;
            string publicKey = null;    
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            if (partner != null && partner.PrivateKey != null)
            {
                privateKey = partner.PrivateKey;
                privateKeyPass = partner.PrivateKeyPass;
                publicKey = partner.PublicKey;
            }
            return new KeyToSing { PrivateKey = privateKey, PrivateKeyPass = privateKeyPass, PublicKey = publicKey };
        }
    }
}
