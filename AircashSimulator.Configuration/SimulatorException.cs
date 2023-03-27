using Domain.Entities.Enum;
using System;

namespace AircashSimulator
{
    public class SimulatorException : Exception
    {
        public SimulatorExceptionErrorEnum Code {  get; set; }
        public SimulatorException(SimulatorExceptionErrorEnum code, string message): base(message) 
        {
            Code = code;
        }
    }
}
