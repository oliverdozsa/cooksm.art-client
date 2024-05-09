import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  isLoading: boolean = true;

  // TODO
  menus = [];

  constructor() { }
}
