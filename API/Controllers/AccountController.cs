using System;
using System.Security.Claims;
using API.DTOs;
using API.Extensions;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(SignInManager<AppUser> signInManager) : BaseApiController
{

    [HttpPost("register")]

    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        //registerdtoyilekk frontilne data verum and athine appuser aakennam bcoz AppUser inherits from IdentityUser → it is the Entity Framework Core entity that maps directly to the AspNetUsers table in the database.
        //so athine AppUser aakit vennam createAsyncilekk kodkan
        var user = new AppUser
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Email = registerDto.Email,
            UserName = registerDto.Email
        };


        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }

        return Ok();
    }


    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> LogOut()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }

    [HttpGet("user-info")]
    public async Task<IActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated == false) return NoContent();//checks if u r logged in

        var user = await signInManager.UserManager.GetUserByEmailWithAddress(User);//gets the details of loggedin user by email


        return Ok(new
        {
            user.FirstName,
            user.LastName,
            user.Email,
            Address = user.Address?.ToDto() //here tablilne kittunnad entity aaytanne so athine dto aaki convert aakunnad 
        });
    }

    [HttpGet]
    public ActionResult GetAuthState()
    {
        return Ok(new { IsAuthenticated = User.Identity?.IsAuthenticated ?? false });
    }

    // Frontend logic together:
    // On page reload → call GetAuthState.
    // If true, then call GetUserInfo to get user details.
    // If false, redirect to login.
    // This way, even after refresh, your Angular app stays synced with backend authentication.


    [Authorize]
    [HttpPost("address")]

    public async Task<ActionResult<Address>> CreateOrUpdateAddress(AddressDto addressDto)
    {
        var user = await signInManager.UserManager.GetUserByEmailWithAddress(User);

        if (user.Address == null)
        {
            user.Address = addressDto.ToEntity(); //converts Dtoformat  to entity so that it can save to db
        }
        else
        {
            user.Address.UpdateFromDto(addressDto); //here updating the entity
        }


        var result = await signInManager.UserManager.UpdateAsync(user); //now updating the db

        if (!result.Succeeded) return BadRequest("Problem updating user address");

        return Ok(user.Address.ToDto());

    } 

}
