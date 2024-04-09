import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnsureUserComponent } from './ensure-user.component';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule
  ],
  declarations: [EnsureUserComponent],
  exports: [EnsureUserComponent]
})
export class EnsureUserComponentModule { }
