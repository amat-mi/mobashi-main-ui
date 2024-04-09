import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignPage } from './campaign.page';

const routes: Routes = [
  {
    path: '',
    component: CampaignPage,
    data: {
      links: [
        {
          path: '/conf/campaigns',
          key: 'CONF.CAMPAIGNS.MENUTITLE',
          icon: 'arrow-back',
          class: 'exitFromConf',
        },
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignPageRoutingModule { }
