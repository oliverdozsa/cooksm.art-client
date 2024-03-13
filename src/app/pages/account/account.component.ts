import {Component, TemplateRef} from '@angular/core';
import {UserService} from "../../services/user.service";
import {NgIf} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {ToastsService} from "../../services/toasts.service";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    NgIf,
    NgxSpinnerModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  constructor(public userService: UserService, private modalService: NgbModal, private toasts: ToastsService,
              private spinnerService: NgxSpinnerService) {
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content).result.then(() => this.onDeleteYes());
  }

  private onDeleteYes() {
    this.spinnerService.show("deleteAccount");
    this.userService.deleteAccount().subscribe({
      next: () => this.onDeleteSuccess(),
      error: () => this.onDeleteFailed()
    })
  }

  private onDeleteSuccess() {
    this.userService.logout();
    const message = $localize `:@@account-delete-success:thanks for using cooksm.art! bye! 👋`;
    this.toasts.success(message);
    this.onDeleteFinished();
  }

  private onDeleteFailed() {
    const message = $localize `:@@account-delete-fail:couldn't do it! try again maybe 🤞.`;
    this.toasts.danger(message);
  }

  private onDeleteFinished() {
    this.spinnerService.hide("deleteAccount");
  }
}
