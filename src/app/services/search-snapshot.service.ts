import { Injectable } from '@angular/core';
import {SearchSnapshot} from "../data/search-snapshot";
import {SearchSnapshotTransform} from "../data/search-snapshot-ops/search-snapshot-transform";

interface StoredSearchSnapshot {
  snapshot: SearchSnapshot,
  validUntilMillis: number
}

@Injectable({
  providedIn: 'root'
})
export class SearchSnapshotService {
  static VALIDITY_MINS = 60;

  snapshot = new SearchSnapshot();

  constructor() {
    this.loadValidStored();
  }

  set(snapshot: SearchSnapshot) {
    this.snapshot = snapshot;

    const item: StoredSearchSnapshot = {
      snapshot: this.snapshot,
      validUntilMillis: new Date(new Date().valueOf() + SearchSnapshotService.VALIDITY_MINS * 60 * 1000).valueOf()
    };

    localStorage.setItem("searchSnapshot", JSON.stringify(item));
  }

  cloneSnapshot() {
    return SearchSnapshotTransform.clone(this.snapshot);
  }

  private loadValidStored() {
    const storedSnapshotJsonString = localStorage.getItem("searchSnapshot");
    if (storedSnapshotJsonString == null) {
      return;
    }

    const storedSnapshot: StoredSearchSnapshot = JSON.parse(storedSnapshotJsonString);
    const nowMillis = new Date().valueOf();

    if (nowMillis < storedSnapshot.validUntilMillis) {
      this.snapshot = storedSnapshot.snapshot;
    }
  }
}
