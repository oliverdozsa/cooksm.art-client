import {Component, Input} from '@angular/core';
import {RandomMenuGenerator} from "../menu-create-edit-modal/random-menu-generator";

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

  get failureReason(): string {
    if (this.generator == undefined) {
      return "";
    }

    return this.generator.failureReason;
  }
}
