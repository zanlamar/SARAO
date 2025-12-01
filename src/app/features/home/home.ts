import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule} from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  constructor(private router: Router) {}

  onLogout() {
    this.router.navigate(['/login']);
  }
}
