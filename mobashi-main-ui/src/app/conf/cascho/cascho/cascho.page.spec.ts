import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CaschoPage } from './cascho.page';

describe('CaschoPage', () => {
  let component: CaschoPage;
  let fixture: ComponentFixture<CaschoPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(CaschoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
