import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampPageRoutingModule } from './camp-routing.module';

import { CampPage } from './camp.page';
import { MapComponent } from '../components/map/map.component';
import { ChartComponent } from '../components/chart/chart.component';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule,
    TranslocoLocaleModule,
    CampPageRoutingModule,
    MapComponent,
    ChartComponent,
  ],
  declarations: [CampPage]
})
export class CampPageModule { }
