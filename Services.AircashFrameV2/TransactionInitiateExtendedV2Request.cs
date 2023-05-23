using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class TransactionInitiateExtendedV2Request : AircashInitiateV2Request
    {
        public List<CustomParameterModel> CustomParameters { get; set; }
    }
}
