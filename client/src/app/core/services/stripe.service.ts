import { Injectable } from '@angular/core';
import {ConfirmationToken, loadStripe, Stripe, StripeAddressElement, StripeAddressElementOptions, StripeElements, StripePaymentElement} from '@stripe/stripe-js'
import { environment } from '../../../environments/environment';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../../shared/Models/cart';
import { firstValueFrom, map } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  baseUrl = environment.apiUrl;
  private stripePromise : Promise<Stripe | null>
  private elements? : StripeElements
//Think of StripeElements as the card input UI that Stripe gives you.
//Example: the little box where the customer types their card number, expiry, CVC. 
//think of it like stripe nammakk provide cheyunna ore UI 

  private addressElements?:StripeAddressElement//stripe provide cheyunna ore UI polthe ore variable 

  private paymentElement?:StripePaymentElement

  constructor(public cartService:CartService,public http : HttpClient,public accountService:AccountService){
    this.stripePromise = loadStripe(environment.stripePublicKey) //public key vech stripe create aakum
  }

  getStripeInstance(){
    return this.stripePromise //ore new stripe instance create aakum
  }

  async initializeElements(){//Elements are UI components provided by Stripe (Card input, Address input, etc.).

    //why we are using elements
    // User goes to checkout page → initializeElements() runs → creates the card input UI once.
    // User leaves the page and comes back → initializeElements() just returns the existing UI instead of creating a new one.
    if(!this.elements){
      const stripe = await this.getStripeInstance();
      if(stripe){
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent());//latest cleintsecret edthit elementsinte ullil vekkum
        this.elements = stripe.elements(
          { clientSecret:cart.clientSecret,appearance:{labels:'floating'}}
        )
      }else {
        throw new Error ('Stripe has not been loaded yet')
      }
    }
    return this.elements;
  }


  async createPaymentElement(){
    if(!this.paymentElement){
      const elements = await this.initializeElements();
    }
    if(this.elements){
      this.paymentElement=this.elements.create('payment');

    }else {
      throw new Error('Elements instance has not been initialized')
    }

    return this.paymentElement;

  }

  async createAddressElement(){
    //ivde sambavikunnad adyam shipping address input vazhi ivde address create aakinonne nokkum 
    //then illenki initializeelemnt vazhi new stripe ui(with clientsecret) set aakum and ennit 
    //stripenod ore shipping form theran parayum which includes field like country,city,fullname etc (nammakk angularil ore form create aakenda)
    //then aa fieldine adddresselementsilekk add aakum
    if(!this.addressElements){
      const elements = await this.initializeElements();
      if(elements){
        const user = this.accountService.currentUser();
        let defaultValues : StripeAddressElementOptions['defaultValues']={} //This is an object to store pre-filled data for Stripe’s AddressElement.
       // singalile useraddress ivde set aakum
        if(user){
          defaultValues.name = user.firstName + '' + user.lastName
        }

        if(user?.address){
          defaultValues.address = {
            line1:user.address.line1,
            line2:user.address.line2,
            city:user.address.city,
            state:user.address.state,
            country:user.address.country,
            postal_code:user.address.postalCode
          }
        }

        const options : StripeAddressElementOptions = {
          mode : 'shipping',
          defaultValues//prefilling the stripe form with currentuser data
        };
        this.addressElements =elements.create('address',options)
      }else {
        throw new Error('Elements instance has not been loaded')
      }
    }
    return this.addressElements;
  }

    async createConfirmationToken(){ //nammale payment cheyyumbo ee card detailsokke backendilekk ayakkennam ith ore token pole(like envelope) ennale PCI compliance risk ozhivakullu
      const stripe = await this.getStripeInstance();
      const elements = await this.initializeElements();
      const result = await elements.submit()//(checks if card number is valid, required fields are filled).
      if(result.error) throw new Error(result.error.message)
       if(stripe){
        return await stripe.createConfirmationToken({elements})//ith villikumbo card deatailsokke raw ayt ayakunnadine pakaram ore token pole ayakkum
       } else{
        throw new Error('Stripe not available')
       }
        //In simple words:
        // 👉 The confirmation token is like a sealed envelope with the customer’s payment details.
        // 👉 You pass the envelope to your backend → Stripe opens it → payment is confirmed.
        // 👉 You never directly touch the card number.
    }




    async confirmPayment(confirmationToken:ConfirmationToken){
      const stripe = await this.getStripeInstance();
      const elements = await this.initializeElements();
      const result = await elements.submit()//make sure eveyrthing is validated
      if(result.error) throw new Error(result.error.message)

      const clientSecret = this.cartService.cart()?.clientSecret  
      if(stripe && clientSecret){
        return await stripe.confirmPayment({
          clientSecret:clientSecret,
          confirmParams:{
            confirmation_token:confirmationToken.id
          },
          redirect:'if_required'
        })//ivde clientum stripe serverum thammimlulla communcation annu no api involved
        // Calls Stripe’s confirmPayment → combines the clientSecret (server-side PaymentIntent) + confirmationToken (client-side card + address details).
      }else {
        throw new Error('Unable to load stripe')
      }

    }



  createOrUpdatePaymentIntent(){

    const cart = this.cartService.cart();
    if(!cart) throw new Error('Problem with cart')
    return this.http.post<Cart>(this.baseUrl + 'payments/' + cart.id,{}).pipe(
      map(cart => {
        this.cartService.setCart(cart);
        return cart;
      })
    )
  }

  disposeElements(){//checkout akumbo ithokke discard akennam
    this.elements=undefined,
    this.addressElements=undefined
    this.paymentElement = undefined
  }
  
}
