import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoleSchoolComponent } from './role-school.component';
import { TranslocoModule } from '@ngneat/transloco';
import { EnsureUserComponentModule } from '../ensure-user/ensure-user.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule,
    EnsureUserComponentModule
  ],
  declarations: [RoleSchoolComponent],
  exports: [RoleSchoolComponent]
})
export class RoleSchoolComponentModule { }
