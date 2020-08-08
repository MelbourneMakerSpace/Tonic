import { Injector, Injectable } from "@angular/core";
import { from as fromPromise, Observable } from "rxjs";

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";
import { FirebaseAuthService } from "./security/firebase-auth.service";

@Injectable()
export class FirebaseHttpInterceptor implements HttpInterceptor {
  token = "unset";

  fba: FirebaseAuthService;
  constructor(private auth: FirebaseAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // console.log('intercept injecting:', this.auth.userToken);
    const reqClone = req.clone({
      headers: req.headers.set("firebasetoken", this.auth.userToken),
    });
    return next.handle(reqClone);
  }
}
