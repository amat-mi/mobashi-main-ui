import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../contrib/auth/auth.service';
import { LangService } from '../../contrib/lang/lang.service';
import { LangSelectorComponent } from '../../contrib/lang/lang-selector/lang-selector.component';
import { CityService } from 'src/app/city/city.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  readonly selectedCity$ = this.cityService.selectedCity$;

  username: string | undefined;
  password: string | undefined;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    private cityService: CityService,
    private authApi: AuthService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.username = undefined;
    this.password = undefined;
  }

  public login() {
    this.authApi.login(this.username, this.password);
  }

  public async presentLangPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LangSelectorComponent,
      event: ev,
      translucent: true
    });

    return await popover.present();
  }
}
