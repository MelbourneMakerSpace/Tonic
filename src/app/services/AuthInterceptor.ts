import { Injector, Injectable } from "@angular/core";
import { from as fromPromise, Observable } from "rxjs";

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";
import { AuthService } from "./security/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // console.log('intercept injecting:', this.auth.userToken);
    const reqClone = req.clone({
      headers: req.headers.set(
        "Authorization",
        "Bearer " + this.auth.authToken
      ),
    });
    return next.handle(reqClone);
  }
}
