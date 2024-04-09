import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashPageRoutingModule } from './dash-routing.module';

import { DashPage } from './dash.page';
import { MapComponent } from './components/map/map.component';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule,
    TranslocoLocaleModule,
    DashPageRoutingModule,
    MapComponent
  ],
  declarations: [DashPage]
})
export class DashPageModule { }
