import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaschoPage } from './cascho.page';

const routes: Routes = [
  {
    path: '',
    component: CaschoPage,
    data: {
      links: [
        {
          path: '/conf/caschos',
          key: 'CONF.CASCHOS.MENUTITLE',
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
export class CaschoPageRoutingModule {}
