import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfRoutingModule } from './conf-routing.module';
import { IonicModule } from '@ionic/angular';
import { ConfPage } from './conf.page';
import { ConfMenuComponent } from './conf-menu.component';
import { ConfShellPage } from './conf-shell.page';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [
    ConfShellPage,
    ConfPage,
    ConfMenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslocoModule,
    ConfRoutingModule,
  ]
})
export class ConfModule { }
