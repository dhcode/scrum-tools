import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCreateViewComponent } from './session-create-view.component';

describe('SessionCreateViewComponent', () => {
  let component: SessionCreateViewComponent;
  let fixture: ComponentFixture<SessionCreateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SessionCreateViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
