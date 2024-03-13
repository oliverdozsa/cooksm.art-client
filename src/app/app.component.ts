import {Component, OnInit, TemplateRef} from '@angular/core';
import {RouteNames} from "./route-names";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FacebookLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {UserService} from "./services/user.service";
import {first} from "rxjs";
import {FavoriteRecipesService} from "./services/favorite-recipes.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isMenuCollapsed = true;
  routes = [
    {name: $localize`:@@page-title-home:home`, link: RouteNames.HOME, isAuthNeeded: false},
    {name: $localize`:@@page-title-recipe-books:recipe books`, link: RouteNames.RECIPE_BOOKS, isAuthNeeded: true},
    {name: $localize`:@@page-title-account:account`, link: RouteNames.ACCOUNT, isAuthNeeded: true},
    {name: $localize`:@@page-title-about:about`, link: RouteNames.ABOUT, isAuthNeeded: false},
  ]

  private loginModal: NgbModalRef|undefined;

  constructor(private modalService: NgbModal, private authService: SocialAuthService, public userService: UserService,
              private eagerInitFavoriteRecipesService: FavoriteRecipesService) {
    this.authService.authState
      .subscribe({
        next: u => this.onAuthStateChanged(u)
      });
  }

  onLoginClicked(loginTemplate: TemplateRef<any>) {
    this.isMenuCollapsed = true;
    this.loginModal = this.modalService.open(loginTemplate);
  }

  onFacebookLoginClicked() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  onLogoutClicked() {
    this.userService.logout();
  }

  isAvailable(route: any): boolean {
    if(!route.isAuthNeeded) {
      return true;
    }

    return this.userService.isLoggedIn;
  }

  private onAuthStateChanged(user: SocialUser) {
    if(user && this.loginModal) {
      this.loginModal?.close()
    }
  }
}
