using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.MatchService
{
    public interface IMatchService
    {
        Task<Response> CompareIdentity(AircashMatchPersonalData aircashMatchPersonalDataRQ);
    }
}
