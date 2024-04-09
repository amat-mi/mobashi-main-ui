import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { map } from 'rxjs';
import { CityService } from 'src/app/city/city.service';
import { AuthService } from 'src/app/contrib/auth/auth.service';
import { LangSelectorComponent } from 'src/app/contrib/lang/lang-selector/lang-selector.component';
import { LangService } from 'src/app/contrib/lang/lang.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {
  readonly selectedCity$ = this.cityService.selectedCity$;
  readonly hiddenParams$ = this.route.paramMap.pipe(map((params) => {
    return {
      uid: params.get('uid') ?? undefined,
      token: params.get('token') ?? undefined,
    };
  }));

  password: string | undefined;
  password2: string | undefined;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    private route: ActivatedRoute,
    private cityService: CityService,
    private authApi: AuthService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.password = undefined;
    this.password2 = undefined;
  }

  async presentLangPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LangSelectorComponent,
      event: ev,
      translucent: true
    });

    return await popover.present();
  }

  async execute(uid?: string, token?: string) {
    this.authApi.passwordReset(uid, token, this.password, this.password2);
  }
}
