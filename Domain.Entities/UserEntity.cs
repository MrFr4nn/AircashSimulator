using System;

namespace Domain.Entities
{
    public class UserEntity
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public Guid PartnerId { get; set; }
        public string PasswordHash { get; set; }
    }
}
