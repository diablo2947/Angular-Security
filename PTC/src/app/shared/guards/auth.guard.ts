import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../security/security.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let claimType: string = route.data['claimType'];
    let isAuth = this.securityService.securityObject.isAuthenticated;
    let isPropTrue = this.securityService.securityObject.getValueOfProperty(
      this.securityService.securityObject,
      claimType
    );

    return isAuth && isPropTrue;
  }

  constructor(private securityService: SecurityService) {}
}
