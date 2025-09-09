using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IcartService
{

    Task<ShoppingCart?> GetCartAsync(string key);

    Task<ShoppingCart?> SetCartAsycn(ShoppingCart cart);

    Task<bool> DeleteCartAsync(string key);
}
