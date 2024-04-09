import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./schools/schools.module').then(m => m.SchoolsPageModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./school/school.module').then(m => m.SchoolPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
