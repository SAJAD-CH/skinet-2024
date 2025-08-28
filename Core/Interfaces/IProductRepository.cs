using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IProductRepository
{

    //dbyilne response kittunna functionsokke Task added aakitund for async 
    Task<IReadOnlyList<Product>> GetProductsAsync(string? brand, string? type, string? sort); //<Product> udeshikunnad dbyilne return kittendad product annu enna 

    Task<Product?> GetProductByIdAsync(int id);

    Task<IReadOnlyList<string>> GetBrandAsync();

    Task<IReadOnlyList<string>> GetTypesAsync();



    void AddProduct(Product product);

    void UpdateProduct(Product product);

    void DeleteProduct(Product product);

    bool ProductExists(int id);

    Task<bool> SaveChangesAsycn();
    
}
