import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { LanguageService } from '../services/language.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Container with high Z-Index to stay above header -->
    <div class="relative z-[60]" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      
      <!-- Backdrop with fade animation -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out backdrop-blur-sm"
        [class.opacity-0]="!cartService.isOpen()"
        [class.opacity-100]="cartService.isOpen()"
        [class.pointer-events-none]="!cartService.isOpen()"
        (click)="cartService.toggleCart()"
      ></div>

      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            
            <!-- Drawer Panel with Slide Animation -->
            <div 
              class="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out sm:duration-700 bg-white dark:bg-gray-800 shadow-2xl flex flex-col h-full border-l border-gray-200 dark:border-gray-700"
              [class.translate-x-full]="!cartService.isOpen()"
              [class.translate-x-0]="cartService.isOpen()"
            >
              
              <!-- Header -->
              <div class="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ lang.text().cart }}</h2>
                <button (click)="cartService.toggleCart()" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 outline-none">
                  <span class="sr-only">Close panel</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Items -->
              <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                @if (cartService.items().length === 0) {
                  <div class="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div class="p-8 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <svg class="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                      </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-medium text-lg">{{ lang.text().emptyCart }}</p>
                    <button (click)="cartService.toggleCart()" class="text-blue-600 dark:text-blue-400 font-bold hover:underline text-lg">
                      {{ lang.text().continueShopping }} &rarr;
                    </button>
                  </div>
                } @else {
                  <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                    @for (item of cartService.items(); track item.variantId) {
                      <li class="flex py-6">
                        <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
                          <img [src]="item.image" [alt]="item.name" class="h-full w-full object-cover object-center mix-blend-multiply dark:mix-blend-normal">
                        </div>

                        <div class="ml-4 flex flex-1 flex-col justify-between">
                          <div>
                            <div class="flex justify-between text-base font-bold text-gray-900 dark:text-white">
                              <h3 class="line-clamp-2">{{ item.name }}</h3>
                              <p class="ml-4 whitespace-nowrap">$ {{ (item.price * item.quantity).toFixed(2) }}</p>
                            </div>
                            @if (item.color) {
                               <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ lang.text().product.selectColor }}: {{ item.color }}</p>
                            }
                          </div>
                          <div class="flex flex-1 items-end justify-between text-sm mt-4">
                            <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                              <button (click)="cartService.updateQuantity(item.variantId, -1)" class="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold transition-colors">-</button>
                              <span class="px-3 py-1.5 text-gray-900 dark:text-white font-medium bg-white dark:bg-gray-800 min-w-[2rem] text-center">{{ item.quantity }}</span>
                              <button (click)="cartService.updateQuantity(item.variantId, 1)" class="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold transition-colors">+</button>
                            </div>

                            <button type="button" (click)="cartService.removeFromCart(item.variantId)" class="font-medium text-rose-500 hover:text-rose-400 transition-colors flex items-center gap-1">
                              <span class="text-xs uppercase font-bold tracking-wide">Remove</span>
                            </button>
                          </div>
                        </div>
                      </li>
                    }
                  </ul>
                }
              </div>

              <!-- Footer -->
              @if (cartService.items().length > 0) {
                <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6 bg-gray-50 dark:bg-gray-900">
                  <div class="flex justify-between text-lg font-bold text-gray-900 dark:text-white mb-6">
                    <p>{{ lang.text().total }}</p>
                    <p>$ {{ cartService.totalPrice().toFixed(2) }}</p>
                  </div>
                  @if (auth.currentUser()) {
                    <button (click)="checkout()" class="w-full flex items-center justify-center rounded-xl border border-transparent bg-green-600 px-6 py-4 text-base font-bold text-white shadow-lg hover:bg-green-700 active:scale-95 transition-all">
                      {{ lang.text().checkout }}
                    </button>
                  } @else {
                    <button (click)="login()" class="w-full flex items-center justify-center rounded-xl border border-transparent bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
                      {{ lang.text().loginToCheckout }}
                    </button>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  lang = inject(LanguageService);
  auth = inject(AuthService);

  login() {
    this.cartService.toggleCart(); // Close cart
    this.auth.openAuthModal(); // Open auth
  }

  checkout() {
    if(this.cartService.checkout()) {
      alert(this.lang.text().successCheckout);
    }
  }
}
