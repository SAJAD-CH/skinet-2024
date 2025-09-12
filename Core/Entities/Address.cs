using System;

namespace Core.Entities;

public class Address : BaseEntity//for shipping address , ith identitynte bagam alla so baseentity use aakunne
{
    public required string? Line1 { get; set; }

    public string? Line2 { get; set; }

    public required string? City { get; set; }

    public required string? State { get; set; }
    public required string? PostalCode { get; set; }
    public required string? Country { get; set; }
}
