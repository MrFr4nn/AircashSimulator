using DataAccess;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Services.PartnerAbonDenominations
{
    public class PartnerAbonDenominationService : IPartnerAbonDenominationService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        public PartnerAbonDenominationService(AircashSimulatorContext aircashSimulatorContext)
        {
            AircashSimulatorContext = aircashSimulatorContext;
        }

        public async Task<List<decimal>> GetDenominations(Guid partnerId)
        {
            var denominations = await AircashSimulatorContext.PartnerAbonDenominations
                .Where(x => x.PartnerId == partnerId)
                .Select(x => x.Denomination).ToListAsync(); 
            return denominations;
        }
    }
}
