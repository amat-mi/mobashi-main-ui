import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignPageRoutingModule } from './campaign-routing.module';

import { CampaignPage } from './campaign.page';
import { TranslocoModule } from '@ngneat/transloco';
import { EditFormComponentModule } from 'src/app/contrib/editform/edit-form/edit-form.module';
import { CaschoCampaignComponentModule } from '../../cascho/cascho-campaign/cascho-campaign.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule,
    EditFormComponentModule,
    CampaignPageRoutingModule,
    CaschoCampaignComponentModule
  ],
  declarations: [CampaignPage]
})
export class CampaignPageModule { }
