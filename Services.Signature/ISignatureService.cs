using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Signature
{
    public interface ISignatureService
    {

        string GenerateSignature(Guid partnerId, string dataToSign);
        Task<string> RemovePartnerKeys(Guid partnerId);
        bool ValidatePartnerKey(ValidateAndSavePartnerKeyRequest validateAndSavePartnerKeyRequest);
        Task<string> SavePartnerKey(ValidateAndSavePartnerKeyRequest validateAndSavePartnerKeyRequest, Guid partnerId);
        KeyToSing GetKeyToSing(Guid partnerId);
        bool ValidateSignature(string dataToSign, string signature, Guid partnerId);
    }
}
