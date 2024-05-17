import {Component, Input} from '@angular/core';
import {RandomMenuGenerator} from "../menu-create-edit-modal/random-menu-generator";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-menu-generate-random-progress',
  templateUrl: './menu-generate-random-progress.component.html',
  styleUrl: './menu-generate-random-progress.component.scss'
})
export class MenuGenerateRandomProgressComponent {
  generator: RandomMenuGenerator | undefined;

  get progress(): number {
    if (this.generator != undefined) {
      return this.generator.progress;
    }

    return 0;
  }

  get failureReason(): string | undefined {
    if (this.generator == undefined) {
      return undefined;
    }

    return this.generator.failureReason;
  }

  constructor(public activeModal: NgbActiveModal) {
  }

}
