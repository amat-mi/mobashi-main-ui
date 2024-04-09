import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordResetPageRoutingModule } from './password-reset-routing.module';

import { PasswordResetPage } from './password-reset.page';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule,
    PasswordResetPageRoutingModule
  ],
  declarations: [PasswordResetPage]
})
export class PasswordResetPageModule { }
