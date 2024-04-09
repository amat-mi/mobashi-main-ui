import { Component, OnInit } from '@angular/core';
import { LangService } from '../contrib/lang/lang.service';
import { DashService } from './dash.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-dash',
  templateUrl: './dash.page.html',
  styleUrls: ['./dash.page.scss'],
})
export class DashPage implements OnInit {
  readonly dash$ = this.service.dashByCampaignUUID(this.route.paramMap, 'id');

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    private route: ActivatedRoute,
    private service: DashService,
  ) {
    this.service.ensure();
  }

  async ngOnInit() { }
}
