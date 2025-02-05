export interface PageDurationStat {
  path: string;
  averageDuration: number;
  visits: number;
  minDuration: number;
  maxDuration: number;
  lastVisit: string;
}

export interface DetailedDuration {
  eventData: {
    startTime: string;
    endTime: string;
    duration: number;
  };
}

export interface Activity {
  eventName: string;
  sessionId: string;
  userId: string;
  metadata: {
    timestamp: string;
  };
  eventData?: {
    email?: string;
    status?: string;
    products?: Array<{ name: string }>;
    name?: string;
    total?: number;
    currency?: string;
  };
}

export interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  viewCount: number;
  addToCartCount: number;
}

export interface TimeBasedEvent {
  eventName: string;
  count: number;
}

export interface TimeBasedAnalytics {
  events: TimeBasedEvent[];
  totalEvents: number;
}

export interface OrderStatistics {
  totalOrders: number;
  totalAmount: number;
  averageOrderAmount: number;
  minOrderAmount: number;
  maxOrderAmount: number;
}

export const DATE_RANGES = [
  { value: "today", label: "Bugün" },
  { value: "yesterday", label: "Dün" },
  { value: "last7days", label: "Son 7 Gün" },
  { value: "last30days", label: "Son 30 Gün" },
  { value: "thisMonth", label: "Bu Ay" },
  { value: "lastMonth", label: "Geçen Ay" }
] as const;

export const EVENT_TYPES = [
  { value: "all", label: "Tüm Olaylar" },
  { value: "PAGE_VIEW", label: "Sayfa Görüntüleme" },
  { value: "ELEMENT_CLICK", label: "Tıklama" },
  { value: "PRODUCT_VIEWED", label: "Ürün Görüntüleme" },
  { value: "ADD_TO_CART", label: "Sepete Ekleme" },
  { value: "REMOVE_FROM_CART", label: "Sepetten Çıkarma" },
  { value: "CHECKOUT_STARTED", label: "Ödeme Başlatma" },
  { value: "CHECKOUT_COMPLETED", label: "Ödeme Tamamlama" },
  { value: "CHECKOUT_CANCELLED", label: "Ödeme İptal" },
  { value: "FORM_SUBMISSION", label: "Form Gönderimi" },
  { value: "LOGIN", label: "Giriş" },
  { value: "REGISTER", label: "Kayıt" },
  { value: "ADD_WISHLIST", label: "Favorilere Ekleme" },
  { value: "REMOVE_WISHLIST", label: "Favorilerden Çıkarma" },
  { value: "FORGOT_PASSWORD", label: "Şifremi Unuttum" }
] as const; 