import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { routes } from '../../app.routes';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router) //sada constil route import aakunna pole thanne
  const snackbar = inject(SnackbarService)
  return next(req).pipe( //returning req from here
    catchError((err:HttpErrorResponse)=>{
      if(err.status === 400){ //400 validation error anne and aa validation errors ore list of object aaytanne veral athine loop aaki componentilekk throw cheyyum 
        if(err.error.errors){
          const modelStateErrors = []
          for(const key in err.error.errors){
            if(err.error.errors[key]){
              modelStateErrors.push(err.error.errors[key])
            }
          }
          throw modelStateErrors.flat();
        }
      }else{
        // snackbar.error(err.error.title || err.error)
      }
      if(err.status === 401){
         snackbar.error(err.error.title || err.error)
      }
       if(err.status === 404){
        router.navigateByUrl('/not-found')
      }
       if(err.status === 500){
        const navigationExtras : NavigationExtras ={state:{error:err.error}}
        router.navigateByUrl('/server-error',navigationExtras)
      }
      return throwError(()=> err) //now we need to config this in app.config
    })
  )
};
