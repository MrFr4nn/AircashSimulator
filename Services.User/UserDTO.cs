using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.User
{
    public class UserDTO
    {
        public Guid UserId { get; set; }
        public Guid PartnerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string BirthDate { get; set; }
    }
}
