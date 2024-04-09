import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';

import { ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import maplibregl, { GeoJSONSource, Map } from 'maplibre-gl';

import { LangService } from 'src/app/contrib/lang/lang.service';

import * as _ from "lodash";
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { translate } from '@ngneat/transloco';
import { MapService } from 'src/app/contrib/map/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    TranslocoModule,
    TranslocoLocaleModule,
  ],
})
export class MapComponent implements OnInit, OnChanges {


  @Input() idComp: string | undefined;
  @Input() layers: any[];
  @Input() cchange: number | undefined;

  map: Map | undefined;

  public loadingState: any;

  public isModalOpen!: boolean;
  public selectedFeature!: any;
  public legenda?: any[]
  public featuresDetailMap?: any;

  // --------
  public municipiGeojson: any;
  public detailTextBox: string;
  public detailTextBoxAll!: any;
  // -----
  public testInfo: string;
  public trLocali: any;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    public loadingController: LoadingController,
    private modalCtrl: ModalController,
    private service: MapService
  ) {
    this.layers = [];
    this.isModalOpen = false;
    this.detailTextBox = '';
    this.testInfo = '';
    this.trLocali = {
      modalClose: translate('DASH.CAMP.MAP.MODALCLOSE'),
      modal01: translate('DASH.CAMP.MAP.MODAL01'),
      modal02: translate('DASH.CAMP.MAP.MODAL02'),
      modal03: translate('DASH.CAMP.MAP.MODAL03')
    }

  }

  ngOnInit(): void {
    if (this.map) {
      this.map.resize()
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.layers?.forEach(l => {
      if (this.map !== undefined) {
        if (this.map.getSource(l.name) !== undefined) {
          ((this.map.getSource(l.name)) as GeoJSONSource).setData(l.data)
        }
      }
    })
  }

  nascondi(l: any) {
    if (this.map !== undefined) {
      if (this.map.getLayer(l.id) !== undefined) {
        if (l.visibile) {
          this.map.setLayoutProperty(l.id, 'visibility', 'none');
        }
        else {
          this.map.setLayoutProperty(l.id, 'visibility', 'visible');
        }

      }
    }
    l.visibile = !l.visibile;
  }

  // aggiungo funzione per il cambio dei valori 
  async campbioValore(data: any) {

  }

  ngAfterViewInit() {
    this.showLoading() // <-- ha un fliker di resize della mappa che nascondo con il loader
    //console.log('avvio')
    //console.log(this.layers)
    const initialState = { lng: 9.162753, lat: 45.4756844, zoom: 12 };
    this.map = new Map({
      container: '' + this.idComp,
      style: this.service.getStyle(),
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.on('load', () => {
      this.map?.loadImage(
        'assets/icon/istituto_g.png',
        (error, image: any) => {
          if (error) throw error;
          this.map?.addImage('istituto', image);
        }
      )

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      this.legenda = this.layers.map(l => {
        ///console.log(l);
        let vettore = _.cloneDeep(l);
        const step: { val: number; colore: string }[] = [];
        switch (vettore.name) {
          case 'heatMap': {
            break
          }
          case 'link': {
            let ridotto = (vettore.options.paint['line-color']).splice(3)
            for (let i = 0; i < ridotto.length; i += 2) {
              const val = ridotto[i];
              const colore = ridotto[i + 1];
              step.push({ val, colore });
            }
            break
          }
          case 'scuole': {
            break
          }
          default: {
            break
          }

        }
        return { classe: l.legendTitle, colore: l.color, icon: l.icon, visibile: true, id: l.options.id, step: step }
      }
      )
      this.layers?.forEach(l => {
        this.map?.addSource(l.name, {
          'type': 'geojson',
          'data': l.data ? l.data : {}
        });

        this.map?.addLayer(
          l.options,
        );

        this.map?.on('click', l.name, (e: any) => {
          if (l.detail) {
            this.isModalOpen = true;

            this.detailTextBox = '';
            _.forEach(_.keys(e.features[0].properties), el => {
              this.detailTextBox = this.detailTextBox + ', ' + e.features[0].properties[el];
            });

            //console.log(e.features[0].properties.data)
            let obb = _.map(JSON.parse(e.features[0].properties.data), (item: any) => {
              item.school_id = _.find(l.detailShow, { 'id': item.school_id }).name;
              item.dir = item.dir === 0 ? translate('DASH.CAMP.MODALFILTRI.DIR1') : translate('DASH.CAMP.MODALFILTRI.DIR2');
              //item = _.orderBy(item, 'school_id')
              return item
            })
            let out = _.map(_.groupBy(obb, 'school_id'), (value, key) => ({
              school_id: key,
              data: value.map(({ school_id, ...rest }) => rest)
            }));
            e.features[0].properties.data = out;
            this.detailTextBoxAll = e.features[0].properties;
          }

          let dest = {
            lat: 0,
            lng: 0
          }
          switch (e.features[0].geometry.type) {
            case 'LineString': {
              dest.lat = e.features[0].geometry.coordinates[0][1];
              dest.lng = e.features[0].geometry.coordinates[0][0];
              break
            }
            case 'Point': {
              dest.lat = e.features[0].geometry.coordinates[1];
              dest.lng = e.features[0].geometry.coordinates[0];
              break
            }
            case 'MultiLineString': {
              dest.lat = e.features[0].geometry.coordinates[0][0][1];
              dest.lng = e.features[0].geometry.coordinates[0][0][0];
              break
            }
            default: {
              break
            }

          }

          if (l.zoom) {
            this.map?.flyTo({
              //center: e.features[0].lngLat,
              center: dest,
              zoom: 18
            });

          } else {
            this.map?.flyTo({
              center: dest,
            });
          }
        })


        this.map?.on('mouseenter', l.name, (e: any) => {
          this.map!.getCanvas().style.cursor = 'pointer';
          if (l.pop) {
            //console.log(e);
            _.forEach(_.keys(e.features[0].properties), el => {
              this.testInfo = (this.testInfo === '' ? '' : this.testInfo + ', ') + e.features[0].properties[el];
            });
            //console.log(this.testInfo)
            //detailTextBox
          }

        });
        this.map?.on('mouseleave', l.name, () => {
          this.map!.getCanvas().style.cursor = '';
          if (l.pop) {
            this.testInfo = ''
          }
        });



      })



    })

    this.map?.addControl(new maplibregl.FullscreenControl());
    /*
    this.layers?.forEach(l => {
      console.log(l);
      (this.map?.getSource(l.name) as GeoJSONSource)?.setData(l.data)
    })
    */


    if (this.map) {
      this.map.once('load', () => {
        this.map?.resize(); // <-- anche se distruggo la mappa quando si riavvia necessita un resize
        this.loadingState.dismiss(); // <-- ha un fliker di resize della mappa che nascondo con il loader
      });

    }

  }


  ngOnDestroy() {
    this.map?.remove();
  }

  async showLoading() {
    this.loadingState = await this.loadingController.create({
      message: 'Sincronizzazione Dati',
      spinner: 'circles',
    });
    this.loadingState.present();
  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {
    this.isModalOpen = false;
  }



}


