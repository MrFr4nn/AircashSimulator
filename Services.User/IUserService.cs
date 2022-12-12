using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.User
{
    public interface IUserService
    {
        Task<List<UserVM>> GetUsers();
        Task<UserDetailVM> GetUserDetail(Guid userId);
        Task SaveUser(UserDetailVM request);

        Task<UserEntity> GetUserByIdentifier(string identifier);
    }
}
