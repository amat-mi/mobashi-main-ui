import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { EChartsOption, } from 'echarts';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    },
  ]  
})
export class ChartComponent  implements OnInit, OnChanges {

  @Input() idComp: string | undefined;
  @Input() grafici: any | undefined;
  @Input() altezza: any | undefined;

  public chartOption!: EChartsOption; // <--- rimuovere il public
  public chartOption2!: EChartsOption;
  public chartOption3!: EChartsOption;
  public chart: any;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.updateValues()
  }

  ngOnInit() {}

  async updateValues() {
    if (this.grafici!== undefined) {
      this.chartOption = this.grafici
    }
  }

}
