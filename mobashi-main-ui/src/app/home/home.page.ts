import { Component, OnInit, Inject } from '@angular/core';
import { CityService } from '../city/city.service';
import { LangService } from '../contrib/lang/lang.service';
import { DashService } from '../dash/dash.service';
import _ from 'lodash';
import { AuthService } from '../contrib/auth/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  readonly userdata$ = this.authApi.userdata$;
  readonly selectedCity$ = this.cityService.selectedCity$;
  readonly dashes$ = this.dashService.dashes$;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    private authApi: AuthService,
    private cityService: CityService,
    private dashService: DashService
  ) {
    this.dashService.ensure();
  }

  ngOnInit() {
  }
}
