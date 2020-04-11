import { Observable, OperatorFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoadingState {
  loading = false;
  error = null;
  loadedAt: Date;
  get loaded(): boolean {
    return !this.loading && !this.error;
  }
}

export function trackLoading<T>(state: LoadingState): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    state.loading = true;
    state.error = null;
    return source.pipe(
      tap(
        () => {
          state.loading = false;
          state.loadedAt = new Date();
        },
        (err) => {
          state.loading = false;
          state.error = err;
          state.loadedAt = new Date();
        },
        () => {
          state.loading = false;
          state.loadedAt = new Date();
        },
      ),
    );
  };
}
