import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule, NavigationEnd, ActivatedRoute   } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-footer',
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  standalone: true,
})
export class Footer {
  router = inject(Router);
  route = inject(ActivatedRoute);

  footerVariant: 'full' | 'minimal' = 'minimal';

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateFooterFromRoute());
    this.updateFooterFromRoute();
  }

  private updateFooterFromRoute() {
    const child = this.route.firstChild;
    const data = child?.snapshot.data || {};

    this.footerVariant = (data['footerVariant'] as 'minimal' | 'full') ?? 'minimal';
  }
}

