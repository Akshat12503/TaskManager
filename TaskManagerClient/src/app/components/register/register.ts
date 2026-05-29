import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html' // Changed from ./register.component.html
})
export class RegisterComponent {
  user = { username: '', password: '' };
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (!this.user.username || !this.user.password) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error || 'Registration failed. Try again.';
      }
    });
  }
}