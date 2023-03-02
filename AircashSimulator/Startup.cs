using DataAccess;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Services.AbonSalePartner;
using Services.AbonOnlinePartner;
using Services.HttpRequest;
using AircashSimulator.Configuration;
using Services.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using Services.Coupon;
using Services.AircashPayout;
using AircashSimulator.Extensions;
using Services.AircashPay;
using Serilog;
using Services.Transaction;
using Services.Transactions;
using Services.AircashPaymentAndPayout;
using Services.PartnerAbonDenominations;
using Services.AircashFrame;
using AircashFrame;
using Services.Partner;
using Services.User;
using Services.AircashFrameV2;
using Services.AircashPosDeposit;
using Services.MatchService;
using Services.AircashPayment;

namespace AircashSimulator
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            var x = Configuration["AbonSimulatorConfiguration:ConnectionString"];
            var jwtConfiguration = Configuration.GetSection("JwtConfiguration").Get<JwtConfiguration>();
            services.AddDbContext<AircashSimulatorContext>(options => options.UseSqlServer(Configuration["AbonSimulatorConfiguration:ConnectionString"]), ServiceLifetime.Transient);

            services.AddCors(config =>
            {
                config.AddDefaultPolicy( options =>
                {
                    options
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
            });

            services.AddControllers();

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
           .AddJwtBearer(x =>
           {
               x.RequireHttpsMetadata = true;
               x.TokenValidationParameters = new TokenValidationParameters
               {
                   ValidateAudience = true,
                   ValidAudience = jwtConfiguration.Audience,
                   ValidateIssuer = true,
                   ValidIssuer = jwtConfiguration.Issuer,
                   ValidateIssuerSigningKey = true,
                   IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfiguration.Secret)),
                   ValidateLifetime = true,
                   ClockSkew = TimeSpan.Zero
               };
           });

            
            services.AddHttpClient<IHttpRequestService, HttpRequestService>();
            services.AddTransient<IAbonSalePartnerService, AbonSalePartnerService>();
            services.AddTransient<IAbonOnlinePartnerService, AbonOnlinePartnerService>();
            services.AddTransient<IHttpRequestService, HttpRequestService>();
            services.AddTransient<IAuthenticationService, AuthenticationService>();
            services.AddTransient<IAircashPayoutService, AircashPayoutService>();
            services.AddTransient<IAircashPaymentAndPayoutService, AircashPaymentAndPayoutService>();
            services.AddTransient<IAircashPayService, AircashPayService>();
            services.AddTransient<ITransactionService, TransactionService>();
            services.AddTransient<IPartnerService, PartnerService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IAircashFrameService, AircashFrameService>();
            services.AddTransient<IAircashFrameV2Service, AircashFrameV2Service>();
            services.AddTransient<IMatchService, MatchService>();
            services.AddTransient<IAircashPaymentService, AircashPaymentService>();
            services.AddTransient<UserContext>();
            services.AddTransient<ICouponService, CouponService>();
            services.AddTransient<IPartnerAbonDenominationService, PartnerAbonDenominationService>();
            services.AddTransient<IAircashPosDepositService, AircashPosDepositService>();
            services.Configure<AbonConfiguration>(Configuration.GetSection("AbonConfiguration"));
            services.Configure<AircashConfiguration>(Configuration.GetSection("AircashConfiguration"));
            services.Configure<JwtConfiguration>(Configuration.GetSection("JwtConfiguration"));  
        }

        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, AircashSimulatorContext context)
        {
            context.Database.Migrate();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors();

            app.UseExceptionHandler("/api/Error");

            app.UseSerilogRequestLogging();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
