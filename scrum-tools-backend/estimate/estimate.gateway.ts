import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { EstimationService, sessionRoomName } from './estimation/estimation.service';
import { CreateSessionArgs, GetActiveTopicDto, JoinSessionDto } from 'scrum-tools-api/estimate/estimation-requests';

@WebSocketGateway()
export class EstimateGateway implements OnGatewayInit {
  constructor(private estimationService: EstimationService) {}

  afterInit(namespace: Namespace): any {
    this.estimationService.setNamespace(namespace);
  }

  @SubscribeMessage('createSession')
  async createSessionRequest(@MessageBody() data: CreateSessionArgs, @ConnectedSocket() client: Socket): Promise<any> {
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
