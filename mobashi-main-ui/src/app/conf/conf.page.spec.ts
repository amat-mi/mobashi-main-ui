import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfPage } from './conf.page';

describe('ConfPage', () => {
  let component: ConfPage;
  let fixture: ComponentFixture<ConfPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
