import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SchoolPage } from './school.page';

describe('SchoolPage', () => {
  let component: SchoolPage;
  let fixture: ComponentFixture<SchoolPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(SchoolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
