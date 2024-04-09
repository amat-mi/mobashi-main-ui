import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashPage } from './dash.page';

const routes: Routes = [
  {
    path: ':id',
    component: DashPage
  },
  {
    path: 'camp/:id',
    loadChildren: () => import('./camp/camp.module').then( m => m.CampPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashPageRoutingModule {}
