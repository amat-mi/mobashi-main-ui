import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfPage } from './conf.page';
import { ConfShellPage } from './conf-shell.page';
import { ConfMenuComponent } from './conf-menu.component';

const routes: Routes = [
  {
    path: '',
    component: ConfShellPage,
    children: [
      {
        path: '',
        component: ConfPage,
        data: {
          links: [
            {
              path: '/home',
              key: 'DASH.MENUTITLE',
              icon: 'arrow-back',
              class: 'exitFromConf',
            },
            {
              path: 'conf/campaigns',
              key: 'CONF.CAMPAIGNS.MENUTITLE',
            },
            {
              path: 'conf/schools',
              key: 'CONF.SCHOOLS.MENUTITLE',
            },
          ]
        }
      },
      {
        path: 'campaigns',
        loadChildren: () => import('./campaign/campaign.module').then(m => m.CampaignModule)
      },
      {
        path: 'schools',
        loadChildren: () => import('./school/school.module').then(m => m.SchoolModule)
      },
      {
        path: 'caschos',
        loadChildren: () => import('./cascho/cascho.module').then(m => m.CaschoModule)
      },
      {
        path: '',
        outlet: 'confmenu',
        component: ConfMenuComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfRoutingModule { }
