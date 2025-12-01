import { Component, inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd, ActivatedRoute } from '@angular/router';
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
  route = inject(ActivatedRoute);
  
  headerMode: 'landing' | 'auth' | 'main' = 'landing';
  variant: 'landing' | 'compact' = 'compact';
  
  constructor() {
    this.router.events 
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateFromRoute());
      this.updateFromRoute();
  }

  private updateFromRoute() {
    const child = this.route.firstChild;
    const data = child?.snapshot.data || {};

    this.variant = (data['headerVariant'] as 'landing' | 'compact') ?? 'compact';
    this.headerMode = (data['headerMode'] as 'landing' | 'auth' | 'main') ?? 'landing';
  }

  onLogout() {
    this.authService.logout();
  }
}
