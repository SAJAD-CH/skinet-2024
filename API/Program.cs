using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<IProductRepository, ProductRepository>(); //IproductRepository call aakumbol ProductRepository anne work aakal
builder.Services.AddScoped(typeof(IGenericRepository<>),typeof(GenericRepository<>)); //Generic repo aayad konnd eede type aanne parayan patilla so

var app = builder.Build();

app.MapControllers();

//ee try catch use aakunnad seed data dbyilekk add aakan(seed data product.json)
try
{
    //storecontext Depedency injection illathe work aakan annu scope use aakunnad then database migrate aakum then databaseielkk 
    //seeddata add cheyyum (simple aayt ingane manssilakyadi)
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<StoreContext>();
    await context.Database.MigrateAsync(); //migrate cheyyan baaki ullad migrate aakum and dbye illenki new db create aakum
    await StoreContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
    Console.WriteLine(ex);
    throw;
}

app.Run();
