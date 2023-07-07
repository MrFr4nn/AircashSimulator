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
using System.IO;
using Org.BouncyCastle.OpenSsl;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Asn1.Ocsp;

namespace Services.Signature
{
    public class PasswordFinder : IPasswordFinder
    {
        private readonly string password;

        public PasswordFinder(string password)
        {
            this.password = password;
        }

        public char[] GetPassword()
        {
            return password.ToCharArray();
        }
    }
    public class SignatureService : ISignatureService
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
            byte[] signeddata;
            var originalData = Encoding.UTF8.GetBytes(dataToSign);
            try
            {
                var rsa = RSA.Create();
                rsa.ImportFromEncryptedPem(pem.ToCharArray(), certificatePass);
                using (rsa)
                {
                    signeddata = rsa.SignData(originalData, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                    return Convert.ToBase64String(signeddata);
                }
            }
            catch
            {

            }
            using (var textReader = new StringReader(pem))
            {
                var pemReader = new PemReader(textReader, new PasswordFinder(certificatePass));

                AsymmetricCipherKeyPair keyPair = pemReader.ReadObject() as AsymmetricCipherKeyPair;
                if (keyPair == null)
                {
                    throw new InvalidDataException("Failed to read the private key.");
                }
                RSAParameters rsaParameters = DotNetUtilities.ToRSAParameters(keyPair.Private as RsaPrivateCrtKeyParameters);
                var rsa = RSA.Create();
                rsa.ImportParameters(rsaParameters);
                signeddata = rsa.SignData(originalData, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
            }
            return Convert.ToBase64String(signeddata);

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
                return result;
            }
            catch 
            {
                result = false;
            }
            try
            {
                byte[] signeddata;
                var bytePublicKey = Encoding.UTF8.GetBytes(validateAndSavePartnerKeyRequest.PublicKey);
                var certificate = new X509Certificate2(bytePublicKey);
                var dataToVerifyBytes = Encoding.UTF8.GetBytes("test");
                using (var textReader = new StringReader(validateAndSavePartnerKeyRequest.PrivateKey))
                {
                    var pemReader = new PemReader(textReader, new PasswordFinder(validateAndSavePartnerKeyRequest.Password));

                    AsymmetricCipherKeyPair keyPair = pemReader.ReadObject() as AsymmetricCipherKeyPair;
                    if (keyPair == null)
                    {
                        throw new InvalidDataException("Failed to read the private key.");
                    }
                    RSAParameters rsaParameters = DotNetUtilities.ToRSAParameters(keyPair.Private as RsaPrivateCrtKeyParameters);
                    var rsa = RSA.Create();
                    rsa.ImportParameters(rsaParameters);
                    signeddata = rsa.SignData(dataToVerifyBytes, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                }
                using (var sha256 = new SHA256Managed())
                {
                    using (var rsa = certificate.GetRSAPublicKey())
                    {
                        result = rsa.VerifyData(dataToVerifyBytes, signeddata, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                    }
                }
                return result;
            }
            catch
            {
                result = false;
            }
            return result;
        }
        public bool ValidateSignature(string dataToSign, string signature, Guid partnerId)
        {
            var result = false;
            try
            {

                var keys = GetKeyToSing(partnerId);
                var bytePublicKey = Encoding.UTF8.GetBytes(keys.PublicKey);
                var certificate = new X509Certificate2(bytePublicKey);
                var byteSignature = Convert.FromBase64String(signature);
                var byteDataToSign = Encoding.UTF8.GetBytes(dataToSign);

                using (var sha256 = new SHA256Managed())
                {
                    using (var rsa = certificate.GetRSAPublicKey())
                    {
                        result = rsa.VerifyData(byteDataToSign, byteSignature, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
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
            if (ValidatePartnerKey(validateAndSavePartnerKeyRequest))
            {
                var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
                var partnerExist = AircashSimulatorContext.Partners.Where(x => x.PartnerId == validateAndSavePartnerKeyRequest.PartnerId).FirstOrDefault();
                if (partnerExist != null && partnerId != validateAndSavePartnerKeyRequest.PartnerId) {
                    return "PartnerId already exist";
                }
                partner.PrivateKey = validateAndSavePartnerKeyRequest.PrivateKey;
                partner.PublicKey = validateAndSavePartnerKeyRequest.PublicKey;
                partner.PrivateKeyPass = validateAndSavePartnerKeyRequest.Password;
                partner.PartnerId = validateAndSavePartnerKeyRequest.PartnerId;
                var users = AircashSimulatorContext.Users.Where(x => x.PartnerId == partnerId).ToList();
                var partnerRoles = AircashSimulatorContext.PartnerRoles.Where(x => x.PartnerId == partnerId).ToList();
                foreach (var user in users)
                {
                    user.PartnerId = validateAndSavePartnerKeyRequest.PartnerId; ;
                }
                foreach (var role in partnerRoles)
                {
                    role.PartnerId = validateAndSavePartnerKeyRequest.PartnerId; ;
                }
                AircashSimulatorContext.SaveChanges();
                return "Success";
            }
            return "Provided keys are invalid";
        }
        public async Task<string> RemovePartnerKeys(Guid partnerId)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            partner.PrivateKey = "";
            partner.PublicKey = "";
            partner.PrivateKeyPass = "";
            AircashSimulatorContext.SaveChanges();
            return "Success";
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
