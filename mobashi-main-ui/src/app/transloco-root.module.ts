import {
  provideTransloco,
  TranslocoModule
} from '@ngneat/transloco';
import {
  provideTranslocoLocale,
  TranslocoLocaleModule
}
  from '@ngneat/transloco-locale';
import { isDevMode, NgModule } from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';


@NgModule({
  exports: [
    TranslocoModule,
    TranslocoLocaleModule
  ],
  providers: [
    provideTransloco({
      config: {
        availableLangs: [
          { id: 'it', label: 'Italiano' },
          { id: 'en', label: 'English' }
        ],
        defaultLang: 'it',
        fallbackLang: 'en',
        missingHandler: {
          useFallbackTranslation: true
        },
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    }),
    provideTranslocoLocale({
      langToLocaleMapping: {
        it: 'it-IT',
        en: 'en-US',
      }
    })
  ],
})
export class TranslocoRootModule { }
