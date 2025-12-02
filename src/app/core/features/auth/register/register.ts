import { Component, signal, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';  
@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})
export class Register {
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = signal('');
  loading = signal(false);
  constructor(
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
  ) {}
  async onRegister() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('The passwords do not match');
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage.set('The password must be at least 6 characters long');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');

    const result = await this.authService.register(this.email, this.password);
    if (result.success) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];

      if (returnUrl && returnUrl !== '/login' && returnUrl !== '/register') {
        this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigate(['/calendar-view']);
        }
    } else {
      if (result.error?.includes('email-already-in-use')) {
        this.errorMessage.set('That email is already registered.');
      } else if (result.error?.includes('invalid-email')) {
        this.errorMessage.set('The email is invalid.');
      } else if (result.error?.includes('weak-password')) {
        this.errorMessage.set('The password is too weak.');
      } else {
        this.errorMessage.set('Registration error. Please try again');
      }
    }
    this.loading.set(false);
  }
}
