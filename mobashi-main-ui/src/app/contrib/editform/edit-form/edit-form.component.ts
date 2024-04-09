import { AfterViewInit, Component, ContentChildren, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent implements OnInit, AfterViewInit, OnDestroy {
  data: any;
  initial: any;

  @Input() object: any;
  @Input() disabled: boolean = false;
  @Output() status = new EventEmitter<any>();

  @ContentChildren(NgModel, { descendants: true }) ngModels!: QueryList<NgModel>;
  @ViewChild(NgForm) public form!: NgForm;
  private formSubscription: Subscription | undefined;

  constructor() { }

  ngOnInit() {
    //initialize edit data as a deep clone of the input object
    //MUST do it here!!!
    this.data = !!this.object ? _.cloneDeep(this.object) : {};

    //convert all "datetime-local" to local time from UTC
    //HACK!!! Should use a better method than a fixed prefix, to know which properties to work on
    for (const key in this.data) {
      if (!key.startsWith("stamp_"))
        continue;

      let dt = new Date(this.data[key]);                                    //construct UTC Datetime
      dt = new Date(dt.valueOf() - dt.getTimezoneOffset() * 60000);       //convert to local
      this.data['DT_' + key] = new Date(dt).toISOString().slice(0, -1);    //remove the "Z" and set into edit data as "DT_"
    }
  }

  ngAfterViewInit() {
    //keep only edit data properties with same name as existing form controls,
    //MUST do it here!!!
    this.data = _.pick(this.data, this.ngModels.map((x) => x.name));

    //create a copy of the initial data (for undo support)
    //MUST do it here!!!
    this.initial = _.cloneDeep(this.data);

    //whenever the form value changes, emit a few properties
    this.formSubscription = this.form.valueChanges?.subscribe((value: any) => {
      this._emitStatus(value);
    });

    this.ngModels.forEach((model) => {
      this.form.addControl(model);
    });
  }

  ngOnDestroy() {
    if (this.formSubscription)
      this.formSubscription.unsubscribe;
  }

  private _emitStatus(value: any) {
    const res = {
      valid: this.form.valid,
      pristine: this.form.pristine,
      modified: !_.isEqual(value, this.initial)
    };
    this.status.emit(res);
  }

  public undo() {
    _.merge(this.data, this.initial);
    this._emitStatus(this.data);            //emit new status
  }

  public save() {
    _.merge(this.object, this.data);

    //convert all "datetime-local" fields to UTC
    //HACK!!! Should use a better method than a fixed prefix, to know which properties to work on
    for (const key in this.object) {
      if (!key.startsWith("DT_stamp_"))
        continue;

      //convert value from "DT_XXX" field to "XXX" field
      this.object[key.slice(3)] = new Date(this.object[key]).toISOString();
    }

    this.initial = _.cloneDeep(this.data);
    this._emitStatus(this.data);            //emit new status
  }
}
