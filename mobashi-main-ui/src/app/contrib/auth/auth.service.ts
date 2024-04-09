import { TranslocoService } from '@ngneat/transloco';
import { ToastService } from '../core/toast.service';
import { Router } from '@angular/router';
import { Injectable, Inject } from '@angular/core';

import { JwtHelperService } from "@auth0/angular-jwt";
import { FeathersService } from '../feathers/feathers.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly userdata$ = this.api.select(['userdata', 'data', 'data']);       //directly get the User's data
  readonly usertoken$ = this.api.select(['userdata', 'data', 'token']);      //directly get the token (or JWT token)
  readonly helper = new JwtHelperService();
  readonly userdata = {} as { [key: string]: any };
  readonly loginService: any;
  readonly usersService: any;
  readonly userdataService: any;

  constructor(
    @Inject('app.config') private appConfig: any,
    private tr: TranslocoService,
    public api: FeathersService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginService = this.api.createRestService('/login',
      this.appConfig.HOST, 'auth/token/login/');
    this.api.attachSavingLoader('login');         //present Loader while saving
    this.api.attachErrorToast('login', { duration: 0 });           //present Toast if error (with no autoclosing)

    this.usersService = this.api.createRestService('/users',
      this.appConfig.HOST, 'auth/users/');
    this.api.attachSavingLoader('users');         //present Loader while saving
    this.api.attachErrorToast('users', { duration: 0 });           //present Toast if error (with no autoclosing)

    //Create a service to locally store User data, and ensure the one and only record actually exists for it
    this.userdataService = this.api.createStorageService('/userdata',
      this.appConfig.APPNAME + ':auth-userdata');
    this.userdataService.get('key').catch((error: any) => {
      this.userdataService.create({ id: 'key' });
    });

    //Create a service to temporarily store User data, and ensure the one and only record actually exists for it
    //MUST use a memory service and NOT a local storage one!!!
    this.userdataService = this.api.createMemoryService('/userdata');
    this.userdataService.get('key').catch((error: any) => {
      this.userdataService.create({ id: 'key' });
    });
  }

  private async _login(username: string, password: string) {
    return await this.loginService.create({ username, password })
      .then((resp: { value: any; }) => {
        //mangle received data to be in a different format:
        //FROM
        //  {
        //    "token": token (it may be a true JWT token)
        //  }
        //TO:
        //  {
        //    "token": token
        //    "data": {
        //      "key": token
        //    }
        //  }
        //FROM
        //  {
        //    "auth_token": token
        //  }
        //TO:
        //  {
        //    "auth_token": token
        //    "data": {
        //      "key": token
        //    }
        //  }
        //also remove the "value" part, if any (i.e. data.value => data)
        let data = !!resp.value ? resp.value : resp;
        if (!data.data)
          data.data = { key: data.auth_token ?? data.token };

        //locally store the User data received from server, 
        //as a simple Object too, for Interceptors to have it available synchronously
        //MUST store User data as simple Object BEFORE anything else, 
        //or it won't be immediately available synchronously (i.e. to AuthGuard)
        Object.keys(data).forEach((key) => { this.userdata[key] = data[key] });

        //ask server for User's data
        this.usersService.get('me')
          .then((resp: { value: any; }) => {
            let user = !!resp.value ? resp.value : resp;

            Object.keys(user).forEach((key) => { data.data[key] = user[key] });

            console.log('authenticated:', data);

            //HACK!!! Maybe should not bother with presentation matters here!!!
            this.toastService.presentSuccess('AUTH.VALIDLOGIN');

            this.userdataService.update('key', data).then((data: any) => {
              //if configuration specifies an URL, navigate to it
              if (this.appConfig.AFTER_LOGIN_URL)
                this.router.navigateByUrl(this.appConfig.AFTER_LOGIN_URL);
            });
          });
      })
      .catch((error: any) => {
        console.log('unauthorized:', error);

        //HACK!!! Maybe should not bother with presentation matters here!!!
        this.toastService.presentError('AUTH.INVALIDLOGIN');
        this.logout();

        throw error;        //let the error pass through
      });
  }

  /**
   * If both parameters are specified, do a true login with server.
   * Otherwise, make the locally stored User data available synchronously for HTTP Interceptors to use.
   * 
   * @param username 
   * @param password
   */
  public async login(username?: string, password?: string) {
    if (!!username && !!password)
      return this._login(username, password);

    return this.userdataService.get('key').then((data: { value: { [x: string]: any; }; }) => {
      Object.keys(data.value).forEach((key) => { this.userdata[key] = data.value[key] });
    });
  }

  /**
   * Remove the locally stored User data.
   * The User data is also removed from the synchronous version used by HTTP Interceptors.
   */
  public async logout() {
    //MUST remove User data as simple Object to make it immediately NOT available synchronously anymore
    Object.keys(this.userdata).forEach((key) => { delete this.userdata[key] });

    return this.userdataService.update('key', {}).then((data: any) => {
      //if configuration specifies an URL, navigate to it
      if (this.appConfig.AFTER_LOGOUT_URL)
        this.router.navigateByUrl(this.appConfig.AFTER_LOGOUT_URL);
    });
  }

  public async register(username?: string, password?: string, re_password?: string, email?: string) {
    await this.usersService.create({ username, password, re_password, email });

    return this.login(username, password);

    /*     return await this.usersService.create({ username, password, re_password, email }).then((data: any) => {
          //if configuration specifies an URL, navigate to it
          if (this.appConfig.AFTER_REGISTER_URL)
            this.router.navigateByUrl(this.appConfig.AFTER_REGISTER_URL);
        }); */
  }

  public async passwordReset(uid?: string, token?: string, new_password?: string, re_new_password?: string) {
    this.api.updateRestService('/users', this.appConfig.HOST, 'auth/users/reset_password_confirm/');
    await this.usersService.create({ uid, token, new_password, re_new_password });
    this.api.updateRestService('/users', this.appConfig.HOST, 'auth/users/');
  }
}
