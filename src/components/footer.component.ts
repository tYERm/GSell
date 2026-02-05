import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <!-- Brand -->
          <div class="col-span-1 md:col-span-1">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-xl">G</span>
              </div>
              <span class="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">GenStore</span>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              {{ lang.text().footer.slogan }}
            </p>
            <!-- Socials -->
            <div class="flex space-x-4">
               <a href="#" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span class="sr-only">Facebook</span><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"/></svg></a>
               <a href="#" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span class="sr-only">Twitter</span><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
            </div>
          </div>
          
          <!-- Links Sections -->
          <div>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{{ lang.text().footer.shop }}</h3>
            <ul class="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ lang.text().footer.links[0] }}</a></li>
              <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ lang.text().footer.links[1] }}</a></li>
              <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ lang.text().footer.links[2] }}</a></li>
              <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ lang.text().footer.links[3] }}</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{{ lang.text().footer.support }}</h3>
            <ul class="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ lang.text().footer.links[4] }}</a></li>
              <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ lang.text().footer.links[5] }}</a></li>
              <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ lang.text().footer.links[6] }}</a></li>
              <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ lang.text().footer.links[7] }}</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{{ lang.text().footer.newsletter }}</h3>
            <div class="flex flex-col gap-3">
              <input type="email" [placeholder]="lang.text().footer.enterEmail" class="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors">
              <button class="w-full px-4 py-2.5 text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md">
                {{ lang.text().footer.subscribe }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
          <p class="text-xs text-gray-400 dark:text-gray-500">&copy; 2024 GenStore. {{ lang.text().footer.rights }}</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  lang = inject(LanguageService);
}