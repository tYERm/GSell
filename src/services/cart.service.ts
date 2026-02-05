import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  variantId: string; // Composite ID of product ID + color
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private authService = inject(AuthService);

  items = signal<CartItem[]>([]);
  isOpen = signal<boolean>(false);

  totalItems = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  totalPrice = computed(() => this.items().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  addToCart(product: any, image: string, quantity: number = 1, color?: string) {
    const variantId = color ? `${product.id}-${color}` : product.id;
    
    this.items.update(current => {
      const existing = current.find(i => i.variantId === variantId);
      if (existing) {
        return current.map(i => i.variantId === variantId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...current, {
        id: product.id,
        variantId,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image,
        color
      }];
    });
    this.isOpen.set(true);
  }

  removeFromCart(variantId: string) {
    this.items.update(current => current.filter(i => i.variantId !== variantId));
  }

  updateQuantity(variantId: string, delta: number) {
    this.items.update(current => {
      return current.map(item => {
        if (item.variantId === variantId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  }

  toggleCart() {
    this.isOpen.update(v => !v);
  }

  checkout() {
    if (this.authService.currentUser()) {
      this.authService.checkout(this.items(), this.totalPrice());
      this.items.set([]); // Clear cart
      this.isOpen.set(false);
      return true;
    }
    return false;
  }
}
