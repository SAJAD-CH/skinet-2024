using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class PaymentService(IConfiguration config, IcartService cartService, IGenericRepository<Core.Entities.Product> productRepo,
IGenericRepository<DeliveryMethod> dmRepo) : IPaymentService
{
    //config use akunnad strip details edkan
    //cartile detaisline carstservice
    //productrepo actual price of the products 
    //dmRepo delviery method price edkan
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];//read the stripesecret key from config file

        var cart = await cartService.GetCartAsync(cartId); //cartilne annello checkout adikunnad appo aa cartinte detailsokke ivde kittan use aakunnad

        if (cart == null) return null;

        var shippingPrice = 0m;
        if (cart.DeliveryMethodId.HasValue) //If the user picked a delivery option, get its price. (for example: Standard Delivery, Express Delivery, Free Shipping, etc.).
        {
            var deliveryMethod = await dmRepo.GetIdByAsync((int)cart.DeliveryMethodId);//id vech aa deliveydetails edkum

            if (deliveryMethod == null) return null;

            shippingPrice = deliveryMethod.Price; //delivery detailsilne shipping price set aakum

        }

        foreach (var item in cart.Items)
        {
            //frontil cart cheyda items loop cheyyum ennit dbyile latest aa productinte detialsum edkum then cartile priceum dbyil ippo ulla priceum correct anno nokkum
            //chlpo pandee cart cheyd vechadananeki dbyile data update aytundakum so ath thettannel laetst price cartile datakk add aakum 
            var productItem = await productRepo.GetIdByAsync(item.ProductId);
            if (productItem == null) return null;

            if (item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            }
        }

       //then paymentintetn create aakum then athilekk cartamountokke calcualte akum ennit intendid and cliensecret paymentintetn create aakum
        var service = new PaymentIntentService();
        PaymentIntent? intent = null;

        if (string.IsNullOrEmpty(cart.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) + (long)shippingPrice * 100,
                Currency = "usd", 
                PaymentMethodTypes = ["card"]
            };//Calculates total amount (product prices × qty + shipping).
            intent = await service.CreateAsync(options);//Calls Stripe → creates a PaymentIntent.
            cart.PaymentIntentId = intent.Id;
            cart.ClientSecret = intent.ClientSecret; //Saves intent.Id + client_secret into cart → will be sent to Angular.
        }
        else
        {
            // Example:
            // Yesterday, the user added items and checkout started.
            // Stripe created a PaymentIntent with Amount = $100.
            // Today, user changes cart (Qty, removes items, adds shipping).
            // Instead of creating a new PaymentIntent, we just update the existing one.
            //While updating paymentintentid should be same otherwise new paymentintent will be created
            var options = new PaymentIntentUpdateOptions
            {
                Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) + (long)shippingPrice * 100
            };
            intent = await service.UpdateAsync(cart.PaymentIntentId, options);//If user updated cart (changed qty, shipping, etc.), update existing PaymentIntent amount  instead of making a new one.
        }

        await cartService.SetCartAsycn(cart); //intentidyum clientserviceokke vech cart pneyum set aakum 
        return cart;

       
    }
}
