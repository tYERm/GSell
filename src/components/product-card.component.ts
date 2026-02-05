import { Component, input, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="group h-full flex flex-col bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-gray-700 relative">
      
      <!-- Image Area (Edge-to-Edge) -->
      <div class="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer" (click)="goToDetails()">
        <!-- Image with specific object fit for cleaner look -->
        <img 
          [ngSrc]="imageUrl()" 
          width="400" 
          height="400" 
          [alt]="product().name"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          [priority]="priority()"
        >
        
        <!-- Dark Gradient Overlay for text visibility if needed, mostly for aesthetics -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <!-- Badges (Absolute positioned) -->
        <div class="absolute top-3 left-3 flex flex-col gap-2 z-10">
           @if (product().oldPrice) {
            <span class="bg-rose-600 text-white text-[11px] font-bold px-3 py-1 rounded-r-lg shadow-md flex items-center gap-1 border-l-2 border-rose-800 relative">
              <span class="absolute w-2 h-2 bg-white rounded-full -left-1 top-1.5"></span>
              -{{ getDiscount() }}%
            </span>
           }
           @if (product().reviewsCount > 500) {
             <span class="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md flex items-center gap-1 animate-pulse">
               <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/></svg>
               HIT
             </span>
           }
        </div>

        <!-- Quick View Button (Desktop only) -->
        <div class="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 hidden lg:flex">
           <button class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-900 dark:text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-xl hover:bg-white dark:hover:bg-black transition-colors">
             View Details
           </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-4 sm:p-5 flex flex-col flex-1">
        <!-- Category & Rating -->
        <div class="flex justify-between items-center mb-2">
           <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate">
             {{ product().category }}
           </span>
           <div class="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-lg flex-shrink-0">
             <span class="text-amber-400 text-xs">★</span>
             <span class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ product().rating }}</span>
           </div>
        </div>
        
        <!-- Title -->
        <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer" (click)="goToDetails()">
          {{ product().name }}
        </h3>
        
        <!-- Price & Actions -->
        <div class="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div class="flex flex-col">
             @if (product().oldPrice) {
               <span class="text-[10px] sm:text-xs text-gray-400 line-through mb-0.5">$ {{ product().oldPrice }}</span>
             }
             <span class="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">$ {{ product().price }}</span>
          </div>

          <!-- Add Button with Quantity embedded (simplified for cards) -->
          <button 
             (click)="addToCart($event)"
             class="relative overflow-hidden bg-gray-900 dark:bg-white text-white dark:text-gray-900 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
             [title]="lang.text().addToCart"
           >
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
             </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  product = input.required<any>();
  priority = input<boolean>(false);
  
  cartService = inject(CartService);
  lang = inject(LanguageService);
  router: Router = inject(Router);

  get imageUrl() {
    return () => `https://picsum.photos/seed/${this.product().id}/600/400`;
  }

  getDiscount() {
    const p = this.product().price;
    const old = this.product().oldPrice;
    if(!old) return 0;
    return Math.round(((old - p) / old) * 100);
  }

  addToCart(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    const defaultColor = this.product().colors?.[0]?.name;
    this.cartService.addToCart(this.product(), this.imageUrl(), 1, defaultColor);
    
    // Haptic visual
    const btn = (e.target as HTMLElement).closest('button');
    if(btn) {
      btn.classList.add('bg-green-600', 'text-white', 'dark:bg-green-500');
      btn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
      setTimeout(() => {
        btn.classList.remove('bg-green-600', 'text-white', 'dark:bg-green-500');
        btn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>`;
      }, 1000);
    }
  }

  goToDetails() {
    this.router.navigate(['/product', this.product().id]);
  }
}