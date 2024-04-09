import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CampPage } from './camp.page';

describe('CampPage', () => {
  let component: CampPage;
  let fixture: ComponentFixture<CampPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(CampPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
