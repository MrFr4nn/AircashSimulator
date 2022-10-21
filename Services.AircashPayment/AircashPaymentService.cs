using DataAccess;
using System.Threading.Tasks;
using Domain.Entities;
using System;
using Domain.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Linq;
using System.Runtime.InteropServices;
using System.Linq.Expressions;
using System.Xml;
using System.Reflection.Metadata;

namespace Services.AircashPayment
{
    public class AircashPaymentService : IAircashPaymentService
    {
        private AircashSimulatorContext AircashSimulatorContext;

        public AircashPaymentService(AircashSimulatorContext aircashSimulatorContext)
        {
            AircashSimulatorContext = aircashSimulatorContext;
        }

        public async Task<object> CheckPlayer(List<CheckPlayerParameters> checkPlayerParameters)
        {
            UserEntity user = null;
          
            if (checkPlayerParameters.Select(attribute => attribute.Key).Contains("username"))
            {
                user = AircashSimulatorContext.Users.FirstOrDefault(v => checkPlayerParameters.Select(attribute => attribute.Value).Contains(v.Username));
            }
            else if (checkPlayerParameters.Select(attribute => attribute.Key).Contains("email"))
            {
                user = AircashSimulatorContext.Users.FirstOrDefault(v => checkPlayerParameters.Select(attribute => attribute.Value).Contains(v.Email));
            }

            if(user != null)
            {
                var parameters = new List<Parameters>();
                    parameters.Add(new Parameters
                    {
                        Key = "partnerUserID",
                        Type = "String",
                        Value = user.UserId.ToString()
                    });
                var response = new CheckPlayerResponse
                {
                    IsPlayer = true,
                    Error = null,
                    Parameters = parameters
                };
                 return response;
            }
            else
            {
                var response = new CheckPlayerResponse
                {
                    IsPlayer = false,
                    Error = new ResponseError 
                    {
                        ErrorCode = 500,
                        ErrorMessage = "Unable to find user account"
                    },
                    Parameters = null
                };
                return response;
            } 
        }

        public async Task<object> CreateAndConfirmPayment(CreateAndConfirmPaymentReceive ReceiveData)
        {
            TransactionEntity transactionEntity = new TransactionEntity
            {
                Amount = ReceiveData.Amount,
                TransactionId = Guid.NewGuid(),
                PartnerId = new Guid("8F62C8F0-7155-4C0E-8EBE-CD9357CFD1BF"),
                UserId = Guid.NewGuid(),
                AircashTransactionId = ReceiveData.AircashTransactionId,
                ServiceId = ServiceEnum.AircashPayment,
                RequestDateTimeUTC = DateTime.Today,
                ResponseDateTimeUTC = DateTime.Now,
            };

            AircashSimulatorContext.Transactions.Add(transactionEntity);
            await AircashSimulatorContext.SaveChangesAsync();

            var response = new AircashPaymentResponse
            {
                Success = true,
                PartnerTransactionId = transactionEntity.TransactionId.ToString(),
                Parameters = new List<Parameters> 
                {
                    new Parameters 
                    {
                      Key = null,
                      Type = null,
                      Value = null
                    }
                }
               


            };
            return response;
        }
    }
}
