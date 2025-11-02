import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  username: string = 'Pendón';

  constructor(private router: Router) {}

  ngOnInit(): void {

  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}