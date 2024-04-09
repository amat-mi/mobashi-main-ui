import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from 'src/app/conf/campaign/campaign.service';
import { LangService } from 'src/app/contrib/lang/lang.service';
import { ConfService } from '../../conf.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.page.html',
  styleUrls: ['./campaigns.page.scss'],
})
export class CampaignsPage implements OnInit {
  readonly objects$ = this.service.objects$;
  readonly perms$ = this.service.perms$;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    public activatedRoute: ActivatedRoute,
    private confService: ConfService,
    private service: CampaignService,
  ) {
    this.service.ensure();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.confService.setMenuData(this.activatedRoute.data);
  }
}
