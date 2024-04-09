import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CampaignPage } from './campaign.page';

describe('CampaignPage', () => {
  let component: CampaignPage;
  let fixture: ComponentFixture<CampaignPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(CampaignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
