using System;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities;

public class AppUser : IdentityUser
{
    public string? FirstName { get; set; }

    public string? LastName { get; set; }
    //identityuser inbuilt aayad konnd ith 2um allathe enyum koree inbuilt aayt email,passwordokke unde athinte koode firstname lastname  kootinne ullu

    public Address? Address { get; set; }
}
