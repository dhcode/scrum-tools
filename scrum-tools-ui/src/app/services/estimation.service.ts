import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstimationService {
  constructor(private socketService: SocketService) {
    this.socketService.socket.on('sessionNotFound', (data) => {
      console.log('sessionNotFound', data);
    });
  }

  startEstimation(sessionId: string): Observable<any> {
    return new Observable<any>((subscriber) => {
      this.socketService.socket.emit('startEstimation', { sessionId: sessionId }, (session) => {
        subscriber.next(session);
      });
    });
  }
}
