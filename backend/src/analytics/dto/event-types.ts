import { ApiProperty } from '@nestjs/swagger';

export enum EventName {
  PAGE_VIEW = 'PAGE_VIEW',
  PAGE_DURATION = 'PAGE_DURATION',
  IDENTIFY = 'IDENTIFY',
  ELEMENT_CLICK = 'ELEMENT_CLICK',
  ADD_TO_CART = 'ADD_TO_CART',
  CHECKOUT_STARTED = 'CHECKOUT_STARTED',
  CHECKOUT_COMPLETED = 'CHECKOUT_COMPLETED',
  CHECKOUT_CANCELLED = 'CHECKOUT_CANCELLED',
  REMOVE_FROM_CART = 'REMOVE_FROM_CART',
  PRODUCT_VIEWED = 'PRODUCT_VIEWED',
  FORM_SUBMISSION = 'FORM_SUBMISSION',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  ADD_WISHLIST = 'ADD_WISHLIST',
  REMOVE_WISHLIST = 'REMOVE_WISHLIST',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

// Page View Event Data
export class PageViewEventData {
  @ApiProperty()
  title: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  referrer: string;
}

// Page Duration Event Data
export class PageDurationEventData {
  @ApiProperty()
  path: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  duration: number; // milliseconds cinsinden

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;
}

// Element Click Event Data
export class ElementClickEventData {
  @ApiProperty()
  element: string;

  @ApiProperty()
  id?: string;

  @ApiProperty()
  class?: string;

  @ApiProperty()
  text?: string;

  @ApiProperty()
  href?: string;

  @ApiProperty()
  path: string;
}

// Product Event Data
export class ProductEventData {
  @ApiProperty()
  productId: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  quantity?: number;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  variant?: string;
}

// Checkout Event Data
export class CheckoutEventData {
  @ApiProperty()
  checkoutId: string;

  @ApiProperty({ required: false })
  total?: number;

  @ApiProperty({ required: false })
  currency?: string;

  @ApiProperty({ type: [ProductEventData], required: false })
  products?: ProductEventData[];

  @ApiProperty({ required: false })
  paymentMethod?: string;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  errorMessage?: string;
}

// Form Submission Event Data
export class FormSubmissionEventData {
  @ApiProperty()
  formId: string;

  @ApiProperty()
  formAction: string;

  @ApiProperty()
  formMethod: string;

  @ApiProperty({ type: Object })
  data: Record<string, any>;
}

// Auth Event Data
export class AuthEventData {
  @ApiProperty()
  userId: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  method?: string;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  errorMessage?: string;
}

// Wishlist Event Data
export class WishlistEventData {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ required: false })
  productName?: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  price?: number;
}

// Event Data Type Union
export type EventData =
  | PageViewEventData
  | PageDurationEventData
  | Record<string, any> // identify event data (traits)
  | ElementClickEventData
  | ProductEventData
  | CheckoutEventData
  | FormSubmissionEventData
  | AuthEventData
  | WishlistEventData; 