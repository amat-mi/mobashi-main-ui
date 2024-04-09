import { Component, Input, OnInit } from '@angular/core';
import { LangService } from 'src/app/contrib/lang/lang.service';
import { RoleService } from '../role.service';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/contrib/core/alert.service';
import { translate } from '@ngneat/transloco';

@Component({
  selector: 'app-role-school',
  templateUrl: './role-school.component.html',
  styleUrls: ['./role-school.component.scss'],
})
export class RoleSchoolComponent implements OnInit {
  objects$!: Observable<any[]>;
  readonly perms$ = this.service.perms$;
  roles$!: Observable<string[]>;
  viewRoles: any;

  @Input() school$!: Observable<any>;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    private alertService: AlertService,
    private service: RoleService,
  ) {
    this.service.ensure();
  }

  ngOnInit() {
    this.roles$ = this.service.allRoles();
    this.objects$ = this.service.usersOfSchool(this.school$);
  }

  async ensureUser(data: any, school: any, lang: any) {
    console.log(data);

    if (!!data)                   //it's null when modal is closed without execution
      this.service.ensureUser(school, lang.id, data.kind);
  }

  async resetPassword(ev: any, school: any, lang: any, object: any) {
    ev.preventDefault();      //MUST do this!!!
    ev.stopPropagation();     //MUST do this!!!

    const message1 = translate('CONF.ROLE.RESETPASSWORD.CONFIRM1', { USERNAME: object.username });
    const yesClass = 'button-negative';
    if (await this.alertService.confirm(message1, yesClass)) {
      const message2 = translate('CONF.ROLE.RESETPASSWORD.CONFIRM2', { USERNAME: object.username });

      if (await this.alertService.confirm(message2, yesClass)) {
        this.service.resetPassword(school, lang.id, object);
      };
    }
  }

  async removeUser(ev: any, school: any, object: any) {
    ev.preventDefault();      //MUST do this!!!
    ev.stopPropagation();     //MUST do this!!!

    const message1 = translate('CONF.ROLE.REMOVEUSER.CONFIRM1', { USERNAME: object.username });
    const yesClass = 'button-negative';
    if (await this.alertService.confirm(message1, yesClass)) {
      const message2 = translate('CONF.ROLE.REMOVEUSER.CONFIRM2', { USERNAME: object.username });

      if (await this.alertService.confirm(message2, yesClass)) {
        this.service.removeUser(school, object);
      };
    }
  }
}
