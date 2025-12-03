import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionJoinViewComponent } from './session-join-view.component';
import { GraphQLModule } from '@nestjs/graphql';
import { RouterTestingModule } from '@angular/router/testing';

describe('SessionJoinViewComponent', () => {
  let component: SessionJoinViewComponent;
  let fixture: ComponentFixture<SessionJoinViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GraphQLModule, RouterTestingModule],
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
