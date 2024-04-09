import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LangService } from 'src/app/contrib/lang/lang.service';
import { ConfService } from '../../conf.service';
import { CaschoService } from '../cascho.service';

@Component({
  selector: 'app-caschos',
  templateUrl: './caschos.page.html',
  styleUrls: ['./caschos.page.scss'],
})
export class CaschosPage implements OnInit {
  readonly objects$ = this.service.objects$;
  readonly perms$ = this.service.perms$;

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
    public activatedRoute: ActivatedRoute,
    private confService: ConfService,
    private service: CaschoService,
  ) {
    this.service.ensure();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.confService.setMenuData(this.activatedRoute.data);
  }
}
