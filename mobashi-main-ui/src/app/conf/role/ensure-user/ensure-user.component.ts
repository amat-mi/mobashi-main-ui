import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LangService } from 'src/app/contrib/lang/lang.service';

@Component({
  selector: 'app-ensure-user',
  templateUrl: './ensure-user.component.html',
  styleUrls: ['./ensure-user.component.scss'],
})
export class EnsureUserComponent implements OnInit {
  readonly data: any = {};

  @Input() email: string | undefined;
  @Output() done = new EventEmitter();

  constructor(
    public tr: LangService,         //MUST be here and be public for template to use!!!
  ) { }

  ngOnInit() {
    if (this.data.kind == undefined)
      this.data.kind = 'principal';
    if (this.data.email == undefined)
      this.data.email = this.email;
  }

  cancel() {
    this.done.emit();
  }

  execute() {
    this.data.email = this.email;
    this.done.emit(this.data);
  }
}
