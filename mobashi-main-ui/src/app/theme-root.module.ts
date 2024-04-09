import { NgModule } from '@angular/core';
import { ThemeModule } from './contrib/theme/theme.module';
import { provideThemeService } from './contrib/theme/theme.service';


@NgModule({
  exports: [ThemeModule],
  providers: [
    //    provideThemeService(CONFIG ?? {})
    provideThemeService(
      // @ts-ignore
      import('./local_configs/theme')
        .then((m) => m.CONFIG).catch((err) => console.error(err))   //does NOT work if missing!!!
    )
  ]
})
export class ThemeRootModule { }
