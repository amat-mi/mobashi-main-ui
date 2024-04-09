import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./campaigns/campaigns.module').then(m => m.CampaignsPageModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./campaign/campaign.module').then(m => m.CampaignPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignRoutingModule { }
