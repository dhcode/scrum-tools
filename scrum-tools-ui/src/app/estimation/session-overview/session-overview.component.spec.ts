import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionOverviewComponent } from './session-overview.component';
import { GraphQLModule } from '../../graphql.module';

describe('SessionOverviewComponent', () => {
  let component: SessionOverviewComponent;
  let fixture: ComponentFixture<SessionOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GraphQLModule],
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
