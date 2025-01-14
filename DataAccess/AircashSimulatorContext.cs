﻿using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class AircashSimulatorContext : DbContext
    {
        public AircashSimulatorContext(DbContextOptions<AircashSimulatorContext> options) : base(options)
        {
        }

        public DbSet<SettingEntity> Settings { get; set; }
        public DbSet<TransactionEntity> Transactions { get; set; }
        public DbSet<PartnerEntity> Partners { get; set; }
        public DbSet<CouponEntity> Coupons { get; set; }
        public DbSet<UserEntity> Users { get; set; }
        public DbSet<PartnerAbonDenominationsEntity> PartnerAbonDenominations { get; set; }
        public DbSet<PreparedAircashPayTransactionEntity> PreparedAircashPayTransactions { get; set; }
        public DbSet<PreparedAircashFrameTransactionEntity> PreparedAircashFrameTransactions { get; set; }
        public DbSet<PartnerRoleEntity> PartnerRoles { get; set; }
        public DbSet<PartnerSettingsEntity> PartnerSettings { get; set; }
        public DbSet<IntegrationContactEntity> IntegrationContacts { get; set; }
        public DbSet<ErrorCodeEntity> ErrorCodes { get; set; }
        public DbSet<PartnerEndpointUsageEntity> PartnerEndpointsUsage { get; set; }
        public DbSet<EndpointEntity> Endpoints { get; set; }
        public DbSet<LoginAccountsEntity> LoginAccounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AircashSimulatorContext).Assembly);
            modelBuilder.Entity<CouponEntity>().ToTable("Coupons");
        }
    }
}