using System;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ProductsController(IProductRepository repo) : ControllerBase
{

   

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts(string? brand, string? type, string? sort)
    {
        return Ok(await repo.GetProductsAsync(brand,type,sort)); //ok use aakunnad return kittunna list  200 response and object aaki forntielkk kodkan
    }

    [HttpGet("{id:int}")] //api/products/id

    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await repo.GetProductByIdAsync(id);

        if (product == null) return NotFound();

        return product;

    }

    [HttpPost]

    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        repo.AddProduct(product);

        if (await repo.SaveChangesAsycn())
        {
            return CreatedAtAction("GetProduct", new { id = product.Id }, product); 
        }
        // ivde nadakunnad nammal ippo product add cheyunnue aa add cheyda product thanne return cheyunnu ,
        //GetProduct aa product return cheyyan and savechangesasync kodtha thanne new Id dbyil create aakum then id = product.Id means 
        //pass cheyyunna id yilekk new product.Id pass aakum innale new creted product kittullu
        // product use aakunnad aa product details return aakan

        return BadRequest("Problem Creating Product");
    }

    [HttpPut("{id:int}")]

    public async Task<ActionResult<Product>> UpdateProduct(int id, Product product)
    {

        if (product.Id != id || !ProductExists(id)) return BadRequest("Cannot update this product");

        repo.UpdateProduct(product);

        if (await repo.SaveChangesAsycn())
        {
            return NoContent();
        }

        return BadRequest("Problem updating the product");

    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {

        var product = await repo.GetProductByIdAsync(id);

        if (product == null) return NotFound();

        repo.DeleteProduct(product);

        if (await repo.SaveChangesAsycn())
        {
            return NoContent();
        }

        return BadRequest("Problem deleting the product");
        
    }

    [HttpGet("brands")]

    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        return Ok(await repo.GetBrandAsync());
        
    }

    [HttpGet("types")]

    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        return Ok(await repo.GetTypesAsync());
    }
    private bool ProductExists(int id)//just to check the product exists
    {
        return repo.ProductExists(id);
    }
    

}
