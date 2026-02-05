import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDark = signal<boolean>(false);

  constructor() {
    // Force default to light initially unless explicitly set to dark in local storage
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.isDark.set(true);
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      this.isDark.set(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    // Effect handles automatic sync if signal changes outside of toggle (e.g., potential future system pref sync)
    effect(() => {
      const dark = this.isDark();
      // We check classList to avoid redundant DOM writes/thrashing if already handled by toggle
      if (dark && !document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      } else if (!dark && document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  toggle(event?: MouseEvent) {
    const isDark = this.isDark();
    const nextState = !isDark;
    
    // Check if View Transition API is supported
    if (!(document as any).startViewTransition) {
      this.isDark.set(nextState);
      return;
    }

    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (document as any).startViewTransition(() => {
      this.isDark.set(nextState);
      // Manually sync DOM here to ensure transition captures the state change immediately
      if (nextState) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      }
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: nextState ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: nextState ? '::view-transition-old(root)' : '::view-transition-new(root)',
        }
      );
    });
  }
}