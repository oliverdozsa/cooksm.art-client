import { Injectable } from '@angular/core';
import {Menu} from "../data/menu";
import {UserService} from "./user.service";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToastsService} from "./toasts.service";
import {delay, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  isLoading: boolean = false;
  menus: Menu[] = [];

  public available$: Subject<void> = new Subject();

  private readonly baseUrl = environment.apiUrl + "/menus";

  constructor(userService: UserService, private httpClient: HttpClient, private toastService: ToastsService) {
    if(userService.isLoggedIn) {
      this.load();
    }

    userService.apiUserAvailable$.subscribe({
      next: () => this.load()
    })
  }

  private load() {
    this.isLoading = true;
    this.httpClient.get<Menu[]>(`${this.baseUrl}/all`)
      .pipe(delay(700))
      .subscribe({
        next: menus => this.onAllMenusLoaded(menus),
        error: () => this.onAllMenusLoadFailed()
      });
  }

  private onAllMenusLoaded(menus: Menu[]) {
    this.isLoading = false;
    this.menus = menus;
    this.available$.next();
  }

  private onAllMenusLoadFailed() {
    this.isLoading = false;
    const errorMessage = $localize`:@@menus-service-request-error:couldn't do it!`;
    this.toastService.danger(errorMessage);
  }
}
