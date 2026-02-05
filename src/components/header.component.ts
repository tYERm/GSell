import { Component, inject, output, signal, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { LanguageService, LangCode } from '../services/language.service';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { ProductService, Product } from '../services/product.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NgOptimizedImage],
  template: `
    <header class="flex flex-col z-[50] sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div class="py-2 sm:py-3 md:py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-2 sm:gap-4 justify-between">
            
            <!-- Logo (Icon only on tiny screens, Text on larger) -->
            <div class="flex-shrink-0 flex items-center gap-2 sm:gap-3 cursor-pointer group" routerLink="/">
              <div class="w-9 h-9 sm:w-10 sm:h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300 flex-shrink-0">
                <span class="text-white dark:text-black font-extrabold text-lg sm:text-xl">G</span>
              </div>
              <span class="font-black text-xl sm:text-2xl tracking-tighter text-gray-900 dark:text-white hidden md:block">GenStore</span>
            </div>

            <!-- Search Bar (Always Visible, Live Search) -->
            <div class="flex-1 max-w-xl mx-auto relative group z-50">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input
                  [formControl]="searchControl"
                  (focus)="onFocus()"
                  (blur)="onBlur()"
                  (keydown.enter)="onSearch()"
                  type="text"
                  class="w-full bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-full py-2 sm:py-2.5 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 focus:bg-white dark:focus:bg-black transition-all outline-none shadow-sm focus:shadow-md"
                  [placeholder]="lang.text().searchPlaceholder"
                >
              </div>

              <!-- Live Search Results Dropdown -->
              @if (showResults() && searchResults().length > 0) {
                <div class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in max-h-[70vh] overflow-y-auto">
                   <div class="py-2">
                     <div class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Products</div>
                     @for (p of searchResults(); track p.id) {
                       <a [routerLink]="['/product', p.id]" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group/item">
                         <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 relative">
                           <img [ngSrc]="p.image" width="40" height="40" class="w-full h-full object-cover group-hover/item:scale-110 transition-transform" [alt]="p.name">
                         </div>
                         <div class="flex-1 min-w-0">
                           <div class="font-bold text-sm text-gray-900 dark:text-white truncate group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">{{ p.name }}</div>
                           <div class="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">{{ p.category }}</div>
                         </div>
                         <div class="font-extrabold text-sm text-gray-900 dark:text-white flex-shrink-0">
                           $ {{ p.price }}
                         </div>
                       </a>
                     }
                   </div>
                   <div class="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-center border-t border-gray-100 dark:border-gray-700">
                     <button (click)="onSearch()" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View all results</button>
                   </div>
                </div>
              }
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 sm:gap-2">
              
              <!-- Language Switcher (Compact) -->
              <button 
                (click)="toggleLang()" 
                class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-black transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                {{ lang.currentLang() === 'ru' ? 'RU' : 'EN' }}
              </button>

              <!-- Theme Toggle -->
              <button (click)="handleThemeToggle($event)" class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-yellow-400 transition-all active:scale-95">
                @if (theme.isDark()) {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                } @else {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                }
              </button>

              <!-- User Profile -->
              <div class="relative">
                <button 
                  class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors relative" 
                  (click)="handleUserClick()" 
                  [title]="lang.text().profile"
                >
                   <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                   @if (auth.currentUser()) {
                     <span class="absolute top-1 right-1 w-2 h-2 bg-green-500 border border-white dark:border-gray-900 rounded-full"></span>
                   }
                </button>
                
                @if (isProfileMenuOpen() && auth.currentUser()) {
                  <div class="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-fade-in z-50 origin-top-right">
                    <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                       <p class="text-sm font-bold text-gray-900 dark:text-white">{{ auth.currentUser()?.name }}</p>
                       <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ auth.currentUser()?.email }}</p>
                    </div>
                    
                    <button (click)="openProfile()" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                       {{ lang.text().orders }}
                    </button>
                    
                    <button (click)="logout()" class="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2">
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                       {{ lang.text().logout }}
                    </button>
                  </div>
                  
                  <div class="fixed inset-0 z-40" (click)="isProfileMenuOpen.set(false)"></div>
                }
              </div>

              <!-- Cart -->
              <button class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors relative" (click)="cartService.toggleCart()">
                 <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                 @if (cartService.totalItems() > 0) {
                    <span class="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-black dark:bg-white text-[10px] font-bold text-white dark:text-black ring-2 ring-white dark:ring-gray-900 animate-bounce">
                      {{ cartService.totalItems() }}
                    </span>
                 }
              </button>

            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  cartService = inject(CartService);
  lang = inject(LanguageService);
  auth = inject(AuthService);
  theme = inject(ThemeService);
  productService = inject(ProductService);
  router = inject(Router);

  search = output<string>();
  searchControl = new FormControl('');
  
  isProfileMenuOpen = signal(false);
  
  // Live Search Signals
  searchResults = signal<Product[]>([]);
  showResults = signal(false);

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(val => {
      if (val && val.trim().length > 0) {
        const results = this.productService.getProducts('all', val);
        this.searchResults.set(results.slice(0, 5));
        this.showResults.set(true);
      } else {
        this.searchResults.set([]);
        this.showResults.set(false);
      }
    });

    // Close results when navigating
    this.router.events.subscribe(() => {
      this.showResults.set(false);
    });
  }

  toggleLang() {
    this.lang.setLanguage(this.lang.currentLang() === 'ru' ? 'en' : 'ru');
  }

  handleUserClick() {
    if (this.auth.currentUser()) {
      this.isProfileMenuOpen.update(v => !v);
    } else {
      this.auth.openAuthModal();
    }
  }

  openProfile() {
    this.auth.openProfileModal();
    this.isProfileMenuOpen.set(false);
  }

  logout() {
    this.auth.logout();
    this.isProfileMenuOpen.set(false);
  }

  handleThemeToggle(event: MouseEvent) {
    this.theme.toggle(event);
  }

  onSearch() {
    if (this.searchControl.value) {
      this.search.emit(this.searchControl.value);
      this.showResults.set(false);
    }
  }

  onFocus() {
    if (this.searchControl.value?.trim()) {
      this.showResults.set(true);
    }
  }

  onBlur() {
    // Small delay to allow clicking on results
    setTimeout(() => {
      this.showResults.set(false);
    }, 200);
  }
}