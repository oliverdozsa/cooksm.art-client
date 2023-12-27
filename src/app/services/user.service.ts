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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: SocialUser | undefined;
  apiUser: ApiUserInfo | undefined;
  isLoggedIn: boolean = false;

  constructor(private authService: SocialAuthService, private httpClient: HttpClient) {
    authService.authState.subscribe({
      next: u => this.onAuthStateChanged(u)
    })
  }

  private onAuthStateChanged(user: SocialUser) {
    this.isLoggedIn = user != null;
    this.apiUser = this.isLoggedIn ? this.apiUser : undefined;
    this.user = user;

    if(this.isLoggedIn) {
      this.authService.getAccessToken(this.user.provider)
        .then(t => this.loginApi(t))
    }
  }

  private loginApi(accessToken: string) {
    console.log(`social user: ${JSON.stringify(this.user)}`)

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
  }

  private loginApiFailed() {
    // TODO: toast message.
    this.isLoggedIn = false;
  }
}
