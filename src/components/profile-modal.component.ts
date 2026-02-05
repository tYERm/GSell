import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (auth.isProfileModalOpen()) {
      <div class="fixed inset-0 z-[70] overflow-y-auto" role="dialog">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in" (click)="auth.closeProfileModal()"></div>

        <div class="flex min-h-screen items-center justify-center p-4">
          <!-- Modal -->
          <div class="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-6 md:p-8 text-left shadow-2xl transition-all animate-[scaleIn_0.2s_ease-out] border border-gray-100 dark:border-gray-700 max-h-[85vh] flex flex-col">
            
            <div class="flex justify-between items-center mb-6 flex-shrink-0">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </span>
                {{ auth.currentUser()?.name }}
              </h3>
              <button (click)="auth.closeProfileModal()" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div class="overflow-y-auto flex-1 pr-2">
              
              <!-- Bind Card Section -->
              <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700/50 rounded-2xl border border-blue-100 dark:border-gray-600">
                 <div class="flex items-center justify-between">
                   <div>
                     <h4 class="font-bold text-gray-900 dark:text-white mb-1">{{ lang.text().paymentMethod }}</h4>
                     <p class="text-sm text-gray-500 dark:text-gray-300">{{ lang.text().linkCardDesc }}</p>
                   </div>
                   <button (click)="bindCard()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-transform active:scale-95 text-sm">
                     {{ lang.text().bindCard }}
                   </button>
                 </div>
              </div>

              <!-- Orders Section -->
              <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ lang.text().orderHistory }}</h4>
              
              @if (auth.orders().length === 0) {
                <div class="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                  <p class="text-gray-500 dark:text-gray-400">{{ lang.text().noOrders }}</p>
                </div>
              } @else {
                <div class="space-y-4">
                  @for (order of auth.orders(); track order.id) {
                    <div class="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                      <div class="flex justify-between items-start mb-4 border-b border-gray-200 dark:border-gray-600 pb-3">
                        <div>
                          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ lang.text().orderNumber }} {{ order.id }}</span>
                          <div class="text-sm text-gray-500 dark:text-gray-400">{{ order.date }}</div>
                        </div>
                        <div class="flex flex-col items-end">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            [ngClass]="{
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': order.status === 'processing',
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': order.status === 'shipped',
                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': order.status === 'delivered'
                            }">
                            {{ getStatusText(order.status) }}
                          </span>
                          <span class="font-bold text-gray-900 dark:text-white mt-1">$ {{ order.total.toFixed(2) }}</span>
                        </div>
                      </div>
                      
                      <div class="space-y-3">
                        @for (item of order.items; track item.id) {
                          <div class="flex items-center gap-3">
                             <img [src]="item.image" class="w-10 h-10 rounded-lg object-cover bg-white" alt="Product">
                             <div class="flex-1 min-w-0">
                               <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                               <p class="text-xs text-gray-500 dark:text-gray-400">{{ lang.text().qty }}: {{ item.quantity }}</p>
                             </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ProfileModalComponent {
  auth = inject(AuthService);
  lang = inject(LanguageService);

  bindCard() {
    alert(this.lang.text().cardBound);
  }

  getStatusText(status: string) {
    const s = status as 'processing' | 'shipped' | 'delivered';
    return this.lang.text().status[s];
  }
}