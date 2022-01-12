using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class EditedPreparedTransactions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PreparedAircashTransactions",
                table: "PreparedAircashTransactions");

            migrationBuilder.RenameTable(
                name: "PreparedAircashTransactions",
                newName: "PreparedAircashPayTransactions");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PreparedAircashPayTransactions",
                table: "PreparedAircashPayTransactions",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PreparedAircashPayTransactions",
                table: "PreparedAircashPayTransactions");

            migrationBuilder.RenameTable(
                name: "PreparedAircashPayTransactions",
                newName: "PreparedAircashTransactions");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PreparedAircashTransactions",
                table: "PreparedAircashTransactions",
                column: "Id");
        }
    }
}
