import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolPage } from './school.page';

const routes: Routes = [
  {
    path: '',
    component: SchoolPage,
    data: {
      links: [
        {
          path: '/conf/schools',
          key: 'CONF.SCHOOLS.MENUTITLE',
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
export class SchoolPageRoutingModule { }
