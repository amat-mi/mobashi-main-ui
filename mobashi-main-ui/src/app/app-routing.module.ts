import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './contrib/auth/auth.guard';


const routes: Routes = [
  {
    path: 'login',
    children: [
      {
        path: '',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'conf',
    data: {
      key: 'CONF.MENUTITLE',
      icon: 'key',
      prefix: '/',
      userneeds: { is_admin: true }
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./conf/conf.module').then(m => m.ConfModule)
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    data: {
      key: 'SETTINGS.MENUTITLE',
      icon: 'cog',
      isSettings: true
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
      }
    ],
    //canActivate: [AuthGuard]
  },
  {
    path: 'dash',
    data: {
      key: 'DASH.MENUTITLE',
      icon: 'analytics',
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./dash/dash.module').then(m => m.DashPageModule)
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
