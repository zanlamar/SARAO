import { Component, inject, OnInit } from '@angular/core';
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
export class Header implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  isHome = false;
  isCreateEvent = false;
  isCalendarView = false;
  isEventPreview = false;
  isShareableUrl = false;
  isUserArea = false;
  isMemento = false;

  username = 'Pendón';
  constructor() {
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
      // this.isHome = this.router.url === '/home';
      this.isCreateEvent = this.router.url.startsWith('/create');
      this.isCalendarView = this.router.url === '/calendar-view';
      this.isEventPreview = this.router.url.startsWith('/event-preview');
      this.isShareableUrl = this.router.url.startsWith('/shareable-url');
      this.isUserArea = this.router.url.startsWith('/user-area');
      this.isMemento = this.router.url.startsWith('/memento');
    }
    onLogout() {
      this.authService.logout();
    }
  }

