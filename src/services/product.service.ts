import { Injectable, inject, computed } from '@angular/core';
import { LanguageService } from './language.service';

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  rating: number;
  reviewsCount: number;
  image: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  specs: { label: string; value: string }[];
  colors?: { name: string; hex: string }[];
  reviews?: Review[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private langService = inject(LanguageService);

  private readonly rawProducts = [
    {
      id: '1', 
      price: 1199, rating: 4.9, reviewsCount: 1024, category: 'phones',
      image: 'https://picsum.photos/seed/p1/400/400',
      en: {
        name: 'iPhone 15 Pro Max',
        shortDescription: 'Titanium design, A17 Pro chip, 48MP camera.',
        longDescription: 'The iPhone 15 Pro Max features a strong and lightweight titanium design with a textured matte-glass back. It features the A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
        features: ['Titanium Design', 'A17 Pro Chip', 'Action Button', 'USB-C'],
        specs: [{label: 'Display', value: '6.7" Super Retina XDR'}, {label: 'Chip', value: 'A17 Pro'}, {label: 'Storage', value: '256GB'}]
      },
      ru: {
        name: 'iPhone 15 Pro Max',
        shortDescription: 'Титановый корпус, чип A17 Pro, камера 48 МП.',
        longDescription: 'iPhone 15 Pro Max отличается прочным и легким титановым корпусом с текстурированной матовой стеклянной задней панелью. Оснащен чипом A17 Pro, настраиваемой кнопкой Action и самой мощной системой камер iPhone.',
        features: ['Титановый дизайн', 'Чип A17 Pro', 'Кнопка Action', 'USB-C'],
        specs: [{label: 'Дисплей', value: '6.7" Super Retina XDR'}, {label: 'Чип', value: 'A17 Pro'}, {label: 'Память', value: '256 ГБ'}]
      },
      colors: [{name: 'Natural Titanium', hex: '#d4c5b0'}, {name: 'Blue Titanium', hex: '#2f3b4f'}, {name: 'White', hex: '#f2f2f2'}, {name: 'Black', hex: '#1e1e1e'}],
      reviews: [
        {id: 'r1', user: 'Alex M.', avatar: 'https://i.pravatar.cc/150?u=1', rating: 5, date: '2023-10-15', text: 'Best iPhone ever. The battery life is insane!'}
      ]
    },
    {
      id: '2', price: 1299, oldPrice: 1499, rating: 4.8, reviewsCount: 512, category: 'computers',
      image: 'https://picsum.photos/seed/p2/400/400',
      en: {
        name: 'MacBook Air 15"',
        shortDescription: 'Impressively big. Impossibly thin.',
        longDescription: 'The 15-inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display. It is supercharged by the M2 chip.',
        features: ['M2 Chip', '18hr Battery', 'Silent Design', '1080p Camera'],
        specs: [{label: 'Display', value: '15.3" Liquid Retina'}, {label: 'Memory', value: '8GB/16GB/24GB'}, {label: 'Weight', value: '1.51 kg'}]
      },
      ru: {
        name: 'MacBook Air 15"',
        shortDescription: 'Впечатляюще большой. Невероятно тонкий.',
        longDescription: '15-дюймовый MacBook Air дает больше пространства для того, что вы любите, благодаря просторному дисплею Liquid Retina. Заряжен чипом M2.',
        features: ['Чип M2', '18ч работы', 'Бесшумный', 'Камера 1080p'],
        specs: [{label: 'Дисплей', value: '15.3" Liquid Retina'}, {label: 'Память', value: '8ГБ/16ГБ/24ГБ'}, {label: 'Вес', value: '1.51 кг'}]
      },
      colors: [{name: 'Midnight', hex: '#2e3642'}, {name: 'Starlight', hex: '#f0e5d3'}, {name: 'Space Grey', hex: '#7d7e80'}, {name: 'Silver', hex: '#e3e4e5'}],
      reviews: []
    },
    {
      id: '3', price: 348, rating: 4.7, reviewsCount: 3200, category: 'electronics',
      image: 'https://picsum.photos/seed/p3/400/400',
      en: {
        name: 'Sony WH-1000XM5',
        shortDescription: 'Industry-leading noise cancellation.',
        longDescription: 'Our best noise cancelling gets even better. See how the WH-1000XM5 headphones combine our best noise cancelling technology with superlative sound.',
        features: ['Noise Canceling', '30hr Battery', 'Clear Calls', 'Multipoint Connection'],
        specs: [{label: 'Weight', value: '250g'}, {label: 'Bluetooth', value: '5.2'}, {label: 'Driver', value: '30mm'}]
      },
      ru: {
        name: 'Sony WH-1000XM5',
        shortDescription: 'Лучшее в отрасли шумоподавление.',
        longDescription: 'Наше лучшее шумоподавление стало еще лучше. Узнайте, как наушники WH-1000XM5 сочетают наши лучшие технологии с превосходным звуком.',
        features: ['Шумоподавление', '30ч работы', 'Чистые звонки', 'Мультипоинт'],
        specs: [{label: 'Вес', value: '250г'}, {label: 'Bluetooth', value: '5.2'}, {label: 'Драйвер', value: '30мм'}]
      },
      colors: [{name: 'Black', hex: '#000000'}, {name: 'Silver', hex: '#e0e0e0'}],
      reviews: []
    },
    {
      id: '4', price: 749, rating: 4.6, reviewsCount: 890, category: 'appliances',
      image: 'https://picsum.photos/seed/p4/400/400',
      en: {
        name: 'Dyson V15 Detect',
        shortDescription: 'Powerful cordless vacuum with laser illumination.',
        longDescription: 'Dyson reveals microscopic dust. Powerful, intelligent cordless vacuum with laser detect technology.',
        features: ['Laser Detect', 'Piezo Sensor', '60min Runtime', 'High Torque'],
        specs: [{label: 'Suction', value: '240AW'}, {label: 'Bin Volume', value: '0.77L'}, {label: 'Weight', value: '3 kg'}]
      },
      ru: {
        name: 'Dyson V15 Detect',
        shortDescription: 'Мощный беспроводной пылесос с лазерной подсветкой.',
        longDescription: 'Dyson выявляет микроскопическую пыль. Мощный, умный беспроводной пылесос с технологией лазерного обнаружения.',
        features: ['Лазерная подсветка', 'Пьезо датчик', '60 мин работы', 'Высокий крутящий момент'],
        specs: [{label: 'Всасывание', value: '240AW'}, {label: 'Объем', value: '0.77л'}, {label: 'Вес', value: '3 кг'}]
      },
      colors: [{name: 'Yellow/Nickel', hex: '#fadd00'}],
      reviews: []
    },
    {
      id: '5', price: 1699, oldPrice: 2199, rating: 4.5, reviewsCount: 150, category: 'electronics',
      image: 'https://picsum.photos/seed/p5/400/400',
      en: {
        name: 'Samsung 65" Neo QLED',
        shortDescription: 'Quantum Matrix Technology with Mini LEDs.',
        longDescription: 'Evolution of Neo QLED comes with Quantum Matrix Technology, which precisely controls our exclusive new Quantum Mini LED.',
        features: ['4K 120Hz', 'HDR 2000', 'OTS+ Sound', 'Infinity One Design'],
        specs: [{label: 'Resolution', value: '3840 x 2160'}, {label: 'Refresh Rate', value: '120Hz'}, {label: 'Smart TV', value: 'Tizen'}]
      },
      ru: {
        name: 'Samsung 65" Neo QLED',
        shortDescription: 'Технология Quantum Matrix с Mini LED.',
        longDescription: 'Эволюция Neo QLED с технологией Quantum Matrix, которая точно управляет новыми эксклюзивными светодиодами Quantum Mini.',
        features: ['4K 120Гц', 'HDR 2000', 'Звук OTS+', 'Дизайн Infinity One'],
        specs: [{label: 'Разрешение', value: '3840 x 2160'}, {label: 'Частота', value: '120Гц'}, {label: 'Smart TV', value: 'Tizen'}]
      },
      reviews: []
    },
    {
      id: '6', price: 98, rating: 4.4, reviewsCount: 5000, category: 'clothing',
      image: 'https://picsum.photos/seed/p6/400/400',
      en: {
        name: 'Levi\'s 501 Original',
        shortDescription: 'The original blue jean since 1873.',
        longDescription: 'A cultural icon. Worn by generations, defining style for decades. The original straight fit.',
        features: ['100% Cotton', 'Straight Fit', 'Button Fly', 'No Stretch'],
        specs: [{label: 'Material', value: 'Cotton'}, {label: 'Fit', value: 'Straight'}, {label: 'Wash', value: 'Medium Indigo'}]
      },
      ru: {
        name: 'Levi\'s 501 Original',
        shortDescription: 'Оригинальные джинсы с 1873 года.',
        longDescription: 'Икона культуры. Носимые поколениями, определяющие стиль десятилетиями. Оригинальный прямой крой.',
        features: ['100% Хлопок', 'Прямой крой', 'Пуговицы', 'Без стрейча'],
        specs: [{label: 'Материал', value: 'Хлопок'}, {label: 'Крой', value: 'Прямой'}, {label: 'Цвет', value: 'Индиго'}]
      },
      colors: [{name: 'Dark Wash', hex: '#2a3b55'}, {name: 'Light Wash', hex: '#8ca6ce'}, {name: 'Black', hex: '#111'}],
      reviews: []
    }
  ];

  products = computed(() => {
    const lang = this.langService.currentLang();
    return this.rawProducts.map(p => {
      const localized = lang === 'ru' ? p.ru : p.en;
      return {
        ...p,
        ...localized,
        reviews: p.reviews || []
      } as Product;
    });
  });

  getProducts(category: string | null, query: string): Product[] {
    let res = this.products();
    if (category && category !== 'all') {
      res = res.filter(p => p.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      res = res.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return res;
  }

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }
}