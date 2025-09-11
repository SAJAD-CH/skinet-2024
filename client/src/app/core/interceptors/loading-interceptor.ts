import { HttpInterceptorFn } from '@angular/common/http';
import { delay, finalize } from 'rxjs';
import { BusyService } from '../services/busy.service';
import { inject } from '@angular/core';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService)

  busyService.busy()

  return next(req).pipe(  //api response delay aakunnad for testing the loading cases(internetil ittal latenceyokke nokkan)
    // delay(500),
    finalize(()=>busyService.idle())
  );
};
