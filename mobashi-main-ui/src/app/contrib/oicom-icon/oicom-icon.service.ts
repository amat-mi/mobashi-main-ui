import { Injectable } from '@angular/core';

import { addIcons as ioniconsAddIcons } from 'ionicons';
import * as ionicons from 'ionicons/icons';       //ignore this error
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class OicomIconService {

  constructor() { }

  private _assignIcon(name: string, icon?: string) {
    return { [name]: ionicons[_.camelCase((icon || name)) as keyof typeof ionicons] };
  }

  public addIcons(icons: string[], prefer?: '' | 'outline' | 'sharp') {
    ioniconsAddIcons({
      ...icons.reduce((acc, name) => {
        return {
          ...acc,
          ...this._assignIcon(name, prefer ? `${name}-${prefer}` : name),
          ...this._assignIcon(`${name}-fill`, name),
          ...this._assignIcon(`${name}-outline`),
          ...this._assignIcon(`${name}-sharp`)
        }
      }, {}),
    });
  }

  public addCustomIcons(icons: string[], suffix?: '' | 'fill' | 'outline' | 'sharp',
    assetsPath: string = 'assets/icons/') {
    ioniconsAddIcons({
      ...icons.reduce((acc, name) => {
        if (suffix)
          name = `${name}-${suffix}`;

        return {
          ...acc,
          ...{ [name]: `${assetsPath}${name}.svg` }
        }
      }, {}),
    });
  };

}
