import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaschosPage } from './caschos.page';

const routes: Routes = [
  {
    path: '',
    component: CaschosPage,
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
export class CaschosPageRoutingModule { }
