import { TestBed } from '@angular/core/testing';

import { EstimationService } from './estimation.service';
import { GraphQLModule } from '../../graphql.module';

describe('EstimationService', () => {
  let service: EstimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GraphQLModule],
    });
    service = TestBed.inject(EstimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
