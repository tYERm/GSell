import { Injectable, signal } from '@angular/core';

export interface User {
  email: string;
  name: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  items: any[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  isAuthModalOpen = signal<boolean>(false);
  isProfileModalOpen = signal<boolean>(false);
  
  // Store orders in memory for demo
  orders = signal<Order[]>([]);

  login(email: string) {
    // Mock login
    this.currentUser.set({
      email,
      name: email.split('@')[0]
    });
    this.closeAuthModal();
  }

  logout() {
    this.currentUser.set(null);
    this.orders.set([]); // Clear orders on logout for security in demo
  }

  openAuthModal() {
    this.isAuthModalOpen.set(true);
  }

  closeAuthModal() {
    this.isAuthModalOpen.set(false);
  }

  openProfileModal() {
    this.isProfileModalOpen.set(true);
  }

  closeProfileModal() {
    this.isProfileModalOpen.set(false);
  }

  checkout(items: any[], total: number) {
    if (!this.currentUser()) return;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toLocaleDateString(),
      status: 'processing',
      items: [...items],
      total: total
    };

    this.orders.update(orders => [newOrder, ...orders]);
  }

  hasPurchased(productId: string): boolean {
    const userOrders = this.orders();
    return userOrders.some(order => order.items.some(item => item.id === productId));
  }
}
