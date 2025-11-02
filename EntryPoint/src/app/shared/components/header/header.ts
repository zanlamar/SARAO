import { Component, inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class Header {
  authService = inject(AuthService);
  router = inject(Router);

  isHome: boolean = false;
  isCreateEvent: boolean = false;
  username: string = 'Pendón';

   constructor() {
    console.log('Header component initialized'); 
  }

  ngOnInit(): void {
    this.checkRoute();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute();
      });
  }

  private checkRoute() {
    this.isHome = this.router.url === '/home';
    this.isCreateEvent = this.router.url === '/create'; 
  }

  onLogout() {
    this.authService.logout();
  }
}
