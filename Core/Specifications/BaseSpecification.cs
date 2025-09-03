using System;
using System.Linq.Expressions;
using Core.Interfaces;

namespace Core.Specifications;

public class BaseSpecification<T>(Expression<Func<T, bool>>? criteria) : ISpecification<T>
{

    protected BaseSpecification() : this(null) { } //empty constructor sometimes needed
    public Expression<Func<T, bool>>? Criteria => criteria; //aa rule criteriane ithile Criteriay ilekk store aaki eny ith evaluatorilekk vlkum

    public Expression<Func<T, object>>? OrderBy { get; private set; }

    public Expression<Func<T, object>>? OrderByDescending { get; private set; }

    public bool IsDistinct { get; private set; }

    public int Take { get; private set; }

    public int Skip { get; private set; }

    public bool IsPagingEnabled { get; private set; }

    public IQueryable<T> ApplyCriteria(IQueryable<T> query)
    {
        if (Criteria != null)
        {
            query = query.Where(Criteria);
        }

        return query;
    }

    protected void AddOrderBy(Expression<Func<T, Object>> OrderByExpression)// (x=>x.Price contructoril verunnad )
    {
        OrderBy = OrderByExpression; // thirich pokunnad 'OrderBy = x=> x.Price'
    }


    protected void AddOrderByDescending(Expression<Func<T, Object>> OrderByDescExpression)
    {
        OrderByDescending = OrderByDescExpression;  // thirich pokunnad 'OrderByDescending = x=> x.Price' 
    }

    protected void ApplyDistinct()
    {
        IsDistinct = true;
    }


    protected void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }



}

public class BaseSpecification<T, Tresult>(Expression<Func<T, bool>> criteria)
: BaseSpecification<T>(criteria), ISpecification<T, Tresult> //criteria is filtering rule so in this also it still needed 
{

    protected BaseSpecification() : this(null!) { } //empty constructor sometimes needed
    public Expression<Func<T, Tresult>>? Select { get; private set; }//it holds the projection expression (x=>x.Brand)

    protected void AddSelect(Expression<Func<T, Tresult>> selectExpression)
    {
        Select = selectExpression;
    }
}