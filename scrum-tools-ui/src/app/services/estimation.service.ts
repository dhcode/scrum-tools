import { Inject, Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Observable } from 'rxjs';
import { CreateSessionArgs, JoinSessionDto } from 'scrum-tools-api/estimate/estimation-requests';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EstimationService {
  constructor(private socketService: SocketService, @Inject(LOCAL_STORAGE) private storage: StorageService) {
    this.socketService.socket.on('sessionNotFound', (data) => {
      console.log('sessionNotFound', data);
    });
  }

  createSession(name: string, description: string, defaultOptions: number[]) {
    const req: CreateSessionArgs = {
      name,
      description,
      defaultOptions,
    };
    return this.socketService.request('createSession', req).pipe(map((res) => {}));
  }

  joinSession(sessionId: string, joinSecret: string): Observable<any> {
    return new Observable<any>((subscriber) => {
      const request: JoinSessionDto = {
        sessionId,
        joinSecret,
      };
      this.socketService.socket.emit('joinSession', request, (session) => {
        subscriber.next(session);
      });
    });
  }
}
