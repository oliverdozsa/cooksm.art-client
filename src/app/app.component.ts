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
    {name: $localize`:@@page-title-home:Home`, link: RouteNames.HOME},
    {name: $localize`:@@page-title-about:About`, link: RouteNames.ABOUT},
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
    this.authService.signOut();
  }

  private onAuthStateChanged(user: SocialUser) {
    if(user && this.loginModal) {
      this.loginModal?.close()
    }
  }
}
