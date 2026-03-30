import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'register', loadComponent: () => import('./profile/register/register.component').then(m => m.RegisterComponent) },
  { path: 'profile/family', loadComponent: () => import('./profile/family-list/family-list.component').then(m => m.FamilyListComponent) },
  { path: 'profile/family/add', loadComponent: () => import('./profile/family-form/family-form.component').then(m => m.FamilyFormComponent) },
  { path: 'profile/family/edit/:id', loadComponent: () => import('./profile/family-form/family-form.component').then(m => m.FamilyFormComponent) },
  { path: 'profile/pets', loadComponent: () => import('./profile/pet-list/pet-list.component').then(m => m.PetListComponent) },
  { path: 'profile/pets/add', loadComponent: () => import('./profile/pet-form/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'profile/pets/edit/:id', loadComponent: () => import('./profile/pet-form/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'scheduling', loadComponent: () => import('./scheduling/booking-list/booking-list.component').then(m => m.BookingListComponent) },
  { path: 'scheduling/new', loadComponent: () => import('./scheduling/booking-form/booking-form.component').then(m => m.BookingFormComponent) },
  { path: 'payment', loadComponent: () => import('./payment/payment-dashboard/payment-dashboard.component').then(m => m.PaymentDashboardComponent) },
  { path: 'payment/checkout/:invoiceId', loadComponent: () => import('./payment/payment-checkout/payment-checkout.component').then(m => m.PaymentCheckoutComponent) },
  { path: 'support', loadComponent: () => import('./support/support.component').then(m => m.SupportComponent) },
  { path: 'admin', loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: '**', redirectTo: '' }
];
