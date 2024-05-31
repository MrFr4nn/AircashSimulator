using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class LoginAccountsEntity
    {
        public int Id { get; set; }
        public Guid PartnerId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Url { get; set; }
    }
}
