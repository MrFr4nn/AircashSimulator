using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public interface IAircashFrameV2Service
    {
        public Task<object> Initiate(InititateRequestV2Dto initiateRequestDTO);
    }
}
