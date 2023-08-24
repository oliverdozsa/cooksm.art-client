import { Injectable } from '@angular/core';
import {TargetIngredients} from "../data/target-ingredients";
import {DisplayedIngredient} from "../data/displayed-ingredient";
import {SearchSnapshot} from "../data/search-snapshot";

@Injectable({
  providedIn: 'root'
})
export class SearchSnapshotService {
  snapshot = new SearchSnapshot();

  constructor() { }

  set(snapshot: SearchSnapshot) {
    this.snapshot = snapshot;
  }

  cloneSnapshot() {
    return SearchSnapshot.clone(this.snapshot);
  }
}
