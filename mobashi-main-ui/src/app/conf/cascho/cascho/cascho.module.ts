import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaschoPageRoutingModule } from './cascho-routing.module';

import { CaschoPage } from './cascho.page';
import { TranslocoModule } from '@ngneat/transloco';
import { EditFormComponentModule } from 'src/app/contrib/editform/edit-form/edit-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule,
    EditFormComponentModule,
    CaschoPageRoutingModule
  ],
  declarations: [CaschoPage]
})
export class CaschoPageModule { }
