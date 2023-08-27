import { Injectable } from '@angular/core';
import {SearchSnapshot} from "../data/search-snapshot";
import {SearchSnapshotTransform} from "../data/search-snapshot-ops/search-snapshot-transform";

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
    return SearchSnapshotTransform.clone(this.snapshot);
  }
}
