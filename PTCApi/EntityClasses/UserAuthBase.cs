using System;
namespace PTCApi.EntityClasses{
    public class UserAuthBase{
        public UserAuthBase(){
            UserId = Guid.Empty;
            UserName = string.Empty;
            BearerToken = string.Empty;
            IsAuthenticated = false;
        }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string BearerToken { get; set; }
        public bool IsAuthenticated { get; set; }
    }
}