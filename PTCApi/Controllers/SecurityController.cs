using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PTCApi.EntityClasses;
using PTCApi.ManagerClasses;
using PTCApi.Model;

namespace PTCApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecurityController : AppControllerBase
    {
        public SecurityController(ILogger<ProductController> logger, PtcDbContext context, JwtSettings settings)
        {
            _logger = logger;
            _dbContext = context;
            _settings = settings;
        }
        private readonly PtcDbContext _dbContext;
        private readonly ILogger<ProductController> _logger;
        private readonly JwtSettings _settings;

        [HttpPost("Login")]
        public IActionResult Login([FromBody] AppUser user)
        {
            var auth = new AppUserAuth();
            var securityManager = new SecurityManager(_dbContext, auth, _settings);
            auth = (AppUserAuth)securityManager.ValidateUser(user.UserName, user.Password);
            if (!auth.IsAuthenticated) return StatusCode(StatusCodes.Status404NotFound, "Invalid User/Password");
            return StatusCode(StatusCodes.Status200OK, auth);
        }
    }
}