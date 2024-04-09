import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CaschosPage } from './caschos.page';

describe('CaschosPage', () => {
  let component: CaschosPage;
  let fixture: ComponentFixture<CaschosPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(CaschosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
