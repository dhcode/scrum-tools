import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionOverviewComponent } from './session-overview.component';

describe('SessionOverviewComponent', () => {
  let component: SessionOverviewComponent;
  let fixture: ComponentFixture<SessionOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SessionOverviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
