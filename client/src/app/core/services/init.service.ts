import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, of } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(private cartService:CartService,private accountService:AccountService){}

  init(){
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId):of(null)


    return forkJoin({
      cart: cart$,
      user : this.accountService.getUserInfo()
    })
  }

  //flow
  //ithine app.configil call aakunnunnd avdanne app load aakunnadine munne thanne ivdekk call verum getcartum getuserinfoyum vech 2 signalsum load aakum then only angular load aakullu 

  // On app refresh, Angular immediately re-fetches user info from cookie and cart from localStorage.
  
}