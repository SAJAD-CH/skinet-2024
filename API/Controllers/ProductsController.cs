using System;
using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace API.Controllers;



public class ProductsController(IGenericRepository<Product> repo) : BaseApiController
{


    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts([FromQuery] ProductSpecParams specParams)
    {
        var spec = new ProductSpecification(specParams);
        // This calls ProductSpecification constructor.

        // That constructor passes the filtering condition to BaseSpecification.

        //old method
        // var products = await repo.ListAsync(spec);
        // var count = await repo.CountAsync(spec);
        // var pagination = new Pagination<Product>(specParams.PageIndex, specParams.PageSize, count, products);
        // return Ok(pagination); //ok use aakunnad return kittunna list  200 response and object aaki forntielkk kodkan

        //newmethod after creting baseapicontroller
        return await CreatePagedResult(repo, spec, specParams.PageIndex, specParams.PageIndex);

    }

    [HttpGet("{id:int}")] //api/products/id

    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await repo.GetIdByAsync(id);

        if (product == null) return NotFound();

        return product;

    }

    [HttpPost]

    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        repo.Add(product);

        if (await repo.SaveAllAsync())
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

        repo.Update(product);

        if (await repo.SaveAllAsync())
        {
            return NoContent();
        }

        return BadRequest("Problem updating the product");

    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {

        var product = await repo.GetIdByAsync(id);

        if (product == null) return NotFound();

        repo.Remove(product);

        if (await repo.SaveAllAsync())
        {
            return NoContent();
        }

        return BadRequest("Problem deleting the product");
        
    }

    [HttpGet("brands")]

    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        var spec = new BrandListSpecification();

        return Ok(await repo.ListAsync(spec));
    }

    [HttpGet("types")]

    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        var spec = new TypeListSpecification();

        return Ok(await repo.ListAsync(spec));

    }
    private bool ProductExists(int id)//just to check the product exists
    {
        return repo.Exists(id);
    }
    
}