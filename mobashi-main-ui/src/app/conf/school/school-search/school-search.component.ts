import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchbarCustomEvent, SearchbarInputEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-school-search',
  templateUrl: './school-search.component.html',
  styleUrls: ['./school-search.component.scss'],
})
export class SchoolSearchComponent implements OnInit {
  filteredObjects: any[] = [];

  @Input() objects: any[] = [];
  @Input() title: string | undefined;

  @Output() objectSelected = new EventEmitter<any | null>();

  constructor() { }

  ngOnInit() {
    this.filteredObjects = [...this.objects];
  }

  searchbarInput(ev: SearchbarCustomEvent) {
    const search = ev.target.value;

    if (!search) {
      this.filteredObjects = [...this.objects];
    } else {
      this.filteredObjects = this.objects.filter((object) => {
        return object.name.toLowerCase().includes(search.toLowerCase());
      });
    }
  }

  track(index: number, object: any) {
    return object.id;
  }

  selected(object: any) {
    this.objectSelected.emit(object);
  }

  cancel() {
    this.objectSelected.emit(null);
  }
}
