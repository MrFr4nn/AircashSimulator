using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class EndpointsTableAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Url",
                table: "PartnerEndpointsUsage");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "PartnerEndpointsUsage",
                newName: "EndpointId");

            migrationBuilder.RenameColumn(
                name: "Body",
                table: "PartnerEndpointsUsage",
                newName: "Response");

            migrationBuilder.AddColumn<string>(
                name: "Request",
                table: "PartnerEndpointsUsage",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Endpoints",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EndpointType = table.Column<int>(type: "int", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Endpoints", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Endpoints");

            migrationBuilder.DropColumn(
                name: "Request",
                table: "PartnerEndpointsUsage");

            migrationBuilder.RenameColumn(
                name: "Response",
                table: "PartnerEndpointsUsage",
                newName: "Body");

            migrationBuilder.RenameColumn(
                name: "EndpointId",
                table: "PartnerEndpointsUsage",
                newName: "Type");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "PartnerEndpointsUsage",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);
        }
    }
}
