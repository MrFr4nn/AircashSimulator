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
    public class IntegrationContactMapper : IEntityTypeConfiguration<IntegrationContactEntity>
    {
        public void Configure(EntityTypeBuilder<IntegrationContactEntity> builder)
        {
            builder.ToTable("IntegrationContacts");
            builder.Property(x => x.PartnerId).IsRequired();
            builder.Property(x => x.Contact).IsRequired().HasMaxLength(256);
        }
    }
}
