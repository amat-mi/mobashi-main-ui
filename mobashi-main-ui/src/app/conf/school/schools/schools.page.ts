import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LangService } from 'src/app/contrib/lang/lang.service';
import { ConfService } from '../../conf.service';
import { SchoolService } from 'src/app/conf/school/school.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.page.html',
  styleUrls: ['./schools.page.scss'],
})
export class SchoolsPage implements OnInit {
  readonly schools$ = this.service.schools$;
  readonly perms$ = this.service.perms$;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    public activatedRoute: ActivatedRoute,
    private confService: ConfService,
    private service: SchoolService,
  ) { 
    this.service.ensure();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.confService.setMenuData(this.activatedRoute.data);
  }
}
