using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class AbonGenerateInsertPartnerIds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdHR','261d648d-6bd8-4f5c-baf6-d3fcd336f985')
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdCZ','15246f56-53a8-446c-855a-39b427ba1e3d')
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdFR','9ed97bd7-dbc8-4839-ae9b-5c13cf5afb0f')
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdDE','c3678f7c-dda3-4044-90c6-71f9dbdbbd7b')
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdGR','5daed4c7-0667-451d-b870-3fddd4217935')
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdIT','842fe19a-426b-4507-95e4-933a6a367164')
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdPL','1eda4d60-4113-40bf-a20e-031bc290fc36')
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdRO','9be565cb-762a-403b-bb77-420ffdf46c61')
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdSK','78d6d87b-ff1d-41a7-af2b-f46a5df0e0d3')
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdSI','a0686939-f4e9-4fe7-8e1e-7896b67f08a6')
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdES','e982453d-9280-4a3a-8244-fb44027a9007')
                INSERT INTO [dbo].[Settings]([Key],[Value]) VALUES('GenerateAbonPartnerIdBG','0a2fd7bc-218f-4168-a873-eb2b057d4811')
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdHR'
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdCZ'
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdFR'
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdDE'
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdGR'
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdIT'
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdPL'
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdRO'
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdSK'
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdSI'
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdES'
                DELETE FROM [dbo].[Settings] WHERE [Key] = 'GenerateAbonPartnerIdBG'
            ");
        }
    }
}
