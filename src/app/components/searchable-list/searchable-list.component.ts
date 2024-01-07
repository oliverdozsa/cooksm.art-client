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
  itemControls: SearchableListItemControl[] = [
    {icon: "bi-list-ul", onClick: i => console.log(`clicked on item through control ${JSON.stringify(i)}`)},
    {icon: "bi-pen", onClick: i => console.log(`clicked on item through control ${JSON.stringify(i)}`)},
    {icon: "bi-trash", onClick: i => console.log(`clicked on item through control ${JSON.stringify(i)}`)},
  ];

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

  filteredItems: any[] = [
    {name: "alma"},
    {name: "alak"},
    {name: "bab ablak"}
  ];

  search: string = "";

  private _items: any[] = [
    {name: "alma"},
    {name: "alak"},
    {name: "bab ablak"}
  ];

  filterList() {
    this.filteredItems = this._items
      .filter(item => item[this.nameKey].toLowerCase().includes(this.search.toLowerCase()));
  }
}
