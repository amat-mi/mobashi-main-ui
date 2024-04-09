import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LangService } from 'src/app/contrib/lang/lang.service';
import { ConfService } from '../../conf.service';
import { CampaignService } from '../campaign.service';
import { AlertService } from 'src/app/contrib/core/alert.service';
import { translate } from '@ngneat/transloco';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.page.html',
  styleUrls: ['./campaign.page.scss'],
})
export class CampaignPage implements OnInit {
  readonly objects$ = this.service.objects$;
  readonly object$ = this.service.campaignByID(this.activatedRoute.paramMap, 'id');
  editing: boolean = false;
  modified: boolean = false;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    public activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private confService: ConfService,
    private service: CampaignService,
  ) {
    this.service.ensure();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.confService.setMenuDataComplex(this.activatedRoute.data, this.objects$, '/conf/campaigns', { labelName: 'name' });
  }

  onStatus(status: any) {
    this.modified = status.modified;
  }

  async delete(object: any) {
    const message1 = translate('CONF.DELETE1', { OBJECT: object.name });
    const yesClass = 'button-negative';
    if (await this.alertService.confirm(message1, yesClass)) {
      const message2 = translate('CONF.DELETE2', { OBJECT: object.name });

      if (await this.alertService.confirm(message2, yesClass)) {
        this.service.delete(object, this.activatedRoute);
      };
    }
  }

  save(object: any) {
    this.editing = false;

    console.log('Edited object:', {
      id: object.id, // Keep original ID
      ...object, // Include all modified fields
    });

    this.service.save(object, this.activatedRoute);
  }

  undo(object: any) {
    this.editing = false;

    console.log('Undo object:', {
      id: object.id, // Keep original ID
      ...object, // Include all modified fields
    });
  }
}
