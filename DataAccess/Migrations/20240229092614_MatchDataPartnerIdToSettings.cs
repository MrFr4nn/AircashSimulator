using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class MatchDataPartnerIdToSettings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('MatchPersonalDataDefault','f805a87b-eb1b-4d23-b0be-258b3ea9b610')");
            migrationBuilder.Sql("INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('MatchPersonalDataDateOnly','6e39f537-2976-471b-8a20-9506eacfdaa2')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [dbo].[Settings] WHERE [Key] = 'MatchPersonalDataDefault'");
            migrationBuilder.Sql("DELETE FROM [dbo].[Settings] WHERE [Key] = 'MatchPersonalDataDateOnly'");
        }
    }
}
