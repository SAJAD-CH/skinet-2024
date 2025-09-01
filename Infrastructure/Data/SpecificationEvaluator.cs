using System;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class SpecificationEvaluator<T> where T : BaseEntity
{

    public static IQueryable<T> GetQuery(IQueryable<T> query, ISpecification<T> spec)
    {
        if (spec.Criteria != null)//baseSpecificationil vecha Criteriane ivde vlkunnad
        {
            query = query.Where(spec.Criteria); //x =>x.Brand ==brand
        }

        if (spec.OrderBy != null)
        {
            query = query.OrderBy(spec.OrderBy);
        }

        if (spec.OrderByDescending != null)
        {
            query = query.OrderByDescending(spec.OrderByDescending);
        }

        if (spec.IsDistinct)
        {
            query = query.Distinct();
        }
        return query;
    }
    
    public static IQueryable<TResult> GetQuery<Tspec,TResult>(IQueryable<T> query, ISpecification<T,TResult> spec)
    {
        if (spec.Criteria != null)
        {
            query = query.Where(spec.Criteria); //where Brand = 'Nike'
        }

        if (spec.OrderBy != null)
        {
            query = query.OrderBy(spec.OrderBy);
        }

        if (spec.OrderByDescending != null)
        {
            query = query.OrderByDescending(spec.OrderByDescending);
        }

        var selectQuery = query as IQueryable<TResult>; //means: "If the query is already in the final form (TResult), use it. Otherwise, we’ll apply .Select() later to transform it."

        if (spec.Select != null)
        {
            selectQuery = query.Select(spec.Select);
        }

        if (spec.IsDistinct)
        {
            selectQuery = selectQuery?.Distinct();
        }
          return selectQuery ?? query.Cast<TResult>();
    }
}
