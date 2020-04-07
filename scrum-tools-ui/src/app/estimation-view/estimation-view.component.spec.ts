import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationViewComponent } from './estimation-view.component';

describe('EstimationViewComponent', () => {
  let component: EstimationViewComponent;
  let fixture: ComponentFixture<EstimationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EstimationViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
