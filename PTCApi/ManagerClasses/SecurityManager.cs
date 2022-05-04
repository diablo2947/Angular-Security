using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PTCApi.EntityClasses;
using PTCApi.Model;

namespace PTCApi.ManagerClasses
{
    public class SecurityManager
    {
        public SecurityManager(PtcDbContext context, UserAuthBase auth, JwtSettings settings)
        {
            _DbContext = context;
            _auth = auth;
            _settings = settings;
        }
        private PtcDbContext _DbContext = null;
        private UserAuthBase _auth = null;
        private JwtSettings _settings = null;

        protected List<UserClaim> GetUserClaims(Guid userId)
        {
            var list = new List<UserClaim>();
            try
            {
                list = _DbContext.Claims.Where(x => x.UserId.Equals(userId)).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Exception trying to retreive user claims: ", ex);
            }
            return list;
        }

        protected UserAuthBase BuildUserAuthObject(Guid userId, string userName)
        {
            var claims = new List<UserClaim>();
            var _authType = _auth.GetType();

            _auth.UserId = userId;
            _auth.UserName = userName;
            _auth.IsAuthenticated = true;

            claims = GetUserClaims(userId);

            foreach (var claim in claims)
            {
                try
                {
                    _authType.GetProperty(claim.ClaimType).SetValue(_auth, Convert.ToBoolean(claim.ClaimValue), null);
                }
                catch (System.Exception)
                {
                    throw;
                }
            }
            _auth.BearerToken = BuildJwtToken(claims, userName);
            return _auth;
        }
        public UserAuthBase ValidateUser(string userName, string password)
        {
            try
            {
                UserBase user = _DbContext.Users.SingleOrDefault(x => x.UserName.ToLower().Equals(userName.ToLower()) && x.Password.ToLower().Equals(password.ToLower()));
                if (user is not null)
                    _auth = BuildUserAuthObject(user.UserId, userName);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception while trying to retreive user: ", ex);
            }
            return _auth;
        }

        protected string BuildJwtToken(IList<UserClaim> claims, string userName)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_settings.Key)
            );
            var jwtClaims = new List<Claim>{
                new Claim(JwtRegisteredClaimNames.Sub,userName),
                new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
            };
            foreach (var claim in claims)
            {
                jwtClaims.Add(new Claim(claim.ClaimType, claim.ClaimValue));
            }
            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: jwtClaims,
                notBefore: DateTime.Now.AddMinutes(_settings.MinutesToExpiration),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}