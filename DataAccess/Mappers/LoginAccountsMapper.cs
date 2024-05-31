using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Mappers
{
    public class LoginAccountsMapper : IEntityTypeConfiguration<LoginAccountsEntity>
    {
        public void Configure(EntityTypeBuilder<LoginAccountsEntity> builder)
        {
            builder.ToTable("LoginAccounts");
            builder.Property(x => x.PartnerId).IsRequired();
            builder.Property(x => x.Username).HasMaxLength(256);
            builder.Property(x => x.Password).HasMaxLength(256);
            builder.Property(x => x.Url).HasMaxLength(256);
        }
    }
}
