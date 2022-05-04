import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
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

    let storageAuth: string | null = localStorage.getItem('AuthObject');
    if (storageAuth) {
      Object.assign(
        this.securityService.securityObject,
        JSON.parse(storageAuth)
      );
    }

    let isAuth = this.securityService.securityObject.isAuthenticated;
    let isPropTrue = this.securityService.securityObject.getValueOfProperty(
      this.securityService.securityObject,
      claimType
    );

    if (isAuth && isPropTrue) return true;

    this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {}
}
