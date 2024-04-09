import { APP_INITIALIZER, InjectionToken, NgModule, inject } from '@angular/core';
import { LOCALE_ID } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { StorageRootModule } from './storage-root.module';
import { LangOverviewComponentModule } from './contrib/lang/lang-overview/lang-overview.module';
import { ThemeOverviewComponentModule } from './contrib/theme/theme-overview/theme-overview.module';
import { NgReduxModule } from './contrib/store/src/ng-redux.module';
import { DjangoKeyInterceptor } from './contrib/core/django-key-interceptor';
import { FeathersDRFInterceptor } from './contrib/core/feathersdrf.interceptor';
import { AuthService } from './contrib/auth/auth.service';
import { ThemeRootModule } from './theme-root.module';
import { APP_CONFIG } from './app.config';

import { CONFIG } from './local_configs/app';
import { MapRootModule } from './map-root.module';

// Importa la funzione registerLocaleData e la locale italiana
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

// Registra la locale italiana
registerLocaleData(localeIt);


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgReduxModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslocoRootModule,
    StorageRootModule,
    ThemeRootModule,
    MapRootModule,
    LangOverviewComponentModule,
    ThemeOverviewComponentModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DjangoKeyInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FeathersDRFInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const authApi = inject(AuthService);
        return () => authApi.login();
      },
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'it-IT' },
    {
      provide: APP_CONFIG,
      useValue: Object.assign({
        APPNAME: 'mobashi-main-ui',
        HOST: 'http://localhost:4000',
        AFTER_LOGIN_URL: '/home',
        AFTER_LOGOUT_URL: "/login",
        AFTER_REGISTER_URL: "/login",
        TITLE: "AMAT Milano",
        LOGO: {
          url: "assets/logo.png",
          width: 194,
          height: 77
        },
        FAVICON: {
          type: "image/x-icon",
          href: "assets/icon/favicon.ico"
        }
      }, CONFIG ?? {})
    },
    {
      provide: 'app.config',
      useExisting: APP_CONFIG
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
