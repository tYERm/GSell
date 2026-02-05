import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartDrawerComponent } from './components/cart-drawer.component';
import { AuthModalComponent } from './components/auth-modal.component';
import { ProfileModalComponent } from './components/profile-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CartDrawerComponent, AuthModalComponent, ProfileModalComponent],
  template: `
    <app-auth-modal></app-auth-modal>
    <app-profile-modal></app-profile-modal>
    <app-cart-drawer></app-cart-drawer>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
