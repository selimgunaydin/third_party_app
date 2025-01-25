import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { TrackEventDto } from '../dto/track-event.dto';
import { EventName, PageViewEventData, ElementClickEventData, ProductEventData, CheckoutEventData, FormSubmissionEventData } from '../dto/event-types';

@Injectable()
export class EventValidationPipe implements PipeTransform {
  transform(value: TrackEventDto) {
    if (!this.validateEventData(value.eventName, value.eventData)) {
      throw new BadRequestException(`Invalid event data for event type: ${value.eventName}`);
    }
    return value;
  }

  private validateEventData(eventName: EventName, eventData: any): boolean {
    switch (eventName) {
      case EventName.PAGE_VIEW:
        return this.validatePageViewData(eventData);
      case EventName.ELEMENT_CLICK:
        return this.validateElementClickData(eventData);
      case EventName.ADD_TO_CART:
      case EventName.REMOVE_FROM_CART:
      case EventName.PRODUCT_VIEWED:
        return this.validateProductData(eventData);
      case EventName.CHECKOUT_STARTED:
        return this.validateCheckoutData(eventData);
      case EventName.FORM_SUBMISSION:
        return this.validateFormSubmissionData(eventData);
      case EventName.IDENTIFY:
        return typeof eventData === 'object' && eventData !== null;
      default:
        return false;
    }
  }

  private validatePageViewData(data: any): data is PageViewEventData {
    return (
      typeof data === 'object' &&
      typeof data.title === 'string' &&
      typeof data.url === 'string' &&
      typeof data.path === 'string' &&
      typeof data.referrer === 'string'
    );
  }

  private validateElementClickData(data: any): data is ElementClickEventData {
    return (
      typeof data === 'object' &&
      typeof data.element === 'string' &&
      typeof data.path === 'string' &&
      (data.id === undefined || typeof data.id === 'string') &&
      (data.class === undefined || typeof data.class === 'string') &&
      (data.text === undefined || typeof data.text === 'string') &&
      (data.href === undefined || typeof data.href === 'string')
    );
  }

  private validateProductData(data: any): data is ProductEventData {
    return (
      typeof data === 'object' &&
      typeof data.productId === 'string' &&
      (data.name === undefined || typeof data.name === 'string') &&
      (data.price === undefined || typeof data.price === 'number') &&
      (data.quantity === undefined || typeof data.quantity === 'number') &&
      (data.category === undefined || typeof data.category === 'string') &&
      (data.variant === undefined || typeof data.variant === 'string')
    );
  }

  private validateCheckoutData(data: any): data is CheckoutEventData {
    return (
      typeof data === 'object' &&
      typeof data.checkoutId === 'string' &&
      (data.total === undefined || typeof data.total === 'number') &&
      (data.currency === undefined || typeof data.currency === 'string') &&
      (data.products === undefined || (Array.isArray(data.products) && data.products.every((p: any) => this.validateProductData(p))))
    );
  }

  private validateFormSubmissionData(data: any): data is FormSubmissionEventData {
    return (
      typeof data === 'object' &&
      typeof data.formId === 'string' &&
      typeof data.formName === 'string' &&
      typeof data.formAction === 'string' &&
      typeof data.formMethod === 'string' &&
      typeof data.data === 'object'
    );
  }
} 