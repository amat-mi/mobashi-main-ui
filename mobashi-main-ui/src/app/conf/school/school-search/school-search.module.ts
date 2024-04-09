import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchoolSearchComponent } from './school-search.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,],
  declarations: [SchoolSearchComponent ],
  exports: [SchoolSearchComponent ]
})
export class SchoolSearchComponentModule {}
