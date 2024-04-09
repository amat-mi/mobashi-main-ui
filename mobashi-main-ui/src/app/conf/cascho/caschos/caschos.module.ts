import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaschosPageRoutingModule } from './caschos-routing.module';

import { CaschosPage } from './caschos.page';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule,
    CaschosPageRoutingModule
  ],
  declarations: [CaschosPage]
})
export class CaschosPageModule {}
