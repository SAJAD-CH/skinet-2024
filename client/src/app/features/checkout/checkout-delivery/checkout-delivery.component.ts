import { Component, OnInit, output } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout.service';
import {MatRadioModule} from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { DeliveryMethod } from '../../../shared/Models/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  imports: [
    MatRadioModule,
    CurrencyPipe
  ],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent implements OnInit {


  deliveryComplete = output<boolean>();//ivdanne parent component aay checkoutilekk pass aakan use akunnad
  constructor(public checkoutService:CheckoutService,public cartService:CartService){}

  ngOnInit() {
    this.checkoutService.getDeliveryMethods()
    .subscribe((res)=>{
      console.log("method",res);
      if(this.cartService.cart()?.deliveryMethodId){
        const method = res.find(x => x.id === this.cartService.cart()?.deliveryMethodId);
        if(method){
          this.cartService.selectedDelivery.set(method)
          this.deliveryComplete.emit(true)
        }
      }
    });
  }


  updateDeliveryMethod(method:DeliveryMethod){
    this.cartService.selectedDelivery.set(method)//select cheyda deliverymethodine selectedDelivery enna signalilkk set aakki
    const cart =this.cartService.cart(); //cart enna signaline edth vech
    if(cart){
      cart.deliveryMethodId = method.id
      this.cartService.setCart(cart); //cartile deliverymethodid yilekk select cheyda deliverymethodinte id set aaki reedis dbyil store aakum
      this.deliveryComplete.emit(true)
    }
  }



}
