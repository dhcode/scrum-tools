import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionMemberViewComponent } from './session-member-view.component';

describe('SessionMemberViewComponent', () => {
  let component: SessionMemberViewComponent;
  let fixture: ComponentFixture<SessionMemberViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SessionMemberViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionMemberViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
