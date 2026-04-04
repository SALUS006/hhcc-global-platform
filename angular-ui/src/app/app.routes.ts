import { Routes } from '@angular/router';
import { authGuard } from './shared/auth.guard';
import { adminGuard } from './shared/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./profile/register/register.component').then(m => m.RegisterComponent) },
  { path: 'profile/family', loadComponent: () => import('./profile/family-list/family-list.component').then(m => m.FamilyListComponent), canActivate: [authGuard] },
  { path: 'profile/family/add', loadComponent: () => import('./profile/family-form/family-form.component').then(m => m.FamilyFormComponent), canActivate: [authGuard] },
  { path: 'profile/family/edit/:id', loadComponent: () => import('./profile/family-form/family-form.component').then(m => m.FamilyFormComponent), canActivate: [authGuard] },
  { path: 'profile/pets', loadComponent: () => import('./profile/pet-list/pet-list.component').then(m => m.PetListComponent), canActivate: [authGuard] },
  { path: 'profile/pets/add', loadComponent: () => import('./profile/pet-form/pet-form.component').then(m => m.PetFormComponent), canActivate: [authGuard] },
  { path: 'profile/pets/edit/:id', loadComponent: () => import('./profile/pet-form/pet-form.component').then(m => m.PetFormComponent), canActivate: [authGuard] },
  { path: 'scheduling', loadComponent: () => import('./scheduling/booking-list/booking-list.component').then(m => m.BookingListComponent), canActivate: [authGuard] },
  { path: 'scheduling/new', loadComponent: () => import('./scheduling/booking-form/booking-form.component').then(m => m.BookingFormComponent), canActivate: [authGuard] },
  { path: 'payment', loadComponent: () => import('./payment/payment-dashboard/payment-dashboard.component').then(m => m.PaymentDashboardComponent), canActivate: [authGuard] },
  { path: 'payment/checkout/:invoiceId', loadComponent: () => import('./payment/payment-checkout/payment-checkout.component').then(m => m.PaymentCheckoutComponent), canActivate: [authGuard] },
  { path: 'support', loadComponent: () => import('./support/support.component').then(m => m.SupportComponent) },
  { path: 'admin', loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
