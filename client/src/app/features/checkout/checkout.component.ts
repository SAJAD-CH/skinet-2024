import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { ConfirmationToken, loadStripe, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { SnackbarService } from '../../core/services/snackbar.service';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/Models/User';
import { every, firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CartService } from '../../core/services/cart.service';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CurrencyPipe,
    JsonPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit,OnDestroy{

   addressElement?:StripeAddressElement
   paymentElement?:StripePaymentElement
   saveAddress=false
   completionStatus = signal<{address:boolean,card:boolean,delivery:boolean}>(//ith use akunnad nammakk address full completkyal mathre next shippingilekk poikoodu
      {address:false, card:false,delivery:false } 
   )
    
   confirmationToken?:ConfirmationToken
   laoding=false

  constructor(public stripeService:StripeService,private snackbar:SnackbarService,
    public accountService:AccountService,public cartService:CartService,private router:Router
  ){
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handlePaymentChange = this.handlePaymentChange.bind(this)
  }

  async ngOnInit(){
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element')
      this.addressElement.on('change',this.handleAddressChange)//addresselementil change undakumbo handleaddreschange call aakum

      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element')
      this.paymentElement.on('change',this.handlePaymentChange)
    } catch (error:any) {
      this.snackbar.error(error.message);
    }
  }

  handleAddressChange(event:StripeAddressElementChangeEvent){
    this.completionStatus.update(state =>{
      state.address = event.complete
      return state;
    })

  }

   handlePaymentChange(event:StripePaymentElementChangeEvent){
    this.completionStatus.update(state =>{
      state.card = event.complete
      return state;
    })

  }

  handleDeliveryChange(event:boolean){
    this.completionStatus.update(state =>{
      state.delivery=event
      return state
    })
  }

  async getConfirmationToken(){//onnuilla just ore token undakumbo card detailsokke backilekk pass aakan...instead of raw datas
    try {
      if(Object.values(this.completionStatus()).every(status => status === true)){//checkoutile each stepum complete anno checking(card,delivery,address)
        const result = await this.stripeService.createConfirmationToken();
        if(result.error) throw new Error (result.error.message)
        this.confirmationToken = result.confirmationToken
        console.log(this.confirmationToken);//eny ithine parentToChild vazhi pass aakennam
        
      }
    } catch (error:any) {
      this.snackbar.error(error.message)
      
    }
  }


  async  onStepChange(event:StepperSelectionEvent){
    if(event.selectedIndex ===1){ //next click aakyal 
      if(this.saveAddress){
        const address =await this.getAddressFromStripeAddress()//stripilne address edkum
        address && firstValueFrom(this.accountService.updateAddress(address))//backilekk address update aakum
      }
    }

    if(event.selectedIndex ===2){ //shipping tab
       await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent())//deliveryId koodi pass aakum
    }

    if(event.selectedIndex ===3){
      this.getConfirmationToken()
    }
  }

  async confirmPayment(stepper:MatStepper){
    this.laoding=true
    try {

      if(this.confirmationToken){
        const result  = await this.stripeService.confirmPayment(this.confirmationToken)
        if(result.error){
          throw new Error(result.error.message)
        }else {
          this.cartService.deleteCart()
          this.cartService.selectedDelivery.set(null)
          this.router.navigateByUrl('/checkout/success')

        }
      }
      
    } catch (error:any) {
        this.snackbar.error(error.message || 'Something went wrong')
        stepper.previous();
        //insufficient balancokke ulla card annel card insert akya pageilekk thanne redirect aakum
    } finally {
      this.laoding=false
    }

  }




 private async getAddressFromStripeAddress() : Promise< Address | null>{
  //nammale shippingil add cheyunna address dbyil save aakan vendi set aakum

  const result = await this.addressElement?.getValue();
  const address = result?.value.address

  if(address){
    return{
      line1 :address.line1,
      line2:address.line2 || undefined,
      city:address.city,
      country:address.country,
      state:address.state,
      postalCode:address.postal_code
    }
  } else 
    return null;
  
  }

  onSaveAddressCheckboxChange(event:MatCheckboxChange){
    this.saveAddress=event.checked;
  }

  ngOnDestroy(): void {
    //ngOnDestroy() is called automatically by Angular when the component is removed from the DOM.
    this.stripeService.disposeElements()
  }
 

}
