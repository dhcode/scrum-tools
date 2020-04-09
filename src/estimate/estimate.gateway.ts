import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EstimationService, sessionRoomName } from './estimation/estimation.service';
import { CreateSessionDto, GetActiveTopicDto, JoinSessionDto } from './models/events';

@WebSocketGateway()
export class EstimateGateway implements OnGatewayInit {
  constructor(private estimationService: EstimationService) {}

  afterInit(server: Server): any {
    this.estimationService.setNamespace(server.of('/'));
  }

  @SubscribeMessage('createSession')
  async createSessionRequest(@MessageBody() data: CreateSessionDto, @ConnectedSocket() client: Socket): Promise<any> {
    const session = await this.estimationService.createEstimationSession(
      data.name,
      data.description,
      data.defaultOptions,
    );
    return session;
  }

  @SubscribeMessage('joinSession')
  async joinSessionRequest(@MessageBody() data: JoinSessionDto, @ConnectedSocket() client: Socket): Promise<any> {
    const session = await this.estimationService.getEstimationSession(data.sessionId);
    if (session && data.joinSecret === session.joinSecret) {
      client.join(sessionRoomName(session.id));
      return { ...session, adminSecret: null };
    } else {
      return 'notFound';
    }
  }

  @SubscribeMessage('getActiveTopic')
  async getActiveTopicRequest(@MessageBody() data: GetActiveTopicDto, @ConnectedSocket() client: Socket): Promise<any> {
    if (client.rooms[sessionRoomName(data.sessionId)]) {
      const topic = await this.estimationService.getActiveTopic(data.sessionId);
      if (!topic) {
        return 'noTopic';
      }
      return topic;
    } else {
      return 'notAllowed';
    }
  }
}