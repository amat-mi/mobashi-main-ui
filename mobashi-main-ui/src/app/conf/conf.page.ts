import { Component, OnInit } from '@angular/core';
import { CityService } from '../city/city.service';
import { LangService } from '../contrib/lang/lang.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfService } from './conf.service';

@Component({
  selector: 'app-conf',
  templateUrl: './conf.page.html',
  styleUrls: ['./conf.page.scss'],
})
export class ConfPage implements OnInit {
  readonly selectedCity$ = this.cityService.selectedCity$;
  readonly menuData$ = this.service.menuData$;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    public activatedRoute: ActivatedRoute,
    private service: ConfService,
    private cityService: CityService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.service.setMenuData(this.activatedRoute.data);
  }
}
