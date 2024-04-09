import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/contrib/auth/auth.service';
import { LangService } from 'src/app/contrib/lang/lang.service';


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
  userdata$ = this.authApi.userdata$;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    private authApi: AuthService
  ) { }

  ngOnInit() { }

  public logout() {
    this.authApi.logout();
  }

}
