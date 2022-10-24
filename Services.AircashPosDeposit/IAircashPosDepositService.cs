using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.AircashPosDeposit
{
    public interface IAircashPosDepositService
    {
        Task<object> CheckUser(string phoneNumber, string partnerUserId, Guid partnerId, List<AdditionalParameter> customParameters);
        Task<object> CreatePayout(Guid partnerId, decimal amount, string phoneNumber, string partnerUserID, List<Parameter> parameters);
    }
}
