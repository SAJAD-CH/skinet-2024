import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { JsonPipe } from '@angular/common';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    JsonPipe,
    MatError,
    TextInputComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm: FormGroup;
  validationErrors?:string[];

  constructor(private fb:FormBuilder,public accountService:AccountService,private router:Router,
    private snack:SnackbarService
  ){

    this.registerForm=this.fb.group({
    firstName:['',Validators.required],
    lastName:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    password:['',Validators.required]
  })

  }

  onSubmit(){

    this.accountService.register(this.registerForm.value)
    .subscribe((res)=>{
      this.snack.success("Registration successfull - you can now login")
      this.router.navigateByUrl('/account/login')
      
    },
      (err) => {
        this.validationErrors = err
        console.log(this.validationErrors);
        
      })

  }

}
