import { Component, OnInit } from '@angular/core';
import { CityService } from '../city/city.service';
import { ConfService } from './conf.service';
import { ActivatedRoute } from '@angular/router';
import { LangService } from '../contrib/lang/lang.service';

@Component({
  selector: 'app-conf-menu',
  templateUrl: './conf-menu.component.html',
  styleUrls: ['./conf-menu.component.scss'],
})
export class ConfMenuComponent implements OnInit {
  readonly selectedCity$ = this.cityService.selectedCity$
  readonly menuData$ = this.service.menuData$;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    private cityService: CityService,
    public activatedRoute: ActivatedRoute,
    private service: ConfService,
  ) { }

  ngOnInit() { }

}
