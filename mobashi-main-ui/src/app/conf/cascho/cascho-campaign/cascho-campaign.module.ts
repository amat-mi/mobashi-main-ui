import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaschoCampaignComponent } from './cascho-campaign.component';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';
import { SchoolSearchComponentModule } from '../../school/school-search/school-search.module';
import { CaschoViewComponentModule } from '../cascho-view/cascho-view.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    TranslocoModule,
    CaschoViewComponentModule,
    SchoolSearchComponentModule
  ],
  declarations: [CaschoCampaignComponent],
  exports: [CaschoCampaignComponent]
})
export class CaschoCampaignComponentModule { }
