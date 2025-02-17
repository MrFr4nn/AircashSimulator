﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public interface IAircashPaymentService
    {
         Task<object> CreateAndConfirmPayment(CreateAndConfirmPaymentReceive ReceiveData);
         Task<object> CheckPlayer(List<AircashPaymentParameters> checkPlayerParameters);
        Task<object> CheckPlayerPartner(List<AircashPaymentParameters> checkPlayerParameters, string endpoint);
        Task<object> CreateAndConfirmPartner(List<AircashPaymentParameters> checkPlayerParameters, string endpoint, decimal amount, string transactionId);
    }
}
