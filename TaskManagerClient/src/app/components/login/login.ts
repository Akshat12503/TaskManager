import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html' // Changed from ./login.component.html
})
export class LoginComponent {
  user = { username: '', password: '' };
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.user.username || !this.user.password) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']); // We will create this next
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error || 'Invalid credentials.';
      }
    });
  }
}