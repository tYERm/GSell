import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header.component';
import { ProductCardComponent } from '../components/product-card.component';
import { FooterComponent } from '../components/footer.component';
import { ProductService } from '../services/product.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ProductCardComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
      <app-header (search)="onSearch($event)"></app-header>

      <main class="flex-grow w-full animate-fade-in">
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          
          <div class="flex flex-col lg:flex-row gap-8">
            
            <!-- Categories Sidebar (Desktop) -->
            <aside class="hidden lg:block w-72 flex-shrink-0">
               <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-28 transition-colors duration-300">
                 <div class="p-5 bg-black dark:bg-white text-white dark:text-black font-extrabold flex items-center gap-2">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                   {{ lang.text().categories.all }}
                 </div>
                 <nav class="flex flex-col p-3 space-y-1">
                    <button (click)="selectCategory('all')" 
                            class="text-left px-5 py-3 text-sm rounded-2xl transition-all flex items-center justify-between group"
                            [class.bg-gray-100]="selectedCategory() === 'all'"
                            [class.font-bold]="selectedCategory() === 'all'"
                            [class.text-black]="selectedCategory() === 'all'"
                            [class.dark:bg-gray-700]="selectedCategory() === 'all'"
                            [class.dark:text-white]="selectedCategory() === 'all'"
                            [class.text-gray-600]="selectedCategory() !== 'all'"
                            [class.dark:text-gray-400]="selectedCategory() !== 'all'"
                            [class.hover:bg-gray-50]="selectedCategory() !== 'all'"
                            [class.dark:hover:bg-gray-700]="selectedCategory() !== 'all'"
                            >
                         <span>{{ lang.text().categories.all }}</span>
                    </button>
                    @for (cat of categories(); track cat.key) {
                      <button (click)="selectCategory(cat.key)" 
                              class="text-left px-5 py-3 text-sm rounded-2xl transition-all flex items-center justify-between group"
                              [class.bg-gray-100]="selectedCategory() === cat.key"
                              [class.font-bold]="selectedCategory() === cat.key"
                              [class.text-black]="selectedCategory() === cat.key"
                              [class.dark:bg-gray-700]="selectedCategory() === cat.key"
                              [class.dark:text-white]="selectedCategory() === cat.key"
                              [class.text-gray-600]="selectedCategory() !== cat.key"
                              [class.dark:text-gray-400]="selectedCategory() !== cat.key"
                              [class.hover:bg-gray-50]="selectedCategory() !== cat.key"
                              [class.dark:hover:bg-gray-700]="selectedCategory() !== cat.key"
                              >
                         {{ cat.label }}
                         <svg class="w-4 h-4 text-gray-300 group-hover:text-black dark:group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    }
                 </nav>
               </div>
               
               <!-- Promo Widget -->
               <div class="mt-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-indigo-500/30 sticky top-[700px] transform hover:scale-[1.02] transition-transform cursor-pointer">
                 <div class="text-xs font-bold uppercase tracking-widest opacity-75 mb-2">Summer Sale</div>
                 <span class="font-black text-6xl block mb-2 drop-shadow-md">-50%</span>
                 <p class="text-sm font-medium opacity-90 mb-6">On selected electronics</p>
                 <div class="bg-white text-indigo-600 text-xs font-extrabold py-3 px-8 rounded-full inline-block shadow-lg">SHOP NOW</div>
               </div>
            </aside>

            <!-- Main Content -->
            <div class="flex-1 min-w-0">
              
              <!-- Mobile Categories -->
              <div class="lg:hidden mb-8 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div class="flex gap-2">
                   <button (click)="selectCategory('all')"
                           class="px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all border"
                           [class.bg-black]="selectedCategory() === 'all'"
                           [class.text-white]="selectedCategory() === 'all'"
                           [class.border-black]="selectedCategory() === 'all'"
                           [class.dark:bg-white]="selectedCategory() === 'all'"
                           [class.dark:text-black]="selectedCategory() === 'all'"
                           [class.bg-white]="selectedCategory() !== 'all'"
                           [class.text-gray-700]="selectedCategory() !== 'all'"
                           [class.border-gray-200]="selectedCategory() !== 'all'"
                           [class.dark:bg-gray-800]="selectedCategory() !== 'all'"
                           [class.dark:text-gray-300]="selectedCategory() !== 'all'"
                           [class.dark:border-gray-700]="selectedCategory() !== 'all'"
                   >{{ lang.text().categories.all }}</button>
                   @for (cat of categories(); track cat.key) {
                     <button (click)="selectCategory(cat.key)"
                             class="px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all border"
                             [class.bg-black]="selectedCategory() === cat.key"
                             [class.text-white]="selectedCategory() === cat.key"
                             [class.border-black]="selectedCategory() === cat.key"
                             [class.dark:bg-white]="selectedCategory() === cat.key"
                             [class.dark:text-black]="selectedCategory() === cat.key"
                             [class.bg-white]="selectedCategory() !== cat.key"
                             [class.text-gray-700]="selectedCategory() !== cat.key"
                             [class.border-gray-200]="selectedCategory() !== cat.key"
                             [class.dark:bg-gray-800]="selectedCategory() !== cat.key"
                             [class.dark:text-gray-300]="selectedCategory() !== cat.key"
                             [class.dark:border-gray-700]="selectedCategory() !== cat.key"
                     >{{ cat.label }}</button>
                   }
                </div>
              </div>
              
              <!-- Hero Banner -->
              @if (!searchQuery() && selectedCategory() === 'all') {
                <div class="relative rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 min-h-[420px] flex items-center group bg-gray-100 dark:bg-gray-900 transition-colors">
                   <img src="https://picsum.photos/seed/tech/1200/500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out opacity-40 dark:opacity-50 dark:mix-blend-overlay mix-blend-multiply" alt="Banner">
                   
                   <div class="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent"></div>
                   
                   <div class="relative z-10 px-8 md:px-16 py-12 md:w-3/4">
                     <span class="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur border border-black/10 dark:border-white/20 text-black dark:text-white text-[10px] font-extrabold uppercase tracking-widest mb-6 animate-fade-in">
                       <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                       New Collection 2026
                     </span>
                     <h1 class="text-4xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-6 leading-[1.05] drop-shadow-sm dark:drop-shadow-lg">
                       {{ lang.text().heroTitle }}
                     </h1>
                     <p class="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-10 max-w-lg font-medium leading-relaxed">
                       {{ lang.text().heroSubtitle }}
                     </p>
                     <div class="flex gap-4">
                       <button class="bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-4 px-8 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                         {{ lang.text().buyNow }}
                       </button>
                       <button class="bg-transparent border-2 border-gray-900/30 dark:border-white/30 text-gray-900 dark:text-white font-bold py-4 px-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all backdrop-blur-sm">
                         Learn More
                       </button>
                     </div>
                   </div>
                </div>
              }

              <!-- Features Grid (Why Us) -->
              @if (!searchQuery() && selectedCategory() === 'all') {
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                   <div class="bg-blue-50 dark:bg-gray-800 p-6 rounded-3xl flex flex-col items-center text-center transition-colors">
                      <div class="w-12 h-12 bg-blue-100 dark:bg-gray-700 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                      </div>
                      <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1">{{ lang.text().features.delivery.title }}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ lang.text().features.delivery.desc }}</p>
                   </div>
                   <div class="bg-green-50 dark:bg-gray-800 p-6 rounded-3xl flex flex-col items-center text-center transition-colors">
                      <div class="w-12 h-12 bg-green-100 dark:bg-gray-700 text-green-600 rounded-full flex items-center justify-center mb-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </div>
                      <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1">{{ lang.text().features.warranty.title }}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ lang.text().features.warranty.desc }}</p>
                   </div>
                   <div class="bg-purple-50 dark:bg-gray-800 p-6 rounded-3xl flex flex-col items-center text-center transition-colors">
                      <div class="w-12 h-12 bg-purple-100 dark:bg-gray-700 text-purple-600 rounded-full flex items-center justify-center mb-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                      </div>
                      <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1">{{ lang.text().features.return.title }}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ lang.text().features.return.desc }}</p>
                   </div>
                   <div class="bg-orange-50 dark:bg-gray-800 p-6 rounded-3xl flex flex-col items-center text-center transition-colors">
                      <div class="w-12 h-12 bg-orange-100 dark:bg-gray-700 text-orange-600 rounded-full flex items-center justify-center mb-3">
                         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                      </div>
                      <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1">{{ lang.text().features.support.title }}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ lang.text().features.support.desc }}</p>
                   </div>
                </div>
              }

              <!-- Header for grid -->
              <div class="flex items-end justify-between mb-8 px-2">
                 <div>
                   <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                     @if (searchQuery()) {
                       Results for "{{ searchQuery() }}"
                     } @else {
                       {{ getCategoryLabel(selectedCategory()) }}
                     }
                   </h2>
                   <div class="h-1 w-20 bg-blue-600 rounded-full"></div>
                 </div>
                 
                 <div class="text-sm font-bold text-gray-500 dark:text-gray-400">
                   {{ products().length }} Items Found
                 </div>
              </div>

              <!-- Product Grid -->
              @if (products().length === 0) {
                <div class="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                   <div class="text-gray-200 dark:text-gray-600 mb-6">
                     <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   </div>
                   <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
                   <p class="text-gray-500 dark:text-gray-400">Try adjusting your search or category.</p>
                </div>
              } @else {
                <!-- CHANGED: Grid is 2 columns on mobile now (grid-cols-2) -->
                <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                  @for (product of products(); track product.id; let i = $index) {
                    <div class="h-full">
                      <app-product-card [product]="product" [priority]="i < 6"></app-product-card>
                    </div>
                  }
                </div>
              }

              <!-- Brands Section (Bottom of home) -->
              @if (!searchQuery() && selectedCategory() === 'all') {
                <div class="mt-24 pt-12 border-t border-gray-100 dark:border-gray-800">
                   <h3 class="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">{{ lang.text().sections.brands }}</h3>
                   <div class="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                     <span class="text-2xl font-black text-gray-800 dark:text-white">SONY</span>
                     <span class="text-2xl font-black text-gray-800 dark:text-white">SAMSUNG</span>
                     <span class="text-2xl font-black text-gray-800 dark:text-white">APPLE</span>
                     <span class="text-2xl font-black text-gray-800 dark:text-white">NIKE</span>
                     <span class="text-2xl font-black text-gray-800 dark:text-white">DYSON</span>
                   </div>
                </div>
              }

            </div>
          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class HomePage {
  private productService = inject(ProductService);
  lang = inject(LanguageService);

  searchQuery = signal('');
  selectedCategory = signal('all');

  categories = computed(() => {
    const t = this.lang.text().categories;
    return [
      { key: 'electronics', label: t.electronics },
      { key: 'appliances', label: t.appliances },
      { key: 'computers', label: t.computers },
      { key: 'phones', label: t.phones },
      { key: 'clothing', label: t.clothing },
      { key: 'home', label: t.home },
      { key: 'auto', label: t.auto },
      { key: 'sport', label: t.sport },
      { key: 'beauty', label: t.beauty }
    ];
  });

  products = computed(() => {
    return this.productService.getProducts(this.selectedCategory(), this.searchQuery());
  });

  onSearch(query: string) {
    this.searchQuery.set(query);
    if (query) {
      this.selectedCategory.set('all');
    }
  }

  selectCategory(key: string) {
    this.selectedCategory.set(key);
    this.searchQuery.set('');
  }

  getCategoryLabel(key: string) {
    if (key === 'all') return this.lang.text().categories.all;
    const cat = this.categories().find(c => c.key === key);
    return cat ? cat.label : key;
  }
}