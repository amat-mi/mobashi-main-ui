import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { translate } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController
  ) { }

  public async alert(message: any, okClass?: string, options: Object = {}) {
    options = Object.assign({
      message: message,
      backdropDismiss: false,         //do NOT close by tapping the background
      buttons: [
        {
          text: translate('DEF.OK'),
          role: 'confirm',
          cssClass: okClass || 'button-positive',
        }
      ]
    }, options || {});

    const alert = await this.alertController.create(options);
    const res = alert.onDidDismiss().then((data) => data.role != 'cancel');
    await alert.present();

    return res;
  }

  public async confirm(message: any, positiveClass?: string, negativeClass?: string, options: { [key: string]: any } = {}) {
    options = Object.assign({
      header: translate('DEF.CONFIRM_ASK'),
      message: message,
      backdropDismiss: false,         //do NOT close by tapping the background
      buttons: [
        {
          text: translate('DEF.NO'),
          role: 'cancel',
          cssClass: negativeClass || 'button-neutral',
        },
        {
          text: translate('DEF.YES'),
          role: 'confirm',
          cssClass: positiveClass || 'button-positive',
        }
      ]
    }, options || {});

    //adjust options for buttons, in case caller only set their text
    if (!options['buttons'][0].role)
      options['buttons'][0].role = 'cancel';

    if (!options['buttons'][0].cssClass)
      options['buttons'][0].cssClass = negativeClass || 'button-neutral';

    if (!options['buttons'][1].role)
      options['buttons'][1].role = 'confirm';

    if (!options['buttons'][1].cssClass)
      options['buttons'][1].cssClass = positiveClass || 'button-positive';

    const alert = await this.alertController.create(options);
    const res = alert.onDidDismiss().then((data) => data.role != 'cancel');
    await alert.present();

    return res;
  }

  public async prompt(message: any, positiveClass?: string, negativeClass?: string, options: { [key: string]: any } = {}) {
    options = Object.assign({
      message: message,
      backdropDismiss: false,         //do NOT close by tapping the background
      inputs: [
        {
          name: 'input',
          type: 'text',
          id: 'input',
          value: '',
          placeholder: ''
        }
      ],
      buttons: [
        {
          text: translate('DEF.CANCEL'),
          role: 'cancel',
          cssClass: negativeClass || 'button-neutral',
        },
        {
          text: translate('DEF.OK'),
          role: 'confirm',
          cssClass: positiveClass || 'button-positive',
        }
      ]
    }, options || {});

    //adjust options for buttons, in case caller only set their text
    if (!options['buttons'][0].role)
      options['buttons'][0].role = 'cancel';

    if (!options['buttons'][0].cssClass)
      options['buttons'][0].cssClass = negativeClass || 'button-neutral';

    if (!options['buttons'][1].role)
      options['buttons'][1].role = 'confirm';

    if (!options['buttons'][1].cssClass)
      options['buttons'][1].cssClass = positiveClass || 'button-positive';

    const alert = await this.alertController.create(options);
    const res = alert.onDidDismiss().then((data) => data.role != 'cancel' ? data.data.values : null);

    await alert.present();

    return res;
  }

}
