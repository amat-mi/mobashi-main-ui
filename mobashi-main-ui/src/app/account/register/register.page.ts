import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../contrib/auth/auth.service';
import { LangService } from '../../contrib/lang/lang.service';
import { LangSelectorComponent } from '../../contrib/lang/lang-selector/lang-selector.component';
import { CityService } from 'src/app/city/city.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  readonly selectedCity$ = this.cityService.selectedCity$;

  username: string | undefined;
  password: string | undefined;
  password2: string | undefined;
  email: string | undefined;

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
    this.password2 = undefined;
    this.email = undefined;
  }

  public register() {
    this.authApi.register(this.username, this.password, this.password2, this.email);
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
