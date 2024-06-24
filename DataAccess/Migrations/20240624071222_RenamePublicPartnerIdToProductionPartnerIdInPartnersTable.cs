using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class RenamePublicPartnerIdToProductionPartnerIdInPartnersTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PublicPartnerId",
                table: "Partners",
                newName: "ProductionPartnerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProductionPartnerId",
                table: "Partners",
                newName: "PublicPartnerId");
        }
    }
}
