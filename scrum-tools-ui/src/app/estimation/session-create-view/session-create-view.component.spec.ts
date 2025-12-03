import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionCreateViewComponent } from './session-create-view.component';
import { GraphQLModule } from '../../graphql.module';

describe('SessionCreateViewComponent', () => {
  let component: SessionCreateViewComponent;
  let fixture: ComponentFixture<SessionCreateViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GraphQLModule],
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
