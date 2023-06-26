﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Signature
{
    public interface ISignatureService
    {
        string GenerateSignature(Guid partnerId, string dataToSign);
        bool ValidatePartnerKey(ValidateAndSavePartnerKeyRequest validateAndSavePartnerKeyRequest);
        Task<string> SavePartnerKey(ValidateAndSavePartnerKeyRequest validateAndSavePartnerKeyRequest, Guid partnerId);
        KeyToSing GetKeyToSing(Guid partnerId);
    }
}