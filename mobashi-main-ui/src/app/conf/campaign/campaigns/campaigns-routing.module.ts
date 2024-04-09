import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignsPage } from './campaigns.page';

const routes: Routes = [
  {
    path: '',
    component: CampaignsPage,
    data: {
      links: [
        {
          path: '/conf',
          key: 'CONF.MENUTITLE',
          icon: 'arrow-back',
          class: 'exitFromConf',
        },
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignsPageRoutingModule { }
