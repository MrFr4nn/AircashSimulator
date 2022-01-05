using Domain.Entities;
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
        public DbSet<PreparedAircashTransactionEntity> PreparedAircashTransactions { get; set; }
        public DbSet<PreparedAircashFrameTransactionEntity> PreparedAircashFrameTransactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AircashSimulatorContext).Assembly);
            modelBuilder.Entity<CouponEntity>().ToTable("Coupons");
        }
    }
}