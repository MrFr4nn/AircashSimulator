using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AircashSimulator.Extensions;
using System.Text;
using System.Security.Cryptography;
using Services.User;
using AircashSimulator;
using System.Data;
using CrossCutting;
using Microsoft.Extensions.Options;

namespace Services.Partner
{
    public class PartnerService : IPartnerService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IUserService UserService;
        private IHelperService HelperService;

        private const string DefaultPrivateKey = "";
        private const string DefaultPrivateKeyPass = "";

        public PartnerService(AircashSimulatorContext aircashSimulatorContext, IUserService userService, IHelperService helperService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            UserService = userService;
            HelperService = helperService;
        }

        public async Task<List<PartnerVM>> GetPartners()
        {
            var partners = await AircashSimulatorContext.Partners.Select(x => new PartnerVM
            {
                Id = x.PartnerId,
                Name = x.PartnerName
            }).ToListAsync();

            return partners;
        }

        public List<Role> GetRoles()
        {
            var roles = Enum.GetValues(typeof(RoleEnum)).Cast<RoleEnum>().ToList().Select(x => new Role { RoleId = x, RoleName = x.ToString() }).ToList();
            roles.Remove(roles.Where(x => x.RoleId == RoleEnum.Admin).FirstOrDefault());
            return roles;
        }
       public List<SettingRoles> GetPartnerSettingRoles()
        {
            var roles = Enum.GetValues(typeof(PartnerSettingEnum)).Cast<PartnerSettingEnum>().ToList().Select(x => new SettingRoles { SettingId = x, SettingName = x.ToString() }).ToList();
            return roles;
        }

        public async Task<List<PartnerDetailVM>> GetPartnersDetail(int pageSize, int pageNumber, string search)
        {
            Expression<Func<PartnerEntity, bool>> predicate = x => true;

            if (!String.IsNullOrEmpty(search))
                predicate = predicate.AndAlso(x => x.PartnerName.Contains(search) || x.Brand.Contains(search) || x.PartnerId.ToString().Contains(search) || x.ProductionPartnerId.ToString().Contains(search));

            var partners = await AircashSimulatorContext.Partners
                    .Where(predicate).OrderBy(t => t.PartnerName)
                    .Select(x => new PartnerDetailVM
                    {
                        PartnerId = x.PartnerId,
                        PartnerName = x.PartnerName,
                        CurrencyId = x.CurrencyId,
                        CountryCode = x.CountryCode,
                        Environment = x.Environment,
                        Roles = null,
                        UseDefaultPartner = x.UseDefaultPartner,
                        Brand = x.Brand,
                        ProductionPartnerId = x.ProductionPartnerId
                    })
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize).ToListAsync();

            if (partners != null)
            {
                List<Role> roles = GetRoles();
                var partnersRoles = AircashSimulatorContext.PartnerRoles.Select(r => new PartnerRoleEntity { PartnerId = r.PartnerId, PartnerRole = r.PartnerRole }).ToList();

                foreach (var p in partners)
                {
                    List<PartnerRoleEntity> partnerRole = partnersRoles.Where(a => a.PartnerId == p.PartnerId).ToList();
                    if (partnerRole.Count() > 0)
                    {
                        p.Roles = roles.Where(r => partnerRole.Select(r => r.PartnerRole).Contains(r.RoleId)).ToList();
                    }
                }
            }
            return partners;
        }
        public async Task<List<PartnerSettingVM>> GetPartnerSetting(Guid partnerId)
        {
            var partnerSetting = await AircashSimulatorContext.PartnerSettings
                .Where(p => p.PartnerId == partnerId)
                .Select(x => new PartnerSettingVM
                {
                    Id = x.Id,
                    PartnerId = x.PartnerId,
                    Key = x.Key,
                    Value = x.Value
                }).ToListAsync();

            return partnerSetting;
        }


        public async Task SavePartner(SavePartnerVM request)
        {
            Guid id;
            if (request.PartnerId != null )
            {
                var partner = await AircashSimulatorContext.Partners.FirstOrDefaultAsync(x => x.PartnerId == request.PartnerId);
                var partnerExist = await AircashSimulatorContext.Partners.FirstOrDefaultAsync(x => x.PartnerId == request.NewPartnerId);
                id = partner.PartnerId;
                if (partnerExist != null && request.PartnerId != request.NewPartnerId) throw new SimulatorException(SimulatorExceptionErrorEnum.PartnerIdAlreadyTaken, "PartnerId already taken");
                if (request.NewPartnerId != Guid.Empty) 
                {
                    id = request.NewPartnerId;
                }
                partner.PartnerId = id;
                partner.PartnerName = request.PartnerName;
                partner.CurrencyId = request.CurrencyId;
                partner.CountryCode = request.CountryCode;
                partner.Environment = request.Environment;
                partner.UseDefaultPartner = request.UseDefaultPartner;

                var roles = await AircashSimulatorContext.PartnerRoles.Where(x => x.PartnerId == request.PartnerId).ToListAsync();
                foreach (var role in roles)
                {
                    if (role.PartnerRole != RoleEnum.Admin)
                    {
                        AircashSimulatorContext.PartnerRoles.Remove(role);
                    }
                }
                var users = await AircashSimulatorContext.Users.Where(x=>x.PartnerId== request.PartnerId).ToListAsync();
                foreach (var user in users)
                {
                    user.PartnerId = id;
                }

                AircashSimulatorContext.Partners.Update(partner);
            }
            else
            {
                id = Guid.NewGuid();
                await AircashSimulatorContext.Partners.AddAsync(new PartnerEntity
                {
                    PartnerId = id,
                    PartnerName = request.PartnerName,
                    PrivateKey = request.PrivateKey == null? DefaultPrivateKey : request.PrivateKey ,
                    PrivateKeyPass = request.PrivateKeyPass == null? DefaultPrivateKeyPass : request.PrivateKeyPass,
                    CurrencyId = request.CurrencyId,
                    CountryCode = request.CountryCode,
                    Environment = request.Environment,
                    UseDefaultPartner = request.UseDefaultPartner
            });
            }
            if (request.Roles != null)
            { 
                if (request.Roles.Count > 0)
                {
                        foreach (var role in request.Roles)
                        {
                            await AircashSimulatorContext.PartnerRoles.AddAsync(new PartnerRoleEntity
                            {
                                PartnerId = id,
                                PartnerRole = role
                            });
                        }
                }
            }

            if (request.Username != null) 
            {
                await SaveUser(request.Username, id);
            }
            await AircashSimulatorContext.SaveChangesAsync();
        }
        public async Task SavePartnerSetting(SavePartnerSettingVM request)
        {
            var settingsDb = await AircashSimulatorContext.PartnerSettings.Where(x=>x.PartnerId==request.PartnerId).ToListAsync();
            var partnerSettings = request.NewPartnerSetting;
            var settingsToUpdate = settingsDb.Where(x => partnerSettings.Any(y => y.settingId == x.Key && !String.IsNullOrEmpty( y.input) && y.input!= x.Value)).ToList();
            var settingsToDelete = settingsDb.Where(x => partnerSettings.Any(y => y.settingId == x.Key && String.IsNullOrEmpty(y.input))).ToList();
            var settingsToAdd = request.NewPartnerSetting.Where(x => !settingsDb.Any(y => y.Key == x.settingId  ) && !String.IsNullOrEmpty(x.input)).ToList();
            foreach (var setting in settingsToDelete)
            {
                AircashSimulatorContext.PartnerSettings.Remove(setting);
            }
            foreach (var setting in settingsToUpdate)
            {
                setting.Value = partnerSettings.Where(x => x.settingId == setting.Key).Select(x => x.input).FirstOrDefault();
                AircashSimulatorContext.PartnerSettings.Update(setting);
            }
            foreach (var setting in settingsToAdd)
            {
                var settingDb = new PartnerSettingsEntity
                {
                    PartnerId=setting.PartnerId,
                    Key = setting.settingId,
                    Value = setting.input

                };
                 AircashSimulatorContext.PartnerSettings.Add(settingDb);
            }
            await AircashSimulatorContext.SaveChangesAsync();
        }

        public async Task DeletePartner(PartnerDetailVM Partner)
        {
            var partner = await AircashSimulatorContext.Partners.FirstOrDefaultAsync(x => x.PartnerId == Partner.PartnerId);
            AircashSimulatorContext.Partners.Remove(partner);

            var roles = await AircashSimulatorContext.PartnerRoles.Where(x => x.PartnerId == Partner.PartnerId).ToListAsync();
            if(roles != null)
            {
                foreach (var role in roles)
                {
                    AircashSimulatorContext.PartnerRoles.Remove(role);
                }
            }
            var findAllUsers = await AircashSimulatorContext.Users.Where(x => x.PartnerId == Partner.PartnerId).ToListAsync();
            foreach (var user in findAllUsers)
            {
                await UserService.DeleteUser(user.UserId);
            }
            await AircashSimulatorContext.SaveChangesAsync();
        }
       
        public async Task SaveUser(string username, Guid partnerId) {
            string hash = "";
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(username));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                hash = builder.ToString();
            }

            if ((await AircashSimulatorContext.Users.Where(x => x.Username == username).ToListAsync()).Count() > 0)
                throw new SimulatorException(SimulatorExceptionErrorEnum.UsernameNotFound, "Username already taken.");

            await AircashSimulatorContext.Users.AddAsync(new UserEntity
            {
                UserId = Guid.NewGuid().ToString(),
                Username = username,
                Email = username,
                PartnerId = partnerId,
                PasswordHash = hash,
                Environment = EnvironmentEnum.Staging
            });
        }

        public async Task<List<PartnerDetailSite>> GetPartnerDetail(Guid partnerId)
        {
            var partnerRoles = AircashSimulatorContext.PartnerRoles.Where(p => p.PartnerId == partnerId)
                .Select(r => new Role { 
                    RoleId=r.PartnerRole,
                    RoleName=r.PartnerRole.ToString()
                }).ToList();
            var endpointsTypeDictionary = await AircashSimulatorContext.Endpoints
                                    .ToDictionaryAsync(
                                        x => x.Id,
                                        x => new EndpointInfo
                                        {
                                            EndpointType = x.EndpointType,
                                            Url = x.Url
                                        });
            var partnerEndpoints = await AircashSimulatorContext.PartnerEndpointsUsage.Where(x => x.PartnerId == partnerId)
                .Select(x => new PartnerEndpoint
                {
                    Id = x.Id,
                    Url = endpointsTypeDictionary[x.EndpointId].Url,
                    Request = x.Request,
                    Response = x.Response,
                    EndpointType = (int)endpointsTypeDictionary[x.EndpointId].EndpointType,
                    EndpointTypeName = endpointsTypeDictionary[x.EndpointId].EndpointType.ToString(),
                    EndpointId = x.EndpointId
                }).ToListAsync();
            var partnerIntegrationContact = await AircashSimulatorContext.IntegrationContacts
                .Where(x => x.PartnerId == partnerId)
                .Select(x =>  new PartnerIntegrationContact
                {
                    Id = x.Id,
                    ContactName = x.ContactName,
                    ContactEmail = x.ContactEmail,
                    ContactPhoneNumber = x.ContactPhoneNumber
                })
                .ToListAsync();
            var partnerErrorCodes = await AircashSimulatorContext.ErrorCodes
                .Where(x => x.PartnerId == partnerId)
                .Select(x => new PartnerErrorCode
                {
                    Id= x.Id,
                    Code = x.Code,
                    LocoKey = x.LocoKey,
                    Description = x.Description
                })
                .ToListAsync();
            var partnerLoginAccounts = await AircashSimulatorContext.LoginAccounts
                .Where(x => x.PartnerId == partnerId)
                .Select(x => new PartnerLoginAccount
                {
                    Id = x.Id,
                    Username = x.Username,
                    Password = x.Password,
                    Url = x.Url,
                })
                .ToListAsync();
            var partnerDetail = await AircashSimulatorContext.Partners
                .Where(p => p.PartnerId == partnerId)
                .Select(x => new PartnerDetailSite
            {
                PartnerId = x.PartnerId,
                ProductionPartnerId = x.ProductionPartnerId,
                PartnerName = x.PartnerName,
                Brand = x.Brand,
                Platform = x.Platform,
                InternalTicket = x.InternalTicket,
                Confluence = x.Confluence,
                MarketplacePosition = x.MarketplacePosition,
                CountryCode = x.CountryCode,
                AbonAmountRule = x.AbonAmountRule.ToString(),
                AbonAuthorization = x.AbonAuthorization.ToString(),
                AbonType = x.AbonType.ToString(),
                AcPayType = x.AcPayType.ToString(),
                WithdrawalType = x.WithdrawalType.ToString(),
                WithdrawalInstant = x.WithdrawalInstant.ToString(),
                Roles = partnerRoles,
                PartnerEndpoints = partnerEndpoints,
                PartnerIntegrationContact =partnerIntegrationContact,
                PartnerErrorCodes = partnerErrorCodes,
                PartnerLoginAccounts = partnerLoginAccounts
            }).ToListAsync();
            return partnerDetail;
        }

        public async Task<Option> GetOptions()
        {
            Option options = new Option();
            options.Endpoints= await AircashSimulatorContext.Endpoints.Select( x => new Endpoint
            {
                Id = x.Id,
                EndpointType = x.EndpointType.ToString(),
                Url = x.Url
            }).ToListAsync();
            options.IntegrationTypeEnums = HelperService.EnumToList(new IntegrationTypeEnum());
            options.AbonAuthorizationEnums = HelperService.EnumToList(new AbonAuthorizationEnum());
            options.AbonAmoutRuleEnums = HelperService.EnumToList(new AbonAmoutRuleEnum());
            options.WithdrawalInstantEnums = HelperService.EnumToList(new WithdrawalInstantEnum());
            return options;
        }

        public async Task SavePartnerSite(SavePartnerSite request)
        {
            var partner = await AircashSimulatorContext.Partners.FirstOrDefaultAsync(x => x.PartnerId == request.PartnerId);
            partner.ProductionPartnerId = request.ProductionPartnerId;
            partner.PartnerName = request.PartnerName;
            partner.Brand = request.Brand;
            partner.Platform = request.Platform;
            partner.InternalTicket = request.InternalTicket;
            partner.Confluence = request.Confluence; 
            partner.MarketplacePosition = request.MarketplacePosition;
            partner.CountryCode = request.CountryCode;
            if (Enum.IsDefined(typeof(AbonAmoutRuleEnum), request.AbonAmountRule))
            {
                partner.AbonAmountRule = (AbonAmoutRuleEnum)request.AbonAmountRule;
            }
            if (Enum.IsDefined(typeof(AbonAuthorizationEnum), request.AbonAuthorization))
            {
                partner.AbonAuthorization = (AbonAuthorizationEnum)request.AbonAuthorization;
            }
            if (Enum.IsDefined(typeof(IntegrationTypeEnum), request.AbonType))
            {
                partner.AbonType = (IntegrationTypeEnum)request.AbonType;
            }
            if (Enum.IsDefined(typeof(IntegrationTypeEnum), request.AcPayType))
            {
                partner.AcPayType = (IntegrationTypeEnum)request.AcPayType;
            }
            if (Enum.IsDefined(typeof(IntegrationTypeEnum), request.WithdrawalType))
            {
                partner.WithdrawalType = (IntegrationTypeEnum)request.WithdrawalType;
            }
            if (Enum.IsDefined(typeof(WithdrawalInstantEnum), request.WithdrawalInstant))
            {
                partner.WithdrawalInstant = (WithdrawalInstantEnum)request.WithdrawalInstant;
            }
            AircashSimulatorContext.Partners.Update(partner);

            AircashSimulatorContext.IntegrationContacts.RemoveRange(await AircashSimulatorContext.IntegrationContacts.Where(c => c.PartnerId == request.PartnerId).ToListAsync());
            foreach(PartnerIntegrationContact contact in request.PartnerIntegrationContact)
            {
                await AircashSimulatorContext.IntegrationContacts.AddAsync(new IntegrationContactEntity
                {
                    PartnerId = request.PartnerId,
                    ContactName = contact.ContactName,
                    ContactEmail = contact.ContactEmail,
                    ContactPhoneNumber = contact.ContactPhoneNumber
                });
            }


            AircashSimulatorContext.PartnerEndpointsUsage.RemoveRange(await AircashSimulatorContext.PartnerEndpointsUsage.Where(c => c.PartnerId == request.PartnerId).ToListAsync());
            foreach (PartnerEndpoint endpoint in request.PartnerEndpoints)
            {
                await AircashSimulatorContext.PartnerEndpointsUsage.AddAsync(new PartnerEndpointUsageEntity
                {
                    PartnerId = request.PartnerId,
                    EndpointId = endpoint.EndpointId,
                    Request= endpoint.Request,
                    Response= endpoint.Response

                });
            }
        
            AircashSimulatorContext.ErrorCodes.RemoveRange(await AircashSimulatorContext.ErrorCodes.Where(c => c.PartnerId == request.PartnerId).ToListAsync());
            foreach (PartnerErrorCode errorCode in request.PartnerErrorCodes)
            {
                await AircashSimulatorContext.ErrorCodes.AddAsync(new ErrorCodeEntity
                {
                    PartnerId = request.PartnerId,
                    Code = errorCode.Code,
                    LocoKey = errorCode.LocoKey,
                    Description = errorCode.Description
                });
            }

            AircashSimulatorContext.LoginAccounts.RemoveRange(await AircashSimulatorContext.LoginAccounts.Where(c => c.PartnerId == request.PartnerId).ToListAsync());
            foreach (PartnerLoginAccount loginAccount in request.PartnerLoginAccounts)
            {
                await AircashSimulatorContext.LoginAccounts.AddAsync(new LoginAccountsEntity
                {
                    PartnerId = request.PartnerId,
                    Username = loginAccount.Username,
                    Password = loginAccount.Password,
                    Url = loginAccount.Url
                });
            }

            await AircashSimulatorContext.SaveChangesAsync();
        }

    }
}
