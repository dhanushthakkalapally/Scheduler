import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {SchedulerService} from "../scheduler/scheduler.service";
import {exhaustMap, take} from "rxjs/operators";
import {User} from "./authenticate.model";


@Injectable()
export class interceptor implements HttpInterceptor {

  user: User;

  constructor(private _service: SchedulerService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Take operater will automatically unsubsribes once we get the observable
    this._service.user.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    if (this.user) {
      // console.log(this.user);
      const modifiedreq = req.clone({params: new HttpParams().append("Authorization", this.user.token)});

      return next.handle(modifiedreq);
    } else {
      return next.handle(req);
    }


  }

}
