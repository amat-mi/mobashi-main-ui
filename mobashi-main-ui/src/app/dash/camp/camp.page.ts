import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import { LangService } from 'src/app/contrib/lang/lang.service';
import { DashService } from '../dash.service';
import { Observable, combineLatest, map } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { translate } from '@ngneat/transloco';

@Component({
  selector: 'app-camp',
  templateUrl: './camp.page.html',
  styleUrls: ['./camp.page.scss'],
})
export class CampPage implements OnInit {
  readonly dash$ = this.service.dashByCampaignUUID(this.route.paramMap, 'id');
  readonly dashheat$ = this.service.dashheatByCampaignUUID(this.route.paramMap, 'id');
  readonly dashlink$ = this.service.dashlinkByCampaignUUID(this.route.paramMap, 'id');

  // observable locale
  readonly data$: Observable<any> | undefined;
  readonly dataSchool$: Observable<any> | undefined;
  readonly dataSetAll$: Observable<any> | undefined;
  //readonly dataLink$: Observable<any> | undefined;

  schools: any[];
  schoolsGeojson!: any; // <--- da considerare come se fosse una temp
  schoolsTemp: any[];
  schoolsGeojsonTemp!: any[];

  dashheat: any[];
  dashheatGeojson!: any;
  layers: Layer[];
  grafici!: Grafici;
  // sezione filtri -----------------
  defaultSeg: string;
  filtersTemp!: any[];
  filtersFromServer!: any[];
  // --------------------------
  viaggi!: any[];
  viaggiTemp!: any[];
  // --------------------------
  link!: any[];
  linkTemp!: any[];
  // 
  indiciDashboard!: any;
  indiciDashboardTemp!: any;
  cchange: number;

  public metriche!: Metriche;
  modalSeg01: string;
  modalSeg02: string;
  modalSeg03: string;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    private route: ActivatedRoute,
    private service: DashService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController

  ) {
    this.service.ensure();
    this.filtersTemp = [];
    this.filtersFromServer = [];
    this.schools = [];
    this.schoolsTemp = [];
    this.dashheat = [];
    this.cchange = 0;
    this.modalSeg01 = translate('DASH.CAMP.MODALFILTRI.SEGMENT01');
    this.modalSeg02 = translate('DASH.CAMP.MODALFILTRI.SEGMENT02');
    this.modalSeg03 = translate('DASH.CAMP.MODALFILTRI.SEGMENT03');
    this.defaultSeg = this.modalSeg01;

    // preparo le options degli strati cartografici lasciando i layer come array vuoti
    this.layers = [
      {
        name: 'heatMap',
        type: 'points',
        color: 'rgb(178,24,43)',
        icon: 'finger-print-outline',
        legendTitle: translate('DASH.CAMP.BOXLEGENDA.ORIGINI'),
        zoom: false,
        pop: false,
        detail: false,
        detailShow: null,
        data: { type: "FeatureCollection", features: [] },
        options: {
          'id': 'heatMap',
          'source': 'heatMap',
          'type': 'heatmap',
          'paint': {
            // Increase the heatmap weight based on frequency and property magnitude
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'flow'],
              0,
              0,
              2,
              1
            ],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              1,
              15,
              3
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(33,102,172,0)',
              0.2,
              'rgb(103,169,207)',
              0.4,
              'rgb(209,229,240)',
              0.6,
              'rgb(253,219,199)',
              0.8,
              'rgb(239,138,98)',
              1,
              'rgb(178,24,43)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              2,
              9,
              20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              1,
              22,
              0
            ]
          }
        }
      },
      {
        name: 'link',
        "type": "line",
        color: '#770000',
        icon: 'git-merge-outline',
        legendTitle: translate('DASH.CAMP.BOXLEGENDA.CARICHI'),
        zoom: false,
        pop: false,
        detail: true,
        detailShow: [],
        data: { type: "FeatureCollection", features: [] },
        options: {
          'id': 'link',
          'source': 'link',
          "type": "line",
          'layout': {
            'line-join': 'round',
            'line-cap': 'round',
          },
          'paint': {
            'line-width': 5,
            // Use a get expression (https://docs.mapbox.comhttps://docs.mapbox.com/style-spec/reference/expressions/#get)
            // to set the line-color to a feature property value.
            //'line-color': ['get', 'flow'],
            // 'line-gradient' must be specified using an expression
            // with the special 'line-progress' property
            'line-color': [
              'interpolate',
              ['linear'],
              ['get', 'flow'],
              0, '#333',
              5, 'blue',
              10, 'yellow',
              20, 'orange',
              100, 'red',
            ]
          }
        },
      },
      {
        name: 'scuole',
        type: 'points',
        color: '#111',
        icon: 'business-outline',
        legendTitle: translate('DASH.CAMP.BOXLEGENDA.SCUOLE'),
        zoom: true,
        pop: true,
        detail: false,
        detailShow: null,
        data: { type: "FeatureCollection", features: [] },
        options: {
          'id': 'scuole',
          'source': 'scuole',
          'type': 'symbol',
          //'type': 'circle',
          //
          'layout': {
            'icon-image': 'istituto',
            'icon-size': 0.75
          },

          'visibility': 'visible',
          /*
          'paint': {
            'circle-radius': 15,
            'circle-color': '#666a86',
            'circle-opacity': 1, 
          }
          */
        }
      }
    ];

    this.dataSetAll$ = combineLatest([this.dash$, this.dashheat$, this.dashlink$]).pipe(
      map(([dash, heat, link]) => {
        const schools = dash?.schools ?? [];
        this.addFiltroFromServer(schools, this.modalSeg01, 'id', 'name', 0);
        this.addFiltroFromServer(heat, this.modalSeg02, 'mode', 'mode', 1);
        this.addFiltroFromServer(heat, this.modalSeg03, 'dir', 'dir', 0);
        // -| salvo filtri di base |--------------------
        this.filtersTemp = _.cloneDeep(this.filtersFromServer);
        // -| Preparo le scuole e salvo il dato di base |--------------------
        this.schools = schools;
        //console.log(this.schools);
        this.schoolsTemp = _.cloneDeep(this.schools);
        // -| Preparo i viaggi e salvo il dato di base |--------------------
        this.viaggi = heat;
        this.viaggiTemp = _.cloneDeep(this.viaggi);
        // -| Preparo le singole tratte dei viaggi e salvo il dato di base |--------------------
        this.link = link;
        this.linkTemp = _.cloneDeep(this.link);
        // applico i filtri -----------------------
        this.filtraElementi();
        // -| Preparo indici, grafici e layer cartografici |----------------------
        this.preparaIndici(this.viaggiTemp, this.schoolsTemp)
        this.preparaGrafici(this.schoolsTemp, this.viaggiTemp);
        this.preparaLayerCartografici(this.schoolsTemp, this.linkTemp, this.viaggiTemp);
        // ---------------------------------
        return true;
      })
    )
  }


  getSchool(ids:number) {
    //console.log(ids)
    //console.log('SCUOLE', this.schools)

    let s = _.find(this.schools, {'id' : ids});
    //console.log(s)
    return s.name
  }

  preparaGrafici(schools: any[], viaggi: any[]) {
    //console.log(this.indiciDashboard.distribuzioneTappeModo)
    //console.log(_.map(this.indiciDashboard.distribuzioneTappeModo, 'name'))

    this.grafici = {
      tortaScuole: {
        title: {
          text: translate('DASH.CAMP.GRAPH.VIAGGISCUOLE.TITLE'),
          subtext: translate('DASH.CAMP.GRAPH.VIAGGISCUOLE.SUBTITLE'),
          left: 'center'
        },
        grid: {
          left: '0px',
          right: '5%',
          bottom: '10%'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        /*        legend: {
                  orient: 'vertical',
                  left: 'left',
                  bottom: '5%',
                  data: schools.map((s: { name: any; }) => s.name)
                },
        */
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: 'Area Mode',
            type: 'pie',
            radius: [40, 180],
            center: ['50%', '55%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            // rivedere _.uniq su school_id e poi la len del vettore
            data: _.map(Object.keys(_.groupBy(viaggi, 'school_id')), (item) => {
              return { 'name': _.find(schools, { id: parseInt(item) }).name, 'value': _.groupBy(viaggi, 'school_id')[item].length }
            })
          }
        ]
      },
      barreScuoleTempi: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // Usa l'asse per il tooltip
            type: 'shadow'        // Tipo di indicatore: ombra
          }
        },
        title: {
          text: translate('DASH.CAMP.GRAPH.VIAGGISCUOLETEMPI.TITLE'),
          subtext: translate('DASH.CAMP.GRAPH.VIAGGISCUOLETEMPI.SUBTITLE'),
          left: 'center'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: false },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value', // Asse X come valore (orizzontale)
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category', // Asse Y come categoria (per barre orizzontali)
          data: schools.map((s: { name: any; time: any; }) => {
            let out = s.name
            return out
          })
        },
        series: [
          {
            type: 'bar', // Tipo di grafico: barra
            data: schools.map((s: { name: any; time: any; }) => {
              let out = Math.round(s.time * 10) / 10
              return out
            })
          }
        ]
      },
      barreScuoleKm: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // Usa l'asse per il tooltip
            type: 'shadow'        // Tipo di indicatore: ombra
          }
        },
        title: {
          text: translate('DASH.CAMP.GRAPH.VIAGGISCUOLEDISTANZE.TITLE'),
          subtext: translate('DASH.CAMP.GRAPH.VIAGGISCUOLEDISTANZE.SUBTITLE'),
          left: 'center'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: false },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value', // Asse X come valore (orizzontale)
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category', // Asse Y come categoria (per barre orizzontali)
          data: schools.map((s: { name: any; time: any; }) => {
            let out = s.name
            return out
          })
        },
        series: [
          {

            type: 'bar', // Tipo di grafico: barra
            data: schools.map((s: { name: any; dist: any; }) => {
              let out = Math.round(s.dist * 10) / 10
              return out
            })
          }
        ]
      },
      distribuzioneScuoleDist_01: {
        title: {
          text: translate('DASH.CAMP.GRAPH.DISTRIBDIST.TITLE'),
          subtext: translate('DASH.CAMP.GRAPH.DISTRIBDIST.SUBTITLE'),
          left: 'center'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: Object.keys(_.groupBy(viaggi, 'mode'))
        },
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: false },
            saveAsImage: { show: true }
          }
        },
        xAxis: {},
        yAxis: {},
        series: _.map(_.groupBy(viaggi, 'mode'), obj => {
          let out = {
            name: obj[0].mode,
            symbolSize: 10,
            data: _.map(obj, o => { return [o.trav_dist, Math.round(o.trav_time * 10 / 60) / 10] }),
            type: 'scatter',
          };
          //console.log(out);
          return out;
        })
      },
      tortaModi: {
        title: {
          text: translate('DASH.CAMP.GRAPH.VIAGGITORTAMODI.TITLE'),
          subtext: translate('DASH.CAMP.GRAPH.VIAGGITORTAMODI.SUBTITLE'),
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params: any) {
            // params è un oggetto o un array di oggetti che contiene i dati relativi al punto dati su cui si trova il tooltip
            // Puoi destrutturare params per ottenere direttamente le parti che ti interessano
            let { seriesName, name, value, percent } = params;
            // Assicurati che value sia una stringa per poter eseguire la sostituzione
            let valueAsString = value.toString();
            // Sostituisci il punto con la virgola
            let valueWithComma = valueAsString.replace('.', ',');
            // Costruisci la stringa del tooltip come preferisci
            return `${seriesName} <br/>${name} : ${valueWithComma} [Km] (${percent}%)`;
          }

          //'{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: _.map(this.indiciDashboard.distribuzioneTappeModo, 'name')//Object.keys(distribuzioneTappeModo)
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: 'Area Mode',
            type: 'pie',
            radius: '50%',
            //center: ['75%', '50%'],
            //roseType: 'area',
            data: this.indiciDashboard.distribuzioneTappeModo//Object.entries(distribuzioneTappeModo).map(([name, value]) => ({ name, value }))
          }
        ]
      },
      barreScuoleDirezione: {
        grid: {
          left: '3%',
          right: '5%',
          bottom: '0%',
          top: '0%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: false },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: 'value', // Asse Y come categoria (per barre orizzontali)
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },

        },
        yAxis: {
          type: 'category', // Asse X come valore (orizzontale)
          data: _.map(this.indiciDashboard.totaleViaggiPerDirezione, 'name')
        },
        series: [
          {
            type: 'bar',
            data: _.map(this.indiciDashboard.totaleViaggiPerDirezione, 'value')
          }
        ]
      }
    };

  }

  preparaLayerCartografici(schools: any[], link: any[], viaggi: any[]) {

    const regex = /POINT \(([-\d.]+) ([-\d.]+)\)/;
    this.dashheatGeojson = {
      "type": "FeatureCollection",
      "features": viaggi.map(d => {
        return {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [parseFloat(d.geom.match(regex)[1]), parseFloat(d.geom.match(regex)[2])]
          },
          "properties": {
            "trav_dist": d.trav_dist,
            "trav_time": d.trav_time,
            "campaign_id": d.campaign_id,
            "extid": d.extid,
            "flow": d.flow,
            "direction": d.dir,
            "mode": d.mode,
            "school_id": d.school_id
          }
        }
      })
    }

    link[0].data.features.forEach((f: any) => {
      let sum = _.sumBy(f.properties.data, 'flow');
      f.properties['flow'] = _.sumBy(f.properties.data, 'flow');
      f.properties['color'] = sum > 10 ? '#ff0000' : '#999999'
    })


    // prepara geoJson // ---------
    this.schoolsGeojson = {
      "type": "FeatureCollection",
      "features": schools.map((s: { lng: any; lat: any; address: any; name: any; code: any; flow: any; }) => {
        return {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [s.lng, s.lat]
          },
          "properties": {
            "address": s.address,
            "name": s.name,
            "code": s.code,
            "flow": s.flow
          }
        }
      })
    }

    // | Vettore Layer | ---------------
    //console.log('^___^')
    this.layers.forEach(l => {
      if (l.name == 'heatMap') {
        l.data = this.dashheatGeojson;
      }
      if (l.name == 'scuole') {
        l.data = this.schoolsGeojson;
      }
      if (l.name == 'link') {
        l.data.features = link[0].data.features; // <<--- ??? 
        l.detailShow = schools;
      }
    })
    this.cchange = this.cchange + 1;

  }

  preparaIndici(viaggi: any[], schools: any[]) {
    //console.log(schools)
    //console.log(viaggi)
    let x = _.mapValues(_.groupBy(viaggi, 'dir'), gruppo => _.sumBy(gruppo, 'flow'));
    let y = _.map(Object.keys(x), (item) => {
      return {
        name: item === '0' ? translate('DASH.CAMP.MODALFILTRI.DIR1') : translate('DASH.CAMP.MODALFILTRI.DIR2'),
        value: x[item]
      }
    }
    )
    //console.log(y)

    // Esempio di utilizzo
    let linkPivot01 = _.flatMap(this.linkTemp[0].data.features
      .map((f: any) => {
        let out = f.properties.data.map((obj: any) => (
          {
            ...obj,
            'dist': obj.flow * f.properties.trav_dist / 1000 // qua sostituisco con il nuovo campo
          }))
        return out;
      }
      ))
    //console.log(linkPivot01);
    let linkPivot = _.groupBy(linkPivot01, 'mode');
    // --------------------------------------
    this.indiciDashboard = {
      viaggiTempiMedi: _.meanBy(viaggi, 'trav_time') / 60, // occhio che non sto moltiplicando per il flow
      viaggiTempiMax: _.maxBy(viaggi, 'trav_time')?.trav_time / 60, // occhio che non sto moltiplicando per il flow
      viaggiTempiMin: _.minBy(viaggi, 'trav_time')?.trav_time / 60, // occhio che non sto moltiplicando per il flow
      viaggiDistanzaMedi: Math.round(_.meanBy(viaggi, 'trav_dist') * 10 / 1000) / 10, // occhio che non sto moltiplicando per il flow
      viaggiDistanzaMax: _.maxBy(viaggi, 'trav_dist')?.trav_dist / 1000, // occhio che non sto moltiplicando per il flow
      viaggiDistanzaMin: _.minBy(viaggi, 'trav_dist')?.trav_dist / 1000, // occhio che non sto moltiplicando per il flow
      totaleViaggiRilevati: _.sumBy(viaggi, 'flow'), // Spostamenti casa.scuola totali 
      totaleViaggiRilevatiAndata: _.sumBy(_.filter(viaggi, { 'dir': 0 }), 'flow'), // occhio che non sto moltiplicando per il flow
      totaleViaggiRilevatiRitorno: _.sumBy(_.filter(viaggi, { 'dir': 1 }), 'flow'), // occhio che non sto moltiplicando per il flow
      totaleViaggiPerDirezione: _.map(Object.keys(x), (item) => {
        return {
          name: item === '0' ? translate('DASH.CAMP.MODALFILTRI.DIR1') : translate('DASH.CAMP.MODALFILTRI.DIR2'),
          value: x[item]
        }
      }
      ),
      totaleViaggiAttesi: _.sumBy(schools, 'expects'), // questi sono tutti i viaggi
      totaleStudenti: _.sumBy(schools, 'students'), // questi sono tutti i viaggi
      totaleIntervisteEffettuate: _.sumBy(schools, 'surveys'), // queste sono tutte le survey
      distribuzioneViaggiPerScuola: _.mapValues(_.groupBy(viaggi, 'school_id'), gruppo => _.sumBy(gruppo, 'flow')),
      distribuzioneTempiPerScuola: _.mapValues(_.groupBy(viaggi, 'school_id'), gruppo => _.sumBy(gruppo, 'trav_time')),
      // --- Array delle distanze (non è una distrib)
      distribuzioneDistanzaPerScuola: _.mapValues(_.groupBy(viaggi, 'school_id'), gruppo => _.sumBy(gruppo, 'trav_dist')),
      distribuzioneViaggiModo: _.mapValues(_.groupBy(viaggi, 'mode'), gruppo => _.sumBy(gruppo, 'flow')),
      distribuzioneTappeModo: _.map(Object.keys(linkPivot), (item) => { return { name: item, value: Math.round(_.sumBy(linkPivot[item], 'dist') * 10) / 10 } })
    }
    //console.log(_.mapValues(_.groupBy(viaggi, 'modes'), gruppo => _.sumBy(gruppo, 'flow')))
    this.indiciDashboard.rapportViaggiRilevati = this.indiciDashboard.totaleIntervisteEffettuate / this.indiciDashboard.totaleViaggiAttesi * 100;
    // -- Aggiungo info alle scuole ------------------
    this.schoolsTemp = schools.map((s: any) => {
      //console.log(s)
      s['flow'] = this.indiciDashboard.distribuzioneViaggiPerScuola[s.id];
      s['time'] = this.indiciDashboard.distribuzioneTempiPerScuola[s.id] / this.indiciDashboard.distribuzioneViaggiPerScuola[s.id] / 60;
      s['dist'] = this.indiciDashboard.distribuzioneDistanzaPerScuola[s.id] / this.indiciDashboard.distribuzioneViaggiPerScuola[s.id] / 1000;
      return s;
    });
  }

  addFiltroFromServer(dataset: any, nomeFiltro: string, id: string, descr: string, prcss: number) {
    // mtto una toppa per distinguere se deve verificare un array o meno
    //console.log(dataset)
    if (prcss === 0) {
      let fData = _.uniqWith(_.map(dataset, obj => {
        //console.log({class: obj[id], title: obj[descr]})
        return { class: obj[id], title: obj[descr] }
      }), (a, b) => a.class === b.class && a.title === b.title);
      let f = {
        filtersSeg: nomeFiltro,
        filtersClass: _.map(fData, (obj: any) => {
          return { class: obj.class, title: obj.title, visible: true, selected: true }
        })
      };
      if (_.find(this.filtersFromServer, obj => obj.filtersSeg === nomeFiltro) === undefined) {
        this.filtersFromServer.push(f);
      } else {
        // ??????????????????????????????
      }
    };
    if (prcss === 1) {
      let fData = _.uniq(_.flatMap(dataset, obj => obj.modes));
      let f = {
        filtersSeg: nomeFiltro,
        filtersClass: _.map(fData, (obj: string) => {
          return { class: obj, title: obj, visible: true, selected: true }
        })
      };
      if (_.find(this.filtersFromServer, obj => obj.filtersSeg === nomeFiltro) === undefined) {
        this.filtersFromServer.push(f);
      } else {
        // ??????????????????????????????
      }
    };

    // correggo a mano il descrittore del tipo viaggio (andata o ritorno). da valutare se aggiungerlo lato server
    this.filtersFromServer.forEach(f => {
      if (f.filtersSeg === this.modalSeg03) {
        f.filtersClass = f.filtersClass.map((fc: any) => {
          fc.title = fc.title === 0 ? translate('DASH.CAMP.MODALFILTRI.DIR1') : translate('DASH.CAMP.MODALFILTRI.DIR2'); // <---------- ANDATA è 0 ???
          return fc;
        })
      }
    })
    // ---------------------------------------
    //console.log(this.filters)
  }

  filtraElementi() {
    this.schoolsTemp = _.cloneDeep(this.schools)
    this.viaggiTemp = _.cloneDeep(this.viaggi);
    this.linkTemp = _.cloneDeep(this.link);
    // 1 -Filtro i link
    // controllare che il filtro venga applicato su tutti e 3 gli elementi
    this.linkTemp[0].data.features = this.filtraElementiDaVettoreGeom5(this.linkTemp[0]?.data.features, this.filtersTemp);
    // estraggo link delle scuole restanti
    let modeInLinkTemp = _.uniq(_.map(_.flatMap(this.linkTemp[0].data.features.map((f: any) => { return f.properties.data; })), 'mode'));
    let schoolInLinkTemp = _.uniq(_.map(_.flatMap(this.linkTemp[0].data.features.map((f: any) => { return f.properties.data; })), 'school_id'));
    let dirInLinkTemp = _.uniq(_.map(_.flatMap(this.linkTemp[0].data.features.map((f: any) => { return f.properties.data; })), 'dir'));

    // 2 - Filtro le schools - esclusivamente in base alla presenza nel vettore filtri delle scuole
    let idScuole = _.compact(_.map(_.find(this.filtersTemp, { filtersSeg: this.modalSeg01 }).filtersClass, (item: any) => {
      if (item.selected) { return item.class }
    }));
    this.schoolsTemp = _.filter(this.schoolsTemp, (obj) => _.includes(idScuole, obj.id));
    // 3 - filtro le origini dei viaggi su: school, modi e direzioni
    this.viaggiTemp = _.compact(_.map(this.viaggiTemp, (viaggi) => {
      if (
        _.includes(schoolInLinkTemp, viaggi.school_id)
        &&
        _.some(modeInLinkTemp, (item) => _.includes(viaggi.modes, item))
        &&
        _.includes(dirInLinkTemp, viaggi.dir)
      ) {
        return viaggi
      }
    }))


    return true;
  }

  filtraElementiDaVettoreGeom5(features: any, filtri: any) {
    if (!Array.isArray(features)) {
      return [];
    }

    // Preparare i criteri di filtraggio basati sui filtri per 'school_id' e 'mode'
    const filtriScuole = filtri.find((f: any) => f.filtersSeg === this.modalSeg01)?.filtersClass.filter((f: any) => f.selected).map((f: any) => f.class) || [];
    const filtriModi = filtri.find((f: any) => f.filtersSeg === this.modalSeg02)?.filtersClass.filter((f: any) => !f.selected).map((f: any) => f.class) || [];
    const filtriDir = filtri.find((f: any) => f.filtersSeg === this.modalSeg03)?.filtersClass.filter((f: any) => !f.selected).map((f: any) => f.class) || [];

    return features.reduce((filteredFeatures, feature) => {
      if (!feature.properties || !Array.isArray(feature.properties.data)) {
        return filteredFeatures;
      }

      const filteredData = feature.properties.data.filter((d: { school_id: any; mode: any; dir: any; }) => {
        const scuolaOk = filtriScuole.includes(d.school_id);
        const modoOk = !filtriModi.includes(d.mode);
        const dirOk = !filtriDir.includes(d.dir);
        return scuolaOk && modoOk && dirOk;
      });

      if (filteredData.length > 0) {
        const updatedFeature = { ...feature, properties: { ...feature.properties, data: filteredData } };
        filteredFeatures.push(updatedFeature);
      }

      return filteredFeatures;
    }, []);
  }


  ngOnInit() {

  }


  // --| Modal Filtri |-----------------------------------
  onWillDismissFiltri($event: any) {
    //console.log($event);
  }

  closeModalFiltri() {
    //console.log('chiudi modal filtri');
    // ----------------------
    this.modalCtrl.dismiss(null, 'cancel');
  }

  resetFilter() {
    // ---------------------
    this.filtersTemp = _.cloneDeep(this.filtersFromServer);
    // ------------------
    this.applicaFiltri()
    // -------------------------------
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async applicaFiltri() {
    const loading = await this.loadingCtrl.create({
      message: 'Dismissing after 3 seconds...',
      duration: 3000,
    });
    loading.present();
    // filtro
    //console.log('01 - filtro elementi')
    this.filtraElementi();
    // creo indici
    //console.log('02 - preparo indici')
    this.preparaIndici(this.viaggiTemp, this.schoolsTemp)
    // preparo grafici
    //console.log('03 - preparo grafici')
    this.preparaGrafici(this.schoolsTemp, this.viaggiTemp);
    // preparo cartografia
    //console.log('04 - preparo cartografia')
    this.preparaLayerCartografici(this.schoolsTemp, this.linkTemp, this.viaggiTemp);
    // chiudo modal
    //console.log('05 - chiudo modal')
    this.modalCtrl.dismiss(null, 'cancel');
    // --------------
    loading.dismiss();
  }

  resetClassAll(classe: string, val: boolean) {
    //console.log(classe, val, this.filtersTemp)
    _.forEach(_.find(this.filtersTemp, { filtersSeg: classe }).filtersClass, (filtro) => {
      filtro.selected = val;
    })
  }

  assegnaStato(array: any[], classe: string, tf: boolean): any[] {
    return array.map(item => {
      if (item.filtersSeg === classe) {
        //console.log('resetto' + classe + tf )
        const filtersClass = item.filtersClass.map((valore: any) => {
          return Object.assign({}, valore, { selected: tf });
        });
        return Object.assign({}, item, { filtersClass });
      } else {
        return item;
      }
    });
  }

}


export interface DataSet {
  key: string;
  value: any[];
}

export interface Layer {
  name: string;
  type: string;
  data: Geojson;
  options: any;
  color: string;
  legendTitle: string;
  icon: string;
  zoom: boolean;
  pop: boolean;
  detail: boolean;
  detailShow: DetailShow[] | null;
}

export interface DetailShow  {
  id: string; 
  descr: string; 
  f: boolean; 
  trasf : any;
}

export interface Geojson {
  type: string;
  features: any[];
}

export interface Metriche {
  viaggiTempiMedi: number | undefined;
  viaggiTempiMax: number | undefined;
  viaggiTempiMin: number | undefined;
  viaggiDistanzaMedi: number | undefined;
  viaggiDistanzaMax: number | undefined;
  viaggiDistanzaMin: number | undefined;
  totaleViaggiRilevati: number | undefined;
  totaleViaggiAttesi: number | undefined;
  rapportViaggiRilevati: number | undefined;
  distribuzioneViaggiPerScuola: any;
  distribuzioneTempiPerScuola: any;
  distribuzioneDistanzaPerScuola: any;
  distribuzioneViaggiModo: any;
  distribuzioneTappeModo: any;
}

export interface Grafici {
  tortaScuole: any;
  barreScuoleDirezione: any;
  barreScuoleTempi: any;
  //tortaScuoleKm: any;
  barreScuoleKm: any;
  tortaModi: any;
  distribuzioneScuoleDist_01: any;

}

export interface InputObject {
  [key: string]: {
    extid: string;
    campaign_id: number;
    school_id: number;
    mode: string;
    flow: number;
    min_trav_dist: number;
    max_trav_dist: number;
    avg_trav_dist: number;
    min_trav_time: number;
    max_trav_time: number;
    avg_trav_time: number;
    orig_geom: string;
    parse_avg_trav_dist: number;
  }[];
}