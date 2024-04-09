import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authApi: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const data = this.authApi.userdata['data'];       //must use the snchronous version of the data

    //if guarding the Login page itself, can activate only if stored JWT token is NOT present, otherwise don't move
    //HACK!!! URLs should come from config, or something!!!
    if ((state.url ?? '').startsWith('/login') || (state.url ?? '').startsWith('/auth'))
      return !data;

    //can activate only if stored JWT token is present, otherwise go to Login page
    //HACK!!! URLs should come from config, or something!!!
    if (!data)
      return this.router.parseUrl('/login');

    const needs = next.data?.['userneeds'] ?? {};          //get requested/unrequested in Route "data.userneeds"
    //if any unsatisfied need (requested/unrequested in Route "data.userneeds" and not present/present in userdata)
    if (_.some(needs, (needed, need) => needed ? !data[need] : !!data[need]))
      return false;                              //refuse to navigate

    return true;
  }
}
