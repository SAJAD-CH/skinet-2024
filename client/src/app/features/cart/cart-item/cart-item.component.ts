import { Component, input } from '@angular/core';
import { CartItem } from '../../../shared/Models/cart';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    CurrencyPipe
],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {

  item= input.required<CartItem>();//signalinte input ivde kittan from parent component 

  constructor (public cartService : CartService){}

  
  incrementQuantity(){
    this.cartService.addItemToCart(this.item())
  }

  decrementQuantity(){
    this.cartService.removeItemFromCart(this.item().productId)
  }

  removeItemFromCart(){
     this.cartService.removeItemFromCart(this.item().productId,this.item().quantity) //ore itemsinte full quantity pass aakyal aa item thanne remove aakum 
  }

  



}
