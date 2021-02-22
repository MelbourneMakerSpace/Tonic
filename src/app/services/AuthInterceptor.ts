import { Injector, Injectable } from "@angular/core";
import { from as fromPromise, Observable } from "rxjs";

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";
import { AuthService } from "./security/auth.service";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // console.log('intercept injecting:', this.auth.userToken);
    const reqClone = req.clone({
      headers: req.headers.set(
        "Authorization",
        "Bearer " + this.auth.authToken
      ),
    });
    return next.handle(reqClone).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this.router.navigate(["/"]);
          }
        }
      )
    );
  }
}
