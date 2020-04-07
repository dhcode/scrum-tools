import { Injectable } from '@angular/core';

import * as socketClient from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: SocketIOClient.Socket;

  constructor() {
    this.initSocket();
  }

  private initSocket() {
    this.socket = socketClient();

    this.socket.on('connect', () => {
      console.log('connect');
    });

    this.socket.on('connect_error', (error) => {
      console.log('connect_error', error);
    });

    this.socket.on('connect_timeout', (timeout) => {
      console.log('connect_timeout', timeout);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('disconnect', reason);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('reconnect', attemptNumber);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('reconnect_attempt', attemptNumber);
    });

    this.socket.on('reconnecting', (attemptNumber) => {
      console.log('reconnecting', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.log('reconnect_error', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.log('reconnect_failed');
    });

    this.socket.on('error', (error) => {
      console.log('error', error);
    });
  }
}
