import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaschoViewComponent } from './cascho-view.component';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule
  ],
  declarations: [CaschoViewComponent],
  exports: [CaschoViewComponent]
})
export class CaschoViewComponentModule { }
