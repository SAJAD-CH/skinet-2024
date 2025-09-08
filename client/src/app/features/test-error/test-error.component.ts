import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-test-error',
  imports: [
    MatButton
  ],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss'
})
export class TestErrorComponent {

  baseUrl = 'http://localhost:5000/api/'

  constructor(private http:HttpClient){}
  validationErrors?:string[]=[]

  get404Error(){
    this.http.get(this.baseUrl + 'buggy/notfound')
    .subscribe((res)=>{
      console.log(res);
      
    },
      (err) => {//ivdanne nere interceptorilot pokum
        console.error(err);
      })
  }
  
  get400Error(){
    this.http.get(this.baseUrl + 'buggy/badrequest')
    .subscribe((res)=>{
      console.log(res);
      
    },
      (err) => {
        console.error(err);
      })
  }
  
  get401Error(){
    this.http.get(this.baseUrl + 'buggy/unauthorized')
    .subscribe((res)=>{
      console.log(res);
      
    },
      (err) => {
        console.error(err);
      })
  }
  
  get500Error(){
    this.http.get(this.baseUrl + 'buggy/internalerror')
    .subscribe((res)=>{
      console.log(res);
      
    },
      (err) => {
        console.error(err);
      })
  }

   get400ValidationError(){
    this.http.post(this.baseUrl + 'buggy/validationerror', {})
    .subscribe((res)=>{
      console.log(res);
      
    },
      (err) => {
        this.validationErrors=err
       
      })
  }


}
