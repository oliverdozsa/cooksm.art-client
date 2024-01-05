import {Injectable} from '@angular/core';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser
} from "@abacritt/angularx-social-login";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ApiPaths} from "../api-paths";
import {ApiUserInfo} from "../data/api-user-info";
import {ToastsService, ToastType} from "./toasts.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUser: ApiUserInfo | undefined;
  isLoggedIn: boolean = false;

  apiUserAvailable$: Subject<void> = new Subject<void>();

  private user: SocialUser | undefined;
  private readonly CACHED_VALIDITY_MINS = 60;

  constructor(private authService: SocialAuthService, private httpClient: HttpClient, private toastService: ToastsService) {
    authService.authState.subscribe({
      next: u => this.onAuthStateChanged(u)
    });

    setTimeout(() => this.useCachedIfValid());
  }

  logout() {
    this.authService.signOut();
    this.isLoggedIn = false;
    this.apiUser = undefined;
    localStorage.removeItem("apiUser");
  }

  private onAuthStateChanged(user: SocialUser) {
    this.apiUser = undefined;
    this.user = user;

    if(user) {
      this.authService.getAccessToken(this.user.provider)
        .then(t => this.loginApi(t))
    } else {
      this.isLoggedIn = false;
    }
  }

  private loginApi(accessToken: string) {
    const loginData = {
      token: accessToken
    }

    let url = "";

    if(this.user?.provider === GoogleLoginProvider.PROVIDER_ID) {
      url = environment.apiUrl + "/" + ApiPaths.GOOGLE_LOGIN;
    } else if(this.user?.provider === FacebookLoginProvider.PROVIDER_ID) {
      url = environment.apiUrl + "/" + ApiPaths.FACEBOOK_LOGIN;
    }

    this.httpClient.post<ApiUserInfo>(url, loginData).subscribe({
      next: u => this.loginApiSucceeded(u),
      error: e => this.loginApiFailed()
    })
  }

  private loginApiSucceeded(apiUser: ApiUserInfo) {
    this.apiUser = apiUser;
    this.isLoggedIn = true;
    this.apiUserAvailable$.next();
    const toastText = $localize `:@@user-service-login-succeeded:Welcome ${apiUser.fullName}:userName:! 👋`;
    this.toastService.display({type: ToastType.Success, text: toastText});

    this.cacheApiUser();
  }

  private loginApiFailed() {
    this.isLoggedIn = false;
    const toastText = $localize `:@@user-service-login-failed:Could not log you in 😥.`
    this.toastService.display({type: ToastType.Danger, text: toastText});
  }

  private cacheApiUser() {
    const validUntilMillis = new Date(new Date().valueOf() + this.CACHED_VALIDITY_MINS * 60 * 1000).valueOf();

    const cachedUser = {
      user: this.apiUser,
      validUntilMillis: validUntilMillis
    }

    localStorage.setItem("apiUser", JSON.stringify(cachedUser));
  }

  private useCachedIfValid() {
    const cachedApiUserStr = localStorage.getItem("apiUser");

    if(cachedApiUserStr == null) {
      return;
    }

    const cachedApiUser = JSON.parse(cachedApiUserStr);

    const nowMillis = new Date().valueOf();
    const validUntilMillis = cachedApiUser.validUntilMillis;

    if(nowMillis < validUntilMillis) {
      this.apiUser = cachedApiUser.user;
      this.loginApiSucceeded(this.apiUser!)
    }
  }
}
