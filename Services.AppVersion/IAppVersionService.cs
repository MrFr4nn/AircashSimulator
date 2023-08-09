using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AppVersion
{
    public interface IAppVersionService
    {
        string Version { get; }
    }
}
