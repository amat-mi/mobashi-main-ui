import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { translate } from '@ngneat/transloco';
import { ToastService } from 'src/app/contrib/core/toast.service';

@Component({
  selector: 'app-cascho-view',
  templateUrl: './cascho-view.component.html',
  styleUrls: ['./cascho-view.component.scss'],
})
export class CaschoViewComponent implements OnInit {
  @Input() object: any;
  @Output() closed = new EventEmitter();

  constructor(
    private toastService: ToastService
  ) { }

  ngOnInit() { }

  copy(url: string) {
    window.getSelection()?.selectAllChildren(document.getElementById('url')!);
    document.execCommand("copy");     //this is deprecated, but Angular/cdk Clipboard use it too...
    window.getSelection()?.removeAllRanges();
    this.toastService.presentWithColor(`${translate('DEF.COPIED')}: ${url}`, 'success');
  }

  close() {
    this.closed.emit();
  }
}
