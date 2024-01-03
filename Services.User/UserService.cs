using AircashSimulator;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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
        public async Task<List<UserDetailVM>> GetUsers(int PageNumber, int PageSize, string Search)
        {
            var query = !String.IsNullOrEmpty(Search) ?
                     await AircashSimulatorContext.Users
                    .Where(s => s.Username.Contains(Search))
                    .OrderBy(t => t.Username)
                    .Skip((PageNumber - 1) * PageSize)
                    .Take(PageSize).ToListAsync()
                     :
                     await AircashSimulatorContext.Users
                    .OrderBy(t => t.Username)
                    .Skip((PageNumber - 1) * PageSize)
                    .Take(PageSize).ToListAsync();

            var users = query.Select(x => new UserDetailVM
            {
                UserId = x.UserId,
                UserName = x.Username,
                Email = x.Email,
                FirstName = x.FirstName,
                LastName = x.LastName,
                PhoneNumber = x.PhoneNumber,
                BirthDate = x.BirthDate,
                Partner = new PartnerVM { Id = x.PartnerId, Name = null },
                Environment = x.Environment
            }).ToList();

            if (users != null)
            {
                foreach (UserDetailVM u in users)
                {
                    PartnerEntity partner = AircashSimulatorContext.Partners.FirstOrDefault(p => p.PartnerId == u.Partner.Id);
                    if (partner != null)
                    {
                        u.Partner = new PartnerVM { Id = partner.PartnerId, Name = partner.PartnerName };
                    }
                }
            }
            return users;
        }

        public async Task SaveUser(UserDetailVM request)
        {
            string hash = "";
            if (request.Password != null)
            {
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
            }
            if (request.UserId != null)
            {
                var user = await AircashSimulatorContext.Users.FirstOrDefaultAsync(x => x.UserId == request.UserId);
                if ((await AircashSimulatorContext.Users.Where(x => x.Username == request.UserName && x.UserId != request.UserId).ToListAsync()).Count() > 0)
                    throw new SimulatorException(SimulatorExceptionErrorEnum.UsernameAlreadyTaken, "Username already taken.");

                user.Email = request.Email;
                user.PartnerId = request.Partner.Id;
                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.BirthDate = request.BirthDate;
                user.PhoneNumber = request.PhoneNumber;
                if(request.Password != null) user.PasswordHash = hash;
                user.Environment = request.Environment;
                AircashSimulatorContext.Users.Update(user);
            }
            else
            {
                if ((await AircashSimulatorContext.Users.Where(x => x.Username == request.UserName).ToListAsync()).Count() > 0)
                    throw new SimulatorException(SimulatorExceptionErrorEnum.UsernameAlreadyTaken, "Username already taken.");

                await AircashSimulatorContext.Users.AddAsync(new UserEntity
                {
                    UserId = Guid.NewGuid().ToString(),
                    Username = request.UserName,
                    Email = request.Email,
                    PartnerId = request.Partner.Id,
                    PasswordHash = hash,
                    Environment = request.Environment,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    BirthDate = request.BirthDate,
                    PhoneNumber = request.PhoneNumber,
            });
            }
            await AircashSimulatorContext.SaveChangesAsync();
        }
        public async Task DeleteUser(string? userId)
        {
            var findUser = await AircashSimulatorContext.Users.FirstOrDefaultAsync(x => x.UserId == userId);
            AircashSimulatorContext.Users.Remove(findUser);
            await AircashSimulatorContext.SaveChangesAsync();
        }

        public async Task<EnvironmentEnum> GetUserEnvironment(string userId) {
            var environment = EnvironmentEnum.Staging;
            var user = AircashSimulatorContext.Users.Where(x => x.UserId == userId).FirstOrDefault();
            if(user != null) environment = user.Environment;
            return environment;
        }
        public async Task<UserDTO> GetUserByIdentifier(string identifier) 
        {
            return await AircashSimulatorContext.Users
                .Where(x => x.Username == identifier || x.Email == identifier)
                .Select(x => new UserDTO {
                    UserId = x.UserId,
                    PartnerId = x.PartnerId,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    BirthDate = x.BirthDate.Value.ToString("yyyy-MM-dd")
                }).FirstOrDefaultAsync();
        }
    }
}