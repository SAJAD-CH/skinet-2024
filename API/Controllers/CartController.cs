using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CartController(IcartService cartService) : BaseApiController
{

    [HttpGet]
    public async Task<ActionResult<ShoppingCart>> GetCartById(string id)
    {
        var cart = await cartService.GetCartAsync(id);

        return Ok(cart ?? new ShoppingCart { Id = id }); //dbyil edukkan vanna cart details illenki null anennki new id ivdanne create aakum then ath frontilekk kodkum then aa cartId vechayrkum pinne client sidil update nadathal
    }

    [HttpPost]

    public async Task<ActionResult<ShoppingCart>> UpdateCart(ShoppingCart cart)
    {
        var updatedCart = await cartService.SetCartAsycn(cart);
        if (updatedCart == null) return BadRequest("Problem with cart");

        return updatedCart;
    }

    [HttpDelete]

    public async Task<ActionResult> DeleteCart(string id)
    {
        var result = await cartService.DeleteCartAsync(id);

        if (!result) return BadRequest("Problem deleting cart");

        return Ok();
    }



}
