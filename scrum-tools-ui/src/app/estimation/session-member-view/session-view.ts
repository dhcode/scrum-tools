import { EstimationService, SessionDetails } from '../services/estimation.service';
import { LoadingState, trackLoading } from '../../shared/loading.util';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CodedError } from '../../shared/error-handling.util';

export abstract class SessionView {
  sessionId: string;

  session: SessionDetails;

  loadingState = new LoadingState();

  protected sub = new Subscription();

  constructor(protected route: ActivatedRoute, protected estimationService: EstimationService) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadSession() {
    const sessionInfo = this.estimationService.getKnownSession(this.sessionId);
    if (!sessionInfo) {
      this.loadingState.error = new CodedError(
        'sessionNotFound',
        `The session behind id ${this.sessionId} is not known.`,
      );
      return;
    }

    this.sub.add(
      this.estimationService
        .getSession(sessionInfo)
        .pipe(trackLoading(this.loadingState))
        .subscribe((s) => (this.session = s)),
    );

    this.sub.add(
      this.estimationService.subscribeSessionWithDetails(sessionInfo).subscribe((change) => {
        console.log('change', change);
      }),
    );
  }
}
