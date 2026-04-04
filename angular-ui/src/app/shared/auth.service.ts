import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  token: string;
  user: {
    userId: number;
    email: string;
    role: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/api/v1/auth';
  
  // Using signals for easy reactivity in templates
  currentUser = signal<{userId: number, role: string} | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialAuth();
  }

  private checkInitialAuth() {
    const token = localStorage.getItem('hhcc_auth_token');
    const userStr = localStorage.getItem('hhcc_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
      } catch(e) {
        this.logout();
      }
    }
  }

  login(email: string) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email }).pipe(
      tap(response => {
        localStorage.setItem('hhcc_auth_token', response.token);
        localStorage.setItem('hhcc_user', JSON.stringify({ userId: response.user.userId, role: response.user.role }));
        this.currentUser.set({ userId: response.user.userId, role: response.user.role });
      })
    );
  }

  logout() {
    localStorage.removeItem('hhcc_auth_token');
    localStorage.removeItem('hhcc_user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user !== null && user.role === 'ADMIN';
  }

  getToken(): string | null {
    return localStorage.getItem('hhcc_auth_token');
  }
}
