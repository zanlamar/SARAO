import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-footer',
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  standalone: true,
})
export class Footer implements OnInit {
  router = inject(Router);
  isCreateEvent = false;
  isLanding = false;

  ngOnInit(): void {
    this.checkRoute();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute();
      });
  }
  private checkRoute() {
    this.isCreateEvent = this.router.url === '/create';
    this.isLanding = this.router.url === '/';
  }
}

