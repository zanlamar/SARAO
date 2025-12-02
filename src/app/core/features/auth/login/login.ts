import { Component, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
})
export class Login {
  email = '';
  password = '';
  errorMessage = signal('');
  loading = signal(false);
  constructor(
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
  ) {}
  async onLogin() {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      const result = await this.authService.login(this.email, this.password);
      if (result.success) {
        await this.authService.waitForAuthentication();
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        
      if (returnUrl && returnUrl !== '/login' && returnUrl !== '/register') {
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigate(['/calendar-view']);
        }
      } else {
        this.errorMessage.set('Invalid password or email');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage.set('Invalid password or email');
    } finally {
      this.loading.set(false);
    }
  }
}
