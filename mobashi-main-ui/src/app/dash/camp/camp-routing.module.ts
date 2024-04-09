import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampPage } from './camp.page';

const routes: Routes = [
  {
    path: '',
    component: CampPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampPageRoutingModule {}
