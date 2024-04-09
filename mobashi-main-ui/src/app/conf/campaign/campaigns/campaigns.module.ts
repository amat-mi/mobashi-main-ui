import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignsPageRoutingModule } from './campaigns-routing.module';

import { CampaignsPage } from './campaigns.page';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule,
    CampaignsPageRoutingModule
  ],
  declarations: [CampaignsPage]
})
export class CampaignsPageModule { }
