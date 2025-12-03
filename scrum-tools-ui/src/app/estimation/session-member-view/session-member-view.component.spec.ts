import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionMemberViewComponent } from './session-member-view.component';
import { GraphQLModule } from '../../graphql.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('SessionMemberViewComponent', () => {
  let component: SessionMemberViewComponent;
  let fixture: ComponentFixture<SessionMemberViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GraphQLModule, RouterTestingModule],
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
