using System;

namespace AircashSimulator
{
    public class SimulatorException : Exception
    {
        public int Code {  get; set; }
        public SimulatorException(int code, string message): base(message) 
        {
            Code = code;
        }
    }
}
