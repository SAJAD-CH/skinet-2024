import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, User } from '../../shared/Models/User';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;

  constructor(public http:HttpClient){}

  currentUser = signal<User | null>(null);
// full flow 
// register cheyyumbo username,password,email ithokke kodkum appo avde ore idyum generate aakum and then 
// login chyyumbol username and password crct anno nokkum and annel thirich frontilekk cookielude with the help of claimsprinciple id,mail,hashed password kodkum and 
// ath vechanne userinfo enna api veendum backendilekk verale ...cookie illenki reject aakum undenki ath base cheyd user details edth verum

  login(values:any){
    let params = new HttpParams();
    params = params.append('useCookies',true)
    return this.http.post<User>(this.baseUrl + 'login',values ,{params })
    // withCredentials:true kodthale backendilne response kittu
  }

  register(values:any){
    return this.http.post(this.baseUrl+'account/register',values)
  }

  getUserInfo(){
    return this.http.get<User>(this.baseUrl + 'account/user-info' , )
   .pipe(
      map(user =>{
        this.currentUser.set(user)
        return user;
      })//pipe  use aakunnad raw aay verunna datane map aakan 
    )
    // .subscribe((res)=>{
    //   this.currentUser.set(res)
    // })
  }

  logout(){
    return this.http.post(this.baseUrl + 'account/logout',{})
  }

  updateAddress(address : Address){
      return this.http.post(this.baseUrl + 'account/address', address).pipe(
        tap(()=>{
          this.currentUser.update(user => { //ivde nammall pass cheyunna address thanne signalil update akunne
            if(user) user.address = address;
            return user;
          })
        })
      )
  }

  getAuthState(){
    return this.http.get<{isAuthenticated:boolean}>(this.baseUrl + 'account/auth-status')
  }
  
}
