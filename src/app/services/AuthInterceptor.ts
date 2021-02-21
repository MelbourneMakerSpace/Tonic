import { Injector, Injectable } from "@angular/core";
import { from as fromPromise, Observable } from "rxjs";

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // console.log('intercept injecting:', this.auth.userToken);
    const reqClone = req.clone({
      headers: req.headers.set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTM4NTAyODksImV4cCI6MTYxMzg1Mzg4OX0.-hRbs7S_F17O_EdPAyLFrGzYubZjBt4lnQlJKfnR9M0"
      ),
    });
    return next.handle(reqClone);
  }
}
