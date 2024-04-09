import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolsPage } from './schools.page';

const routes: Routes = [
  {
    path: '',
    component: SchoolsPage,
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchoolsPageRoutingModule { }
