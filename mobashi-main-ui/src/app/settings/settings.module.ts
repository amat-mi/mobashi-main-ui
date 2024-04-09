import { ThemeSettingsComponentModule } from './../contrib/theme/theme-settings/theme-settings.module';
import { LangSettingsComponentModule } from './../contrib/lang/lang-settings/lang-settings.module';
import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingsPage } from './settings/settings.page';
import { AccountSettingsComponentModule } from '../account/account-settings/account-settings.module';


@NgModule({
  declarations: [
    SettingsPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule,
    SettingsRoutingModule,
    LangSettingsComponentModule,    
    ThemeSettingsComponentModule,
    AccountSettingsComponentModule
  ]
})
export class SettingsModule { }
