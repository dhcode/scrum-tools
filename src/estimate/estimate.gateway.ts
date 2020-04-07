import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { EstimationService } from './estimation/estimation.service';
import { StartEstimationDto } from './models/events';

@WebSocketGateway()
export class EstimateGateway {
  constructor(private estimationService: EstimationService) {}

  @SubscribeMessage('startEstimation')
  async handleEstimationRequest(
    @MessageBody() data: StartEstimationDto,
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    console.log('start', data);
    const session = await this.estimationService.getEstimationSession(data.sessionId);
    if (session) {
      return session;
    } else {
      return 'notFound';
    }
  }
}
