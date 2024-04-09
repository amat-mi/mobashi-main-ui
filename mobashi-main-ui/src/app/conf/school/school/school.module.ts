import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchoolPageRoutingModule } from './school-routing.module';

import { SchoolPage } from './school.page';
import { TranslocoModule } from '@ngneat/transloco';
import { EditFormComponentModule } from 'src/app/contrib/editform/edit-form/edit-form.module';
import { RoleSchoolComponentModule } from '../../role/role-school/role-school.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule,
    EditFormComponentModule,
    SchoolPageRoutingModule,
    RoleSchoolComponentModule
  ],
  declarations: [SchoolPage]
})
export class SchoolPageModule { }
