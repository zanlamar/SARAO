import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
@Component({
  selector: 'app-landingPage',
  imports: [RouterLink, Footer],
  templateUrl: './landingPage.html',
  styleUrl: './landingPage.css',
})
export class landingPage {
}

