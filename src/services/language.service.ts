import { Injectable, signal, computed } from '@angular/core';

export type LangCode = 'ru' | 'en';

const DICTIONARY = {
  ru: {
    searchPlaceholder: 'Найти товары...',
    catalog: 'Каталог',
    login: 'Войти',
    logout: 'Выйти',
    cart: 'Корзина',
    profile: 'Профиль',
    contact: 'Контакты',
    support: 'Поддержка',
    popular: 'Популярное',
    newArrivals: 'Новинки',
    addToCart: 'В корзину',
    buyNow: 'Купить',
    checkout: 'Оформить заказ',
    total: 'Итого',
    emptyCart: 'Ваша корзина пуста',
    continueShopping: 'В каталог',
    loginToCheckout: 'Войти для заказа',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Пароль',
    signIn: 'Вход',
    register: 'Регистрация',
    writeReview: 'Оставить отзыв',
    yourReview: 'Ваш отзыв',
    submitReview: 'Отправить',
    reviewPlaceholder: 'Поделитесь впечатлениями о товаре...',
    onlyBuyersReview: 'Только покупатели могут оставлять отзывы',
    orders: 'Мои заказы',
    orderHistory: 'История заказов',
    orderStatus: 'Статус заказа',
    bindCard: 'Привязать карту',
    paymentMethod: 'Способ оплаты',
    linkCardDesc: 'Привяжите карту для быстрой оплаты',
    qty: 'Кол-во',
    orderNumber: 'Заказ №',
    cardBound: 'Карта успешно привязана!',
    noOrders: 'У вас пока нет заказов.',
    status: {
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен'
    },
    successCheckout: 'Заказ успешно оформлен!',
    categories: {
      all: 'Все товары',
      electronics: 'Электроника',
      appliances: 'Бытовая техника',
      computers: 'Компьютеры',
      phones: 'Смартфоны',
      clothing: 'Одежда',
      home: 'Для дома',
      auto: 'Автотовары',
      sport: 'Спорт и отдых',
      beauty: 'Красота и здоровье'
    },
    heroTitle: 'Технологии Будущего',
    heroSubtitle: 'Премиальные товары, отобранные специально для вашего образа жизни.',
    stock: 'В наличии',
    reviews: 'отзывов',
    specifications: 'Характеристики',
    description: 'Описание',
    footer: {
      shop: 'Магазин',
      support: 'Помощь',
      newsletter: 'Рассылка',
      slogan: 'Ваш надежный магазин электроники и товаров для дома.',
      subscribe: 'Подписаться',
      enterEmail: 'Ваш email...',
      rights: 'Все права защищены.',
      links: ['Новинки', 'Хиты продаж', 'Электроника', 'Дом и сад', 'Статус заказа', 'Возврат', 'FAQ', 'Контакты']
    },
    product: {
      highlights: 'Особенности',
      customerReviews: 'Отзывы клиентов',
      basedOn: 'На основе',
      selectColor: 'Цвет',
      noReviews: 'Пока нет отзывов.',
      beFirst: 'Оставьте отзыв первым!',
      save: 'Скидка'
    },
    features: {
      delivery: { title: 'Быстрая доставка', desc: 'Доставка за 1-2 дня' },
      warranty: { title: 'Гарантия качества', desc: '12 месяцев гарантии' },
      return: { title: 'Легкий возврат', desc: '30 дней на возврат' },
      support: { title: 'Поддержка 24/7', desc: 'Всегда на связи' }
    },
    sections: {
      brands: 'Бренды партнеры',
      whyUs: 'Почему мы?'
    }
  },
  en: {
    searchPlaceholder: 'Search products...',
    catalog: 'Catalog',
    login: 'Log In',
    logout: 'Log Out',
    cart: 'Cart',
    profile: 'Profile',
    contact: 'Contact',
    support: 'Support',
    popular: 'Popular',
    newArrivals: 'New Arrivals',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    checkout: 'Checkout',
    total: 'Total',
    emptyCart: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    loginToCheckout: 'Log in to checkout',
    emailPlaceholder: 'Your Email',
    passwordPlaceholder: 'Password',
    signIn: 'Sign In',
    register: 'Register',
    writeReview: 'Write a Review',
    yourReview: 'Your Review',
    submitReview: 'Submit',
    reviewPlaceholder: 'Share your thoughts...',
    onlyBuyersReview: 'Only verified buyers can leave reviews',
    orders: 'My Orders',
    orderHistory: 'Order History',
    orderStatus: 'Order Status',
    bindCard: 'Bind Card',
    paymentMethod: 'Payment Method',
    linkCardDesc: 'Link your card for faster checkout',
    qty: 'Qty',
    orderNumber: 'Order #',
    cardBound: 'Card bound successfully!',
    noOrders: 'No orders yet.',
    status: {
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered'
    },
    successCheckout: 'Order placed successfully!',
    categories: {
      all: 'All Products',
      electronics: 'Electronics',
      appliances: 'Appliances',
      computers: 'Laptops',
      phones: 'Phones',
      clothing: 'Clothing',
      home: 'Home & Living',
      auto: 'Automotive',
      sport: 'Sports',
      beauty: 'Beauty'
    },
    heroTitle: 'Future Tech Today',
    heroSubtitle: 'Discover premium products curated just for your lifestyle.',
    stock: 'In Stock',
    reviews: 'reviews',
    specifications: 'Specifications',
    description: 'Description',
    footer: {
      shop: 'Shop',
      support: 'Support',
      newsletter: 'Newsletter',
      slogan: 'Your trusted store for premium electronics and home goods.',
      subscribe: 'Subscribe',
      enterEmail: 'Enter your email...',
      rights: 'All rights reserved.',
      links: ['New Arrivals', 'Best Sellers', 'Electronics', 'Home & Living', 'Order Status', 'Returns', 'FAQ', 'Contact Us']
    },
    product: {
      highlights: 'Highlights',
      customerReviews: 'Customer Reviews',
      basedOn: 'Based on',
      selectColor: 'Select Color',
      noReviews: 'No reviews yet.',
      beFirst: 'Be the first to write one!',
      save: 'Save'
    },
    features: {
      delivery: { title: 'Fast Delivery', desc: 'Delivery in 1-2 days' },
      warranty: { title: 'Quality Warranty', desc: '12 months warranty' },
      return: { title: 'Easy Returns', desc: '30 days return policy' },
      support: { title: '24/7 Support', desc: 'Always here for you' }
    },
    sections: {
      brands: 'Trusted Brands',
      whyUs: 'Why Choose Us?'
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<LangCode>('ru');
  
  text = computed(() => DICTIONARY[this.currentLang()]);

  setLanguage(lang: LangCode) {
    this.currentLang.set(lang);
  }
}