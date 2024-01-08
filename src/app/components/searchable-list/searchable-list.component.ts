import {Component, Input} from '@angular/core';

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
    console.log(`clicked on item`)
  };

  @Input()
  onItemAddClick: () => void = () => {
  };

  @Input()
  set items(value: any[]) {
    this._items = value;
    this.filteredItems = [...this._items];
  }

  filteredItems: any[] = [];

  search: string = "";

  private _items: any[] = [];

  filterList() {
    this.filteredItems = this._items
      .filter(item => item[this.nameKey].toLowerCase().includes(this.search.toLowerCase()));
  }
}
