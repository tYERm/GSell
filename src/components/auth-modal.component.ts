import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (authService.isAuthModalOpen()) {
      <div class="fixed inset-0 z-[60] overflow-y-auto" role="dialog">
        <!-- Backdrop with Fade -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in" (click)="authService.closeAuthModal()"></div>

        <div class="flex min-h-screen items-center justify-center p-4 text-center">
          <!-- Modal Content with scale/fade -->
          <div class="relative w-full max-w-sm transform overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-8 text-left align-middle shadow-2xl transition-all animate-[scaleIn_0.2s_ease-out] border border-gray-100 dark:border-gray-700">
            
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{{ lang.text().signIn }}</h3>
              <button (click)="authService.closeAuthModal()" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-5">
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input 
                  [formControl]="emailControl"
                  type="email" 
                  [placeholder]="lang.text().emailPlaceholder"
                  class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{{ lang.text().passwordPlaceholder }}</label>
                <input 
                  type="password" 
                  placeholder="******"
                  class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
              </div>

              <button 
                (click)="onLogin()"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                {{ lang.text().login }}
              </button>
              
              <div class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">{{ lang.text().register }}</a>
              </div>
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
export class AuthModalComponent {
  authService = inject(AuthService);
  lang = inject(LanguageService);
  emailControl = new FormControl('', [Validators.required, Validators.email]);

  onLogin() {
    if (this.emailControl.value) {
      this.authService.login(this.emailControl.value);
    }
  }
}