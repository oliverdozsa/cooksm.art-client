import {Injectable} from '@angular/core';
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: SocialUser | undefined;
  isLoggedIn: boolean = false;

  constructor(authService: SocialAuthService) {
    authService.authState.subscribe({
      next: u => this.onAuthStateChanged(u)
    })
  }

  private onAuthStateChanged(user: SocialUser) {
    this.isLoggedIn = user != null;
    this.user = user;
  }
}
