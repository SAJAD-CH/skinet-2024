using System;
using Core.Entities;

namespace Core.Specifications;

public class BrandListSpecification : BaseSpecification<Product,string>
{
    public BrandListSpecification()
    {
        AddSelect(X => X.Brand);
        ApplyDistinct();
    }
}
