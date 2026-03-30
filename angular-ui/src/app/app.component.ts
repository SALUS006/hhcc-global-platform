import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container nav-inner">
        <a routerLink="/" class="logo">🏠 HHCC</a>
        <button class="hamburger" (click)="menuOpen = !menuOpen" aria-label="Toggle menu">☰</button>
        <ul class="nav-links" [class.open]="menuOpen" role="navigation">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="menuOpen=false">Home</a></li>
          <li><a routerLink="/profile/family" routerLinkActive="active" (click)="menuOpen=false">Profile</a></li>
          <li><a routerLink="/scheduling" routerLinkActive="active" (click)="menuOpen=false">Scheduling</a></li>
          <li><a routerLink="/payment" routerLinkActive="active" (click)="menuOpen=false">Payment</a></li>
          <li><a routerLink="/support" routerLinkActive="active" (click)="menuOpen=false">Support</a></li>
          <li><a routerLink="/admin" routerLinkActive="active" (click)="menuOpen=false">Admin</a></li>
          <li><a routerLink="/register" class="btn btn-primary btn-sm" (click)="menuOpen=false">Register</a></li>
        </ul>
      </div>
    </nav>
    <main>
      <router-outlet />
    </main>
    <footer class="footer">
      <div class="container text-center">
        <p>&copy; 2026 Helping Hands Care Center. All rights reserved.</p>
        <p><a href="#">Privacy</a> &middot; <a href="#">Terms</a> &middot; <a href="#">Contact</a></p>
      </div>
    </footer>
  `,
  styles: [`
    .navbar { background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
    .logo { font-size: 20px; font-weight: 700; color: var(--primary); text-decoration: none; }
    .nav-links { display: flex; list-style: none; gap: 8px; align-items: center; }
    .nav-links a { padding: 8px 14px; border-radius: 6px; font-size: 14px; font-weight: 500; color: #424242; transition: all 0.2s; text-decoration: none; }
    .nav-links a:hover, .nav-links a.active { background: #fbe9e7; color: var(--primary); }
    .hamburger { display: none; background: none; border: none; font-size: 24px; cursor: pointer; }
    .footer { background: #fff; border-top: 1px solid var(--border); padding: 24px 0; margin-top: 48px; }
    .footer p { font-size: 13px; color: var(--text-light); margin: 4px 0; }
    .footer a { color: var(--text-light); }
    @media (max-width: 768px) {
      .hamburger { display: block; }
      .nav-links { display: none; flex-direction: column; position: absolute; top: 64px; left: 0; right: 0; background: #fff; padding: 16px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
      .nav-links.open { display: flex; }
    }
  `]
})
export class AppComponent {
  menuOpen = false;
}
