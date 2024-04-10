import { Component, Input, OnInit } from '@angular/core';
import { LangService } from 'src/app/contrib/lang/lang.service';
import { CaschoService } from '../cascho.service';
import { Observable } from 'rxjs';
import { translate } from '@ngneat/transloco';
import { AlertService } from 'src/app/contrib/core/alert.service';

@Component({
  selector: 'app-cascho-campaign',
  templateUrl: './cascho-campaign.component.html',
  styleUrls: ['./cascho-campaign.component.scss'],
})
export class CaschoCampaignComponent implements OnInit {
  objects$!: Observable<any[]>;
  readonly perms$ = this.service.perms$;
  schools$!: Observable<any[]>;
  viewSchools: any;
  viewObject: any;

  @Input() campaign!: any;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    private alertService: AlertService,
    private service: CaschoService,
  ) {
    this.service.ensure();
  }

  ngOnInit() {
    this.objects$ = this.service.byCampaign(this.campaign);
    this.schools$ = this.service.schoolsNotInCampaign(this.campaign);
  }

  async delete(ev: any, object: any) {
    ev.preventDefault();      //MUST do this!!!
    ev.stopPropagation();     //MUST do this!!!

    const message1 = translate('CONF.DELETE1', { OBJECT: object.name });
    const yesClass = 'button-negative';
    if (await this.alertService.confirm(message1, yesClass)) {
      const message2 = translate('CONF.DELETE2', { OBJECT: object.name });

      if (await this.alertService.confirm(message2, yesClass)) {
        this.service.delete(object);
      };
    }
  }

  selected(object: any, campaign: any) {
    console.log(object);

    if (!!object)                   //it's null when modal is closed without selection
      this.service.save({
        campaign: campaign.id,
        school: object.id
      });
  }

  showModalView(canView: boolean, object: any, modalView: any) {
    if (canView) {
      this.viewObject = object;
      modalView.present();
    }
  }
}
