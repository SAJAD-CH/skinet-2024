import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
    returnUrl = '/shop'

 
  constructor(private fb:FormBuilder,public accountService:AccountService,
    private router:Router,private activatedRoute:ActivatedRoute){

    this.loginForm=this.fb.group({
    email:[''],
    password:['']
  })

  const url = this.activatedRoute.snapshot.queryParams['returnUrl']
  console.log("url",url);
  
  if(url) this.returnUrl =url;

  }



  onSubmit(){
    this.accountService.login(this.loginForm.value)
    .subscribe((res)=>{
      this.accountService.getUserInfo().subscribe();
      this.router.navigateByUrl(this.returnUrl)
    })
  }

  
}  
