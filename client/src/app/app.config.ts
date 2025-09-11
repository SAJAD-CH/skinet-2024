import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { InitService } from './core/services/init.service';
import { lastValueFrom } from 'rxjs';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor,loadingInterceptor])),
    provideAppInitializer(async ()=>{ // ith angular load akunnadine munne thanne localstoregilne cart_id edthit vanne cart load aakan use akunnad 
      const initService = inject(InitService);
      return lastValueFrom(initService.init()).finally(()=>{
    const splash = document.getElementById('initial-splash');
    if(splash){
      splash.remove();
    }
      //The Flow in Simple Terms
      // User adds items → cart stored in Redis (backend) + cart_id stored in localStorage (frontend).
      // User refreshes → Angular loses signal memory.
      // App Initializer runs:
      // Reads cart_id from localStorage.
      // Calls backend → fetch cart with items.
      // Sets the signal again (cart.set(cartFromApi)).
      // Splash removed → app loads with the same cart as before.
  })
    }),
    {
      provide:MAT_DIALOG_DEFAULT_OPTIONS,
      useValue:{autFocus:'dialog',restoreFocus:true}
    }
  ]
};
