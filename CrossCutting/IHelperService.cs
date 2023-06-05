using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CrossCutting
{
    public interface IHelperService
    {
        string RandomNumber(int length);
        string GetCurl(object request, string endpoint);
    }
}
