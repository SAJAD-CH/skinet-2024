import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { HttpClient } from '@angular/common/http';
import { Product } from './shared/Models/product';
import { Pagination } from './shared/Models/pagination';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

   baseUrl = 'http://localhost:5000/api/'

   title = 'skinet';

   products:Product[]=[] //Product works like interface backilne verunna data pole set aakyad 

   constructor(private http:HttpClient){
   }


  ngOnInit(): void {
    this.http.get<Pagination<Product>>(this.baseUrl + 'products')
    .subscribe((res)=>{
      console.log("ress",res.data);

      this.products = res.data
      console.log("produ",this.products);
      
      
      //////////////////////////////////////////as instructor we can do by this method also/////////////////////////////

      // next:reponse => this.products = reponse.data,  //next use aakuunnad data vannal next eny ende use aakendad nokkan
      // error:erroe => console.log(error);
      // complete:()=> console.log(('complete'));
      
      
      
    })
  }
}
