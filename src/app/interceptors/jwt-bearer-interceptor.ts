import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UserService} from "../services/user.service";

@Injectable()
export class JwtBearerInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let reqToUse = req;

    if (this.userService.isLoggedIn) {
      const newHeaders = req.headers.set("Authorization", "Bearer " + this.userService.apiUser!.jwtAuthToken);
      reqToUse = req.clone<any>({headers: newHeaders});
    }

    return next.handle(reqToUse);
  }
}
