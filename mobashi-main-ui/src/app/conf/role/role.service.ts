import { Inject, Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { APP_CONFIG, AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/contrib/auth/auth.service';
import { FeathersService } from 'src/app/contrib/feathers/feathers.service';
import { SchoolService } from '../school/school.service';
import { ToastService } from 'src/app/contrib/core/toast.service';
import { translate } from '@ngneat/transloco';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private restService;

  public readonly perms$ = this.authApi.userdata$.pipe(
    map((userdata) => userdata?.perms.role)
  );

  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private api: FeathersService,
    private authApi: AuthService,
    private toastService: ToastService,
    private schoolService: SchoolService
  ) {
    this.restService = this.api.createRestService('/schoolroles',
      this.appConfig['HOST'], 'main/schoolroles/');
    this.api.attachLoadingLoader('schoolroles');        //present Loader while loading
    this.api.attachErrorToast('schoolroles', { duration: 0 });           //present Toast if error (with no autoclosing)
  }

  public async ensure() {
  }

  public allRoles() {
    return of(['principal', 'mobman']);
  }

  public usersOfSchool(school$: Observable<any>) {
    return school$.pipe(
      map((school) => school.users)
    );
  }

  public ensureUser(school: any, lang: string, kind: string, email?: string) {
    return this.restService.patch(school.id, {
      action: "ensure_user",
      lang: lang,
      kind: kind,
      // NOOO!!! Always use School EMail!!!
      //mail: email
    })
      .then((data: any) => {
        const value = data?.value;
        console.debug(value);

        const toast = value?.created ? 'CONF.ROLE.ENSUREUSER.ADDED' : 'CONF.ROLE.ENSUREUSER.EXISTING';
        const message = translate(toast, {
          KIND: translate('CONF.ROLE.KINDS.' + value?.kind?.toUpperCase() + '.SINGULAR'),
          EMAIL: value?.email
        });
        this.toastService.presentWithColor(message, 'success');

        this.schoolService.ensure(true);        //request updated list of Schools from server

        return value;
      });
  }

  public resetPassword(school: any, lang: string, object: any) {
    return this.restService.patch(school.id, {
      action: "reset_password",
      lang: lang,
      kind: object.kind,
      user: object.id
      // NOOO!!! Always use School EMail!!!
      //mail: object.email  
    })
      .then((data: any) => {
        const value = data?.value;
        console.debug(value);

        if (value?.reset)
          this.toastService.presentWithColor(translate('CONF.ROLE.RESETPASSWORD.SUCCESS', {
            EMAIL: value?.email
          }), 'success');
        else
          this.toastService.presentWithColor(translate('CONF.ROLE.RESETPASSWORD.ERROR', {
            EMAIL: value?.email
          }), 'error');

        this.schoolService.ensure(true);        //request updated list of Schools from server

        return value;
      });
  }

  public removeUser(school: any, object: any) {
    return this.restService.patch(school.id, {
      action: "remove_user",
      kind: object.kind,
      user: object.id,
      role: object.role
    })
      .then((data: any) => {
        const value = data?.value;
        console.debug(value);

        if (value?.removed)
          this.toastService.presentWithColor(translate('CONF.ROLE.REMOVEUSER.SUCCESS', {
            USERNAME: object.username
          }), 'success');
        else
          this.toastService.presentWithColor(translate('CONF.ROLE.REMOVEUSER.ERROR', {
            USERNAME: object.username
          }), 'error');

        this.schoolService.ensure(true);        //request updated list of Schools from server

        return value;
      });
  }
}
