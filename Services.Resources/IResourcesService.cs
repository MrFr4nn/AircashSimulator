using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Domain.Entities.Enum;
using System.Threading.Tasks;

namespace Services.Resources
{
    public interface IResourcesService
    {
        Task<string> CreateCoupon(string Currency);
    }
}
