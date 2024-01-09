import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";

export interface SearchableListItemControl {
  icon: string;
  onClick: (item: any) => void;
}

@Component({
  selector: 'app-searchable-list',
  templateUrl: './searchable-list.component.html',
  styleUrls: ['./searchable-list.component.scss']
})
export class SearchableListComponent {
  @Input()
  isWorking: boolean = false;

  @Input()
  nameKey: string = "name";

  @Input()
  itemControls: SearchableListItemControl[] = [];

  @Input()
  itemCreatable: boolean = false;

  @Input()
  onItemClick: (item: any) => void = () => {
  };

  @Input()
  onItemAddClick: () => void = () => {
  };

  @Input()
  set items(value: any[]) {
    this._items = value;
    this.filteredItems = [...this._items];
  }

  get items(): any[] {
    return this._items;
  }

  @Input()
  set showCreatePopover(value: boolean) {
    if (value && !this._showCreatePopover) {
      this._showCreatePopover = value;
      this.popover?.open();
    }
  }

  get isCreatePopoverDisabled() {
    return this._items.length > 0 || this._popoverGotHidden;
  }

  @ViewChild("createPopover") popover: NgbPopover | undefined;

  filteredItems: any[] = [];

  search: string = "";

  private _items: any[] = [];
  private _showCreatePopover: boolean = false;
  private _popoverGotHidden: boolean = false;

  filterList() {
    this.filteredItems = this._items
      .filter(item => item[this.nameKey].toLowerCase().includes(this.search.toLowerCase()));
  }

  onPopoverHidden() {
    this._popoverGotHidden = true;
  }
}
