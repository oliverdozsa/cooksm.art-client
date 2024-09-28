import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InitialSourcePagesService {

  request: Subject<void> = new Subject();

  constructor() { }
}
