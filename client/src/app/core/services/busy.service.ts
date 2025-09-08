import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  loading = false
  busyRequestCount = 0

  busy(){
    this.busyRequestCount++ //2 or 3 apis ithine villichal annu busyrequest koodi verunnad 
    this.loading=true
  }

  idle(){
    this.busyRequestCount--
    if(this.busyRequestCount<=0){
      this.busyRequestCount=0
      this.loading=false
    }
  }
  
}
