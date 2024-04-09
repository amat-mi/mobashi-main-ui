import { Injectable } from '@angular/core';

import * as _ from "lodash";


@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  public datasets!: DataSet[];
  /* NON USATO!!!  
    private dataSetsDetail: any[];*/

  constructor() {
    this.datasets = [];
    /* NON USATO!!!    
        this.dataSetsDetail = [
          { nomeFile: 'campaigns', estensioneFile: '.json', geom: false },
          { nomeFile: 'schools', estensioneFile: '.json', geom: false },
          { nomeFile: 'dashheat', estensioneFile: '.json', geom: false }
        ]*/
  }


  /* NON USATO!!!
    private async readJsonData(nomeFile: string, geo: boolean) {
      let geojson = { features: '', type: '' };
      await fetch("assets/localData/" + nomeFile + ".geojson").then(res => res.json()).then(json => {
        //console.log("OUTPUT: ", json);
        geojson.type = json.type
        geojson.features = json.features
        //console.log(geojson)
      });
      if (geo) {
        return geojson
      }
      else {
        return
      }
    } */

  public async readLocalData(nomeFile: string, estensioneFile: string, geo: boolean) {
    let data: any = [];

    if (!geo) {
      //console.log('dato non geografico')
      await fetch("assets/localData/" + nomeFile + estensioneFile).then(res => res.json()).then(json => {
        data = json
      });
    }
    else {
      //let geojson = { features: '', type: '' };  
      console.log('dato geografico. Da sistemare eventuale predisposizione del geoJson')
    }
    this.datasets.push({ key: nomeFile, value: data })
    return data;

  }

  // prelievo il dato da dove si trova e lo metto in locale 
  /* NON USATO!!!
    private async getData2Local() {
      this.dataSetsDetail.forEach(d => {
        this.readLocalData(d.nomeFile, d.estensioneFile, d.geom)
      })
  
    }*/

  // verifico che il dato sia presente in locale
  // non è robusta
  /* NON USATO!!!  
    private checkLocalData() {
      return (this.datasets.length > 0)
    }*/

  // localData da valutare locala storage per migliorare prestazioni
  // controllo che non sia gia presnte e lo metto in locale.
  /* NON USATO!!!  
    private async getLocalData() {
      if (this.datasets.length == 0) {
        console.log('Dato non presente. Lo carico.');
        await this.getData2Local();
      }
      //console.log(this.datasets);
      return this.datasets;
    }*/

  // filtro un certo dataset per una spcifica chiave 
  public async getLocalDataFiltered(keyData: string, uuid: string) {
    let data = _.find(this.datasets, { 'key': keyData })
    let f = await _.find(data!.value, { 'uuid': uuid })
    return f
  }



}



export interface DataSet {
  key: string;
  value: any[];
}