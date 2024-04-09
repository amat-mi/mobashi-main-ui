import { Component, Inject, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

import { OicomIconService } from './contrib/oicom-icon/oicom-icon.service';
import { ToastService } from './contrib/core/toast.service';
import { LangService } from './contrib/lang/lang.service';
import { ThemeService } from './contrib/theme/theme.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { CityService } from './city/city.service';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MapService } from './contrib/map/map.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  readonly pagesLinks$: Observable<any>;
  readonly settingslinks$: Observable<any>;
  readonly selectedCity$ = this.cityService.selectedCity$;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private platform: Platform,
    private zone: NgZone,
    private titleService: Title,
    public router: Router,
    public tr: LangService,         //MUST be here and be public for template to use!!!
    private iconService: OicomIconService,
    private themeService: ThemeService,         //this MUST be here for the service to initialize when App starts
    private toastService: ToastService,
    private mapService: MapService,         //this MUST be here for the service to initialize when App starts
    private cityService: CityService
  ) {
    this.pagesLinks$ = of(this.router.config.filter(
      (route) => !!route.data && !route.data['isSettings']));
    this.settingslinks$ = of(this.router.config.filter(
      (route) => !!route.data && !!route.data['isSettings']));

    this.initializeApp();
  }

  initializeApp() {
    //at startup retrieve session data from server, and only after that initializa the App
    this.platform.ready().then(() => {
      this.selectedCity$.subscribe((city) => {
        if (city.name) {
          this.titleService.setTitle(city.name);
        }

        if (city.favIcon) {
          const favIcon = this.document.getElementById('appIcon') as HTMLLinkElement;
          favIcon.type = city.favIcon.type ?? favIcon.type
          favIcon.href = city.favIcon.href ?? favIcon.href
        }
      });

      const icons = [
        'arrow-back', 'close', 'search', 'checkmark', 'checkmark-done',
        'chevron-back', 'chevron-forward', 'close-circle',
        'caret-up', 'caret-down',         //md
        'chevron-up', 'chevron-down',     //ios
        'arrow-forward',
        'refresh',
        'language',
        'key',
        'eye', 'eye-off',
        'expand', 'contract',
        'information', 'information-circle',
        'alert-circle', 'checkmark-circle',
        'square', 'checkbox', 'radio-button-off', 'radio-button-on',
        'log-in', 'log-out',
        'shield-checkmark',
        'call', 'globe', 'mail', 'navigate', 'person', 'settings', 'share', 'share-social',
        'heart', 'bicycle', 'fast-food', 'restaurant', 'home',
        //'storefront',           //this is NOT present in Ionicons 5.0.1 (it is present in Ionicons 5.5.2)
        'notifications',
        'calculator',
        'qr-code', 'scan', 'flash', 'flash-off', 'camera-reverse',
        'basket', 'cart', 'send', 'time',
        'list', 'receipt', 'wallet', 'cash', 'card', 'newspaper',
        'add', 'remove', 'pencil', 'add-circle', 'remove-circle', 'trash',
        'filter', 'copy', 'clipboard',
        'eyedrop', 'flag', 'school', 'lock-closed',
        'analytics'
      ];
      this.iconService.addIcons(icons, 'outline');

      const logos = [
        'logo-apple', 'logo-facebook', 'logo-google', 'logo-twitter'
      ];
      this.iconService.addIcons(logos);       //can't specify a prefer for logos

      //from Ionicons 5.5.2 (v5.0.0 doesn't have it)
      this.iconService.addCustomIcons(['logo-paypal']);

      const customIcons = [
        'dining-table-with-chairs',       //Modified https://www.svgrepo.com/svg/91574/dining-table-with-chairs
      ];
      this.iconService.addCustomIcons(customIcons, 'outline');

      const shopclassIcons = [
        'shopclass-10',
        'shopclass-20',
        'shopclass-30',
        'shopclass-40',
        'shopclass-50',
        'shopclass-100',
      ];
      this.iconService.addCustomIcons(shopclassIcons);

      //at startup initialize Lang service to have all Lang translations files preloaded and active Lang set
      this.tr.init().then(() => {
        App.addListener('appUrlOpen', (data: any) => {
          this.zone.run(() => {
          });
        });

        this.toastService.setDefaultDurationError(0);       //by default do NOT close Error Toast automatically
        this.toastService.setTranslateSuccess('SUCCESS');   //use translations for Success Toast
        this.toastService.setTranslateError('ERROR');       //use translations for Error Toast


        /*         //set the Status Bar to a fixed Light style
                //TODO!!! Change it upon switching Light/Dark mode!!!
                StatusBar.setStyle({
                  style: StatusBarStyle.Light,
                });
        
                // Display content under transparent status bar (Android only)
                StatusBar.setOverlaysWebView({
                  overlay: true,
                });
         */

        /*         // Do NOT display content under transparent status bar (Android only)
                StatusBar.setOverlaysWebView({
                  overlay: false,
                }); */
      });
    });
  }
}
