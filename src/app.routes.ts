import { Routes } from '@angular/router';
import { HomePage } from './pages/home.page';
import { ProductPage } from './pages/product.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'product/:id', component: ProductPage },
  { path: '**', redirectTo: '' }
];
