import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./caschos/caschos.module').then(m => m.CaschosPageModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./cascho/cascho.module').then(m => m.CaschoPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaschoRoutingModule { }
