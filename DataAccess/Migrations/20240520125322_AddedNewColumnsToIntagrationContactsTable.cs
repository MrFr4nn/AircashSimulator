using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class AddedNewColumnsToIntagrationContactsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Contact",
                table: "IntegrationContacts");

            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "IntegrationContacts",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactName",
                table: "IntegrationContacts",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactPhoneNumber",
                table: "IntegrationContacts",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "IntegrationContacts");

            migrationBuilder.DropColumn(
                name: "ContactName",
                table: "IntegrationContacts");

            migrationBuilder.DropColumn(
                name: "ContactPhoneNumber",
                table: "IntegrationContacts");

            migrationBuilder.AddColumn<string>(
                name: "Contact",
                table: "IntegrationContacts",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "");
        }
    }
}
