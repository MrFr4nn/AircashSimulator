using DataAccess;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Services.Partner;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Services.User
{
    public class UserService : IUserService
    {
        private AircashSimulatorContext AircashSimulatorContext;

        public UserService(AircashSimulatorContext aircashSimulatorContext)
        {
            AircashSimulatorContext = aircashSimulatorContext;
        }

        private List<UserDetailVM> GetPartnerName(List<UserDetailVM> users)
        {
           
            foreach(UserDetailVM u in users)
            {
                PartnerEntity partner = AircashSimulatorContext.Partners.FirstOrDefault(p => p.PartnerId == u.Partner.Id);
                if(partner != null)
                {
                    u.Partner = new PartnerVM {Id = partner.PartnerId,Name = partner.PartnerName};
                }
            }
            return users;
        }


        public async Task<List<UserDetailVM>> GetUsers(int PageNumber, int PageSize, string Search)
        {

            var users = !String.IsNullOrEmpty(Search) ?
                     await AircashSimulatorContext.Users
                    .Where(s => s.Username.Contains(Search))
                    .Select(x => new UserDetailVM
                    {
                        UserId = x.UserId,
                        UserName = x.Username,
                        Email = x.Email,
                        Partner = new PartnerVM {Id = x.PartnerId, Name = null}
                    })
                    .OrderBy(t => t.UserName)
                    .Skip((PageNumber - 1) * PageSize)
                    .Take(PageSize).ToListAsync()
                     :
                     await AircashSimulatorContext.Users
                    .Select(x => new UserDetailVM
                    {
                        UserId = x.UserId,
                        UserName = x.Username,
                        Email = x.Email,
                        Partner = new PartnerVM { Id = x.PartnerId, Name = null }
                    })
                    .OrderBy(t => t.UserName)
                    .Skip((PageNumber - 1) * PageSize)
                    .Take(PageSize).ToListAsync();

            if(users != null)
            {
                users = GetPartnerName(users);
            }

            return users;
        }

        public async Task SaveUser(UserDetailVM request)
        {
            string hash = "";
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(request.Password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                hash = builder.ToString();
            }

            if (request.UserId != null)
            {
                var user = await AircashSimulatorContext.Users.FirstOrDefaultAsync(x => x.UserId == request.UserId);
                user.Email = request.Email;
                user.PartnerId = request.Partner.Id;
                user.PasswordHash = hash;

                AircashSimulatorContext.Users.Update(user);
            }
            else
            {
                if ((await AircashSimulatorContext.Users.Where(x => x.Username == request.UserName).ToListAsync()).Count() > 0)
                    throw new Exception("Username already taken.");

                await AircashSimulatorContext.Users.AddAsync(new UserEntity
                {
                    UserId = Guid.NewGuid(),
                    Username = request.UserName,
                    Email = request.Email,
                    PartnerId = request.Partner.Id,
                PasswordHash = hash
                });
            }

            await AircashSimulatorContext.SaveChangesAsync();
        }
    }
}
