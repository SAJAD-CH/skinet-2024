import { Injectable } from '@angular/core';
import { Product } from '../../shared/Models/product';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../../shared/Models/pagination';
import { shopParams } from '../../shared/Models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

   baseUrl = 'http://localhost:5000/api/'

   types: string[] = []
   brands: string[] = []

   products:Product[]=[] //Product works like interface backilne verunna data pole set aakyad 

   constructor(private http:HttpClient){
   }


   getProducts(shopParams:shopParams){
    let params = new HttpParams();

    if(shopParams.brands.length>0){
      params = params.append('brands',shopParams.brands.join(','))
    }

      if(shopParams.types.length>0){
      params = params.append('types',shopParams.types.join(','))
    }

    params= params.append('pageSize',shopParams.pageSize)
    params= params.append('pageIndex',shopParams.pageNumber)

    if(shopParams.sort){
      params = params.append('sort',shopParams.sort)
    }


    if(shopParams.search){
      params = params.append('search',shopParams.search)
    }


    return this.http.get<Pagination<Product>>(this.baseUrl + 'products',{params})
   }

   getBrands(){
    if(this.brands.length>0) return
    return this.http.get<string[]>(this.baseUrl + 'products/brands')
     .subscribe((res)=>{
      this.brands=res;
    })
   }

   
   getTypes(){
    if(this.types.length>0) return
    return this.http.get<string[]>(this.baseUrl + 'products/types')
     .subscribe((res)=>{
      this.types=res;
    })
   }

   getProduct(id:number){
    return this.http.get<Product>(this.baseUrl + 'products/' + id)
   }

   




  
}
