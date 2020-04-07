import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationSessionsViewComponent } from './estimation-sessions-view.component';

describe('EstimationSessionsViewComponent', () => {
  let component: EstimationSessionsViewComponent;
  let fixture: ComponentFixture<EstimationSessionsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EstimationSessionsViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimationSessionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
