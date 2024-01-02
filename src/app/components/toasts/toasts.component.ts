import {Component} from '@angular/core';
import {Toast, ToastsService, ToastType} from "../../services/toasts.service";

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss'],
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' }
})
export class ToastsComponent {
  constructor(public toastService: ToastsService) {
  }

  getToastClass(toast: Toast): string {
    if (toast.type === ToastType.Success) {
      return "text-bg-light";
    } else if(toast.type === ToastType.Danger) {
      return "text-bg-danger";
    }

    return "";
  }
}
