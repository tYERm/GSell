import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { CartService } from '../services/cart.service';
import { ProductService, Product } from '../services/product.service';
import { LanguageService } from '../services/language.service';
import { AuthService } from '../services/auth.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink, NgOptimizedImage, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
      <app-header></app-header>

      <main class="flex-grow pt-8 pb-16 animate-fade-in">
        @if (product(); as p) {
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <!-- Breadcrumb -->
            <nav class="flex text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
              <a routerLink="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ lang.text().catalog }}</a>
              <span class="mx-3 text-gray-300 dark:text-gray-700">/</span>
              <span class="capitalize hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{{ p.category }}</span>
              <span class="mx-3 text-gray-300 dark:text-gray-700">/</span>
              <span class="text-gray-900 dark:text-white">{{ p.name }}</span>
            </nav>

            <div class="lg:grid lg:grid-cols-2 lg:gap-x-16 mb-24">
              
              <!-- Image Gallery -->
              <div class="mb-10 lg:mb-0">
                <div class="aspect-square w-full bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center p-12 sticky top-24 shadow-inner border border-gray-100 dark:border-gray-700 transition-colors overflow-hidden">
                  <img 
                    [ngSrc]="p.image" 
                    [alt]="p.name" 
                    width="600" 
                    height="600"
                    priority
                    class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-110 transition-transform duration-500 drop-shadow-xl rounded-3xl"
                  >
                </div>
              </div>

              <!-- Product Info -->
              <div class="flex flex-col">
                <div class="mb-6">
                  <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                    {{ p.category }}
                  </span>
                </div>
                
                <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">{{ p.name }}</h1>
                
                <div class="flex items-center flex-wrap gap-6 mb-10">
                  <div class="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl">
                    <span class="text-yellow-400 text-lg mr-1.5">★</span>
                    <span class="font-bold text-gray-900 dark:text-white text-lg">{{ p.rating }}</span>
                  </div>
                  <span class="text-gray-500 dark:text-gray-400 font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer underline decoration-gray-300 hover:decoration-blue-600 transition-all" (click)="scrollToReviews()">
                    {{ p.reviewsCount }} {{ lang.text().reviews }}
                  </span>
                  <div class="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                  <span class="text-green-600 dark:text-green-400 text-sm font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full flex items-center gap-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {{ lang.text().stock }}
                  </span>
                </div>

                <div class="border-t border-gray-100 dark:border-gray-800 py-8">
                   <div class="flex items-baseline gap-4 mb-2">
                     <span class="text-5xl font-black text-gray-900 dark:text-white tracking-tight">$ {{ p.price }}</span>
                     @if (p.oldPrice) {
                       <span class="text-2xl text-gray-400 line-through font-medium">$ {{ p.oldPrice }}</span>
                     }
                   </div>
                   @if (p.oldPrice) {
                     <p class="text-sm text-rose-500 font-bold bg-rose-50 dark:bg-rose-900/20 inline-block px-3 py-1 rounded-lg">
                       {{ lang.text().product.save }} {{ getDiscount(p) }}%
                     </p>
                   }
                </div>

                <!-- Controls Container -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 mb-10 border border-gray-100 dark:border-gray-700 shadow-sm">
                  
                  <!-- Color Selector -->
                  @if (p.colors && p.colors.length > 0) {
                    <div class="mb-8">
                      <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider opacity-80">
                        {{ lang.text().product.selectColor }}: <span class="text-blue-600 dark:text-blue-400 ml-1">{{ selectedColor() }}</span>
                      </h3>
                      <div class="flex flex-wrap gap-4">
                        @for (color of p.colors; track color.name) {
                          <button 
                            (click)="selectedColor.set(color.name)"
                            class="w-12 h-12 rounded-full border-2 shadow-sm flex items-center justify-center transition-all hover:scale-110 relative outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
                            [class.border-blue-600]="selectedColor() === color.name"
                            [class.border-gray-200]="selectedColor() !== color.name"
                            [class.dark:border-gray-600]="selectedColor() !== color.name"
                            [title]="color.name"
                          >
                            <span class="w-9 h-9 rounded-full block border border-black/5" [style.background-color]="color.hex"></span>
                            @if (selectedColor() === color.name) {
                              <span class="absolute -right-1 -top-1 bg-blue-600 text-white rounded-full p-1 shadow-md">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                              </span>
                            }
                          </button>
                        }
                      </div>
                    </div>
                  }

                  <!-- Quantity and Add -->
                  <div class="flex flex-col sm:flex-row gap-4">
                    <!-- Quantity -->
                    <div class="flex items-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl h-16 w-full sm:w-auto shadow-sm">
                       <button (click)="updateQuantity(-1)" class="w-14 h-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-black dark:hover:text-white rounded-l-2xl text-2xl font-bold transition-colors" [disabled]="quantity() <= 1">-</button>
                       <span class="w-12 text-center font-bold text-xl text-gray-900 dark:text-white border-x border-gray-100 dark:border-gray-600 h-full flex items-center justify-center select-none">{{ quantity() }}</span>
                       <button (click)="updateQuantity(1)" class="w-14 h-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-black dark:hover:text-white rounded-r-2xl text-2xl font-bold transition-colors">+</button>
                    </div>

                    <!-- Add Button -->
                    <button (click)="addToCart()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white border border-transparent rounded-2xl h-16 flex items-center justify-center text-lg font-bold shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30">
                      {{ lang.text().addToCart }} - $ {{ (p.price * quantity()).toFixed(2) }}
                    </button>
                  </div>
                </div>

                <div class="prose prose-lg prose-blue dark:prose-invert text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-none">
                  <p>{{ p.longDescription }}</p>
                </div>
                
                <!-- Details & Specs -->
                <div class="space-y-10">
                    <div>
                       <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">{{ lang.text().product.highlights }}</h3>
                       <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         @for (feat of p.features; track feat) {
                           <li class="flex items-center text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-colors">
                             <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mr-3 flex-shrink-0">
                               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                             </div>
                             <span class="font-medium">{{ feat }}</span>
                           </li>
                         }
                       </ul>
                    </div>

                    <div>
                      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">{{ lang.text().specifications }}</h3>
                      <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                         <dl class="divide-y divide-gray-100 dark:divide-gray-700">
                           @for (spec of p.specs; track spec.label) {
                             <div class="grid grid-cols-3 gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                               <dt class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ spec.label }}</dt>
                               <dd class="text-base font-bold text-gray-900 dark:text-white col-span-2">{{ spec.value }}</dd>
                             </div>
                           }
                         </dl>
                      </div>
                    </div>
                </div>

              </div>
            </div>

            <!-- Reviews Section -->
            <div id="reviews-section" class="border-t border-gray-200 dark:border-gray-800 pt-16">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-10 flex items-center gap-4">
                {{ lang.text().product.customerReviews }}
                <span class="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-base py-1 px-4 rounded-full font-bold">{{ p.reviewsCount }}</span>
              </h2>

              <div class="grid md:grid-cols-12 gap-12">
                <!-- Rating Summary -->
                <div class="md:col-span-4 space-y-8">
                   <div class="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 h-fit border border-gray-100 dark:border-gray-700">
                      <div class="text-center mb-8">
                         <div class="text-7xl font-black text-gray-900 dark:text-white mb-2">{{ p.rating }}</div>
                         <div class="flex justify-center text-yellow-400 text-2xl mb-3 tracking-widest">★★★★★</div>
                         <p class="text-gray-500 dark:text-gray-400 font-medium">{{ lang.text().product.basedOn }} {{ p.reviewsCount }} {{ lang.text().reviews }}</p>
                      </div>
                      
                      <!-- Bars -->
                      <div class="space-y-4">
                        @for (star of [5,4,3,2,1]; track star) {
                          <div class="flex items-center gap-4 text-sm">
                            <span class="font-bold w-3 text-gray-900 dark:text-white">{{ star }}</span>
                            <div class="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div class="h-full bg-yellow-400 rounded-full transition-all duration-1000" [style.width.%]="star === 5 ? 70 : (star === 4 ? 20 : 5)"></div>
                            </div>
                          </div>
                        }
                      </div>
                   </div>
                </div>

                <!-- Reviews List & Form -->
                <div class="md:col-span-8 space-y-8">
                  
                  <!-- Review Input Area -->
                  @if (auth.hasPurchased(p.id)) {
                    <div class="bg-blue-50 dark:bg-gray-800 p-6 rounded-2xl border border-blue-100 dark:border-gray-700">
                      <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ lang.text().writeReview }}</h4>
                      <textarea 
                        [formControl]="reviewControl"
                        rows="3" 
                        class="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mb-4"
                        [placeholder]="lang.text().reviewPlaceholder"
                      ></textarea>
                      <div class="flex justify-end">
                        <button (click)="submitReview()" class="bg-blue-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                           {{ lang.text().submitReview }}
                        </button>
                      </div>
                    </div>
                  } @else if (auth.currentUser()) {
                    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                       <p class="text-gray-500 dark:text-gray-400 italic">
                         <span class="text-xl block mb-2">🔒</span>
                         {{ lang.text().onlyBuyersReview }}
                       </p>
                    </div>
                  }

                  @if (p.reviews && p.reviews.length > 0) {
                    @for (review of p.reviews; track review.id) {
                       <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                          <div class="flex items-start gap-4">
                            <img [src]="review.avatar" class="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-600 object-cover" alt="Avatar">
                            <div class="flex-1">
                               <div class="flex justify-between items-center mb-2">
                                  <h4 class="font-bold text-lg text-gray-900 dark:text-white">{{ review.user }}</h4>
                                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ review.date }}</span>
                               </div>
                               <div class="flex text-yellow-400 text-sm mb-4">
                                 @for (s of [1,2,3,4,5]; track s) {
                                   <span>{{ s <= review.rating ? '★' : '☆' }}</span>
                                 }
                               </div>
                               <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ review.text }}</p>
                            </div>
                          </div>
                       </div>
                    }
                  } @else {
                    <div class="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                      <div class="text-gray-300 dark:text-gray-600 mb-4 text-4xl">✎</div>
                      <p class="text-gray-500 dark:text-gray-400 mb-4 text-lg">{{ lang.text().product.noReviews }}</p>
                      @if (!auth.currentUser()) {
                        <button (click)="auth.openAuthModal()" class="text-blue-600 dark:text-blue-400 font-bold hover:underline">{{ lang.text().login }}</button>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>

          </div>
        } @else {
          <div class="flex justify-center items-center h-64">
             <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class ProductPage implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
  cartService = inject(CartService);
  lang = inject(LanguageService);
  auth = inject(AuthService);

  product = signal<Product | undefined>(undefined);
  selectedColor = signal<string>('');
  quantity = signal(1);
  reviewControl = new FormControl('');

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const p = this.productService.getProductById(id);
        this.product.set(p);
        if (p?.colors?.length) {
          this.selectedColor.set(p.colors[0].name);
        }
        this.quantity.set(1);
        this.reviewControl.reset();
        window.scrollTo(0, 0);
      }
    });
  }

  updateQuantity(delta: number) {
    const newQ = this.quantity() + delta;
    if (newQ >= 1) this.quantity.set(newQ);
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, p.image, this.quantity(), this.selectedColor());
      this.cartService.isOpen.set(true);
    }
  }

  getDiscount(p: Product) {
    if (!p.oldPrice) return 0;
    return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
  }

  scrollToReviews() {
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  submitReview() {
    if (this.reviewControl.value?.trim()) {
      const p = this.product();
      if (p && this.auth.currentUser()) {
        const newReview = {
          id: Math.random().toString(),
          user: this.auth.currentUser()!.name,
          avatar: `https://ui-avatars.com/api/?name=${this.auth.currentUser()!.name}&background=random`,
          rating: 5, // Mock rating
          date: new Date().toLocaleDateString(),
          text: this.reviewControl.value
        };
        
        // In a real app, update via service
        if (!p.reviews) p.reviews = [];
        p.reviews.unshift(newReview);
        p.reviewsCount++;
        
        this.reviewControl.reset();
      }
    }
  }
}