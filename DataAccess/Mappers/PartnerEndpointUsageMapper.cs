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
    public class PartnerEndpointUsageMapper : IEntityTypeConfiguration<PartnerEndpointUsageEntity>
    {
        public void Configure(EntityTypeBuilder<PartnerEndpointUsageEntity> builder)
        {
            builder.ToTable("PartnerEndpointsUsage");
            builder.Property(x => x.PartnerId).IsRequired();
            builder.Property(x => x.EndpointId).IsRequired();

        }
    }
}
