import { Component } from '@angular/core';
import {RouteNames} from "./route-names";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isMenuCollapsed = true;
  routes = [
    {name: $localize `:@@page-title-home:Home`, link: RouteNames.HOME},
    {name: $localize `:@@page-title-about:About`, link: RouteNames.ABOUT},
  ]
}
