using System;
using System.Security.Authentication;
using System.Security.Claims;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{

    //Flow--
    //Every logged-in user in ASP.NET Core is represented as a ClaimsPrincipal.
    //It contains the claims (like Email, Id, Name) that were issued when the user logged in.
    // Takes in:
    // UserManager<AppUser> (Identity service that manages users).
    // ClaimsPrincipal user (the logged-in user from HttpContext.User).
    // Calls user.GetEmail() (the extension method below).
    // Looks up the user in the DB by that email.
    // Returns the AppUser entity from database.
    public static async Task<AppUser> GetUserByEmail(this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        var userToReturn = await userManager.Users.FirstOrDefaultAsync(x => x.Email == user.GetEmail());

        if (userToReturn == null) throw new AuthenticationException("User not found");

        return userToReturn;
    }

    public static string GetEmail(this ClaimsPrincipal user)
    {
        var email = user.FindFirstValue(ClaimTypes.Email) ?? throw new AuthenticationException("Email claim not found");
        return email;
    }

    public static async Task<AppUser> GetUserByEmailWithAddress(this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        //ivde user details mathralla addressum koodi pass aakunne 
        var userToReturn = await userManager.Users.Include(x => x.Address).FirstOrDefaultAsync(x => x.Email == user.GetEmail());

        if (userToReturn == null) throw new AuthenticationException("User not found");

        return userToReturn;
    }


}

