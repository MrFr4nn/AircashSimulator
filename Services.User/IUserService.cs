using Domain.Entities;
using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.User
{
    public interface IUserService
    {
       
        Task<List<UserDetailVM>> GetUsers(int PageNumber, int PageSize, string Search);
        Task SaveUser(UserDetailVM request);

        Task DeleteUser(Guid? userId);
        Task<EnvironmentEnum> GetUserEnvironment(Guid userId);

        Task<UserDTO> GetUserByIdentifier(string identifier);
    }
}
