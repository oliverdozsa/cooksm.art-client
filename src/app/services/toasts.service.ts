import {Injectable} from '@angular/core';

export enum ToastType {
  Success,
  Danger
}

export interface Toast {
  text: string,
  type: ToastType
}

@Injectable({
  providedIn: 'root'
})
export class ToastsService {
  toasts: Toast[] = [];

  private readonly delaySeconds = 5;

  constructor() {
  }

  display(toast: Toast) {
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
