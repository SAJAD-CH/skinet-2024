import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService)
  const router = inject(Router)

  //checkout click  akumbol currenuser illenki (loggedin allenki) login pageilekk pokum

  if (accountService.currentUser()) {
    return of(true)
  }
  else {
    return accountService.getAuthState().pipe(
      map(auth => {
        if (auth.isAuthenticated) {
          return true
        } else {
          router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } })
          return false;
        }
      })
    )

  }
  //currentuser undenki logged in aakum and crct work aakum else caseil ippo pagerefresh aaki udane thanne checkuser null aakum ennitanne init work aay checkuser data set akunnad 
  //but init work aakunnadine munne thanne authguard work aakum and appo else caseile ethy cookie undonne nokkum...refresh case alle 
  //appo cookie undakum then return true and cookieum illenki loginilekk nere aykum

};
