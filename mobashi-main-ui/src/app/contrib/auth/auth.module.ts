import { LangSelectorComponentModule } from './../lang/lang-selector/lang-selector.module';
import { LangModule } from './../lang/lang.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthRoutingModule,
    TranslocoModule,
    LangModule,
    LangSelectorComponentModule
  ]
})
export class AuthModule { }
