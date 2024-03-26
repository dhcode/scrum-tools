import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionMasterViewComponent } from './session-master-view.component';

describe('SessionMasterViewComponent', () => {
  let component: SessionMasterViewComponent;
  let fixture: ComponentFixture<SessionMasterViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SessionMasterViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
