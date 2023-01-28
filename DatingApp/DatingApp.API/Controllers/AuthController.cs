using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers;

[Route("api/[controller]")]
public class AuthController : Controller
{
    private readonly IAuthRepository _repo;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;

    public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
    {
        _mapper = mapper;
        _config = config;
        _repo = repo;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserForRegisterDto userForRegisterDto)
    {
        if (!string.IsNullOrEmpty(userForRegisterDto.Username))
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

        if (await _repo.UserExists(userForRegisterDto.Username))
            ModelState.AddModelError("Username", "username already exists");

        //validate request
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userToCreate = new User
        {
            Username = userForRegisterDto.Username
        };

        var createUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

        return StatusCode(201);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserForLoginDto userForLoginDto)
    {
        //throw new Exception("Computer Says No!");
        var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(),
        userForLoginDto.Password);

        if (userFromRepo == null)
            return (Unauthorized());

        //generate jwt token
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_config.GetValue<string>("AppSettings:token"));
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            }),
            Expires = DateTime.Now.AddDays(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha512Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        var user = _mapper.Map<UserForListDtos>(userFromRepo);

        return Ok(new { token = tokenHandler.WriteToken(token), user });
    }
}