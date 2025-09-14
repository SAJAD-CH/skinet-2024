import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const clonedRequest = req.clone({
    withCredentials:true
  })
  return next(clonedRequest);
};

//api call ith vazhi anne backilekk pokale so ivdanne withcredentials koode set aakit pokum 
//withcredential apiyil poyale nammakk cookie konnd pokan pattullu 
