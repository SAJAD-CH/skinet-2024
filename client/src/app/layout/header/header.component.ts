import { Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon'
import {MatButton} from '@angular/material/button'
import {MatBadge} from '@angular/material/badge'
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import {MatProgressBar} from '@angular/material/progress-bar'
import { CartService } from '../../core/services/cart.service';
import { AccountService } from '../../core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatButton,
    MatBadge,
    RouterLink,
    RouterLinkActive,
    MatProgressBar,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatMenuItem
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(public busyService:BusyService,public cartService:CartService,
    public accountService:AccountService,public router:Router){}

    logout(){
      this.accountService.logout()
      .subscribe((res)=>{
        this.accountService.currentUser.set(null)
        this.router.navigateByUrl('/')
      })
    }

}
