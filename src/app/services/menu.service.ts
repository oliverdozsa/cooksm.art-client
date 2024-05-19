import {Injectable} from '@angular/core';
import {Menu, MenuRequest, MenuTitle} from "../data/menu";
import {UserService} from "./user.service";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToastsService} from "./toasts.service";
import {delay, Observable, of, Subject, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  isLoading: boolean = false;
  menus: MenuTitle[] = [];

  public available$: Subject<void> = new Subject();

  private readonly baseUrl = environment.apiUrl + "/menus";

  constructor(userService: UserService, private httpClient: HttpClient, private toastService: ToastsService,
              private toasts: ToastsService) {
    if (userService.isLoggedIn) {
      this.load();
    }

    userService.apiUserAvailable$.subscribe({
      next: () => this.load()
    })
  }

  create(menuRequest: MenuRequest) {
    this.isLoading = true;
    this.httpClient.post(this.baseUrl, menuRequest)
      .subscribe({
        next: () => this.onRequestComplete(),
        error: () => this.onRequestFailed()
      });
  }

  getById(id: number): Observable<Menu> {
    this.isLoading = true;
    return this.httpClient.get<Menu>(`${this.baseUrl}/${id}`)
      .pipe(
        delay(700),
        tap({
          next: () => this.isLoading = false,
          error: () => this.isLoading = false
        })
      );
  }

  delete(id: number): void {
    this.isLoading = true;
    this.httpClient.delete(`${this.baseUrl}/${id}`)
      .subscribe({
        next: () => this.onRequestComplete(),
        error: () => this.onRequestFailed()
      })
  }

  update(menuRequest: MenuRequest, id: number): void {
    this.isLoading = true;
    this.httpClient.put(`${this.baseUrl}/${id}`, menuRequest).subscribe({
      next: () => this.onRequestComplete(),
      error: () => this.onRequestFailed()
    });
  }

  private load() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.httpClient.get<MenuTitle[]>(`${this.baseUrl}/all`)
      .pipe(delay(700))
      .subscribe({
        next: menus => this.onAllMenusLoaded(menus),
        error: () => this.onAllMenusLoadFailed()
      });
  }

  private onAllMenusLoaded(menus: MenuTitle[]) {
    this.isLoading = false;
    this.menus = menus;
    this.available$.next();
  }

  private onAllMenusLoadFailed() {
    this.isLoading = false;
    const errorMessage = $localize`:@@menus-service-request-error:couldn't load menus!`;
    this.toastService.danger(errorMessage);
  }

  private onRequestComplete() {
    this.isLoading = false;
    this.load();
  }

  private onRequestFailed() {
    this.isLoading = false;
    const errorMessage = $localize`:@@menus-service-request-error:couldn't do it!`;
    this.toastService.danger(errorMessage);
  }
}
