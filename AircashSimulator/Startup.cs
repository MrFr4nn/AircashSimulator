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
using AircashSimulator.Hubs;
using Services.AircashPayStaticCode;
using Services.AircashPayment;
using Services.AircashPayoutV2;
using Services.AircashInAppPay;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System.Buffers.Text;
using Newtonsoft.Json;
using Services.Translations;
using Service.Settings;
using CrossCutting;
using Services.Signature;

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
            services.AddMemoryCache();
            services.AddHttpClient<IHttpRequestService, HttpRequestService>();
            services.AddTransient<ISettingsService, SettingsService>();
            services.AddTransient<IHelperService, HelperService>();
            services.AddTransient<IAbonSalePartnerService, AbonSalePartnerService>();
            services.AddTransient<IAbonOnlinePartnerService, AbonOnlinePartnerService>();
            services.AddTransient<IHttpRequestService, HttpRequestService>();
            services.AddTransient<IAuthenticationService, AuthenticationService>();
            services.AddTransient<IAircashPayoutService, AircashPayoutService>();
            services.AddTransient<IAircashPayoutV2Service, AircashPayoutV2Service>();
            services.AddTransient<IAircashPaymentAndPayoutService, AircashPaymentAndPayoutService>();
            services.AddTransient<IAircashPayService, AircashPayService>();
            services.AddTransient<IAircashPayStaticCodeService, AircashPayStaticCodeService>(); 
            services.AddTransient<ITransactionService, TransactionService>();
            services.AddTransient<ITranslationsService, TranslationsService>();
            services.AddTransient<IPartnerService, PartnerService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IAircashFrameService, AircashFrameService>();
            services.AddTransient<IAircashFrameV2Service, AircashFrameV2Service>();
            services.AddTransient<IMatchService, MatchService>();
            services.AddTransient<IAircashPaymentService, AircashPaymentService>();
            services.AddTransient<IAircashInAppPayService, AircashInAppPayService>();
            services.AddTransient<UserContext>();
            services.AddTransient<ICouponService, CouponService>();
            services.AddTransient<IPartnerAbonDenominationService, PartnerAbonDenominationService>();
            services.AddTransient<IAircashPosDepositService, AircashPosDepositService>();
            services.AddTransient<ISignatureService, SignatureService>();
            services.Configure<AircashConfiguration>(Configuration.GetSection("AircashConfiguration"));
            services.Configure<JwtConfiguration>(Configuration.GetSection("JwtConfiguration"));
            services.AddSignalR(o => o.EnableDetailedErrors = true);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, AircashSimulatorContext context)
        {
            context.Database.Migrate();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    context.Response.StatusCode = 400; 
                    context.Response.ContentType = "application/json";


                    var error = context.Features.Get<IExceptionHandlerFeature>();
                    if (error != null)
                    {
                        var ex = (SimulatorException)error.Error;

                        if (ex.Code > 0)
                        {
                            await context.Response.WriteAsync(JsonConvert.SerializeObject(
                                new
                                {
                                    Code = ex.Code,
                                    Message = ex.Message
                                })
                            , Encoding.UTF8);
                        }
                    }
                });
            });

            app.UseSerilogRequestLogging();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(builder => builder
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed((host) => true)
            .AllowCredentials()
            );

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<NotificationHub>("/hubs/notificationhub");
            });
        }
    }
}
