import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DashPage } from './dash.page';

describe('DashPage', () => {
  let component: DashPage;
  let fixture: ComponentFixture<DashPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(DashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
