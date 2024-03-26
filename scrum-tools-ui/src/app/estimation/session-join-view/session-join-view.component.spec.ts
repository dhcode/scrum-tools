import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionJoinViewComponent } from './session-join-view.component';

describe('SessionJoinViewComponent', () => {
  let component: SessionJoinViewComponent;
  let fixture: ComponentFixture<SessionJoinViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SessionJoinViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionJoinViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
