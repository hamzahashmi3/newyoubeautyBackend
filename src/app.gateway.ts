import { Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: '*:*',
})
@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  connectedUsersArr = {};
  constructor() {}

  afterInit(s: Server) {
    this.logger.log('Init');
  }
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // if (this.connectedUsersArr[client.id]) {
    //   delete this.connectedUsersArr[client.id];
    //   await this.sendNotification(USER_ONLINE, {
    //     onlineUsers: Object.values(this.connectedUsersArr),
    //   });
    // }
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  // async generalSockets(payload: any) {
  //   this.server.emit(`${payload.listener}-${payload.type}`, {
  //     data: { ...payload.data },
  //   });
  // }

  // async setPushNotification(
  //   payload: { title: string; body: string; data: any },
  //   token: string,
  // ) {
  //   try {
  //     const _payload = {
  //       notification: {
  //         title: payload.title,
  //         body: payload.body,
  //         sound: 'default',
  //       },
  //       data: payload.data,
  //     };
  //     firbaseConfig
  //       .messaging()
  //       .sendToDevice(token, _payload)
  //       .then((response) => {
  //         console.log(response, 'Notification sent to consultant successfully');
  //         console.log(response.results[0].error);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } catch (error) {
  //     console.log('firebase error:-=-=', error);
  //     throw new Error(error);
  //   }
  // }

  // @SubscribeMessage('events')
  // handleEvent(
  //   @MessageBody() data: string,
  //   @ConnectedSocket() client: Socket,
  // ): string {
  //   return data;
  // }

  // @SubscribeMessage('SEND_TEST_EVENT')
  // async testEvent(client: any, payload: any) {
  //   this.server.emit('RECEIVE_TEST_EVENT', {
  //     ...payload,
  //   });
  // }

  // @SubscribeMessage(USER_ONLINE)
  // async onlineUsers(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: any,
  // ): Promise<any> {
  //   console.log('users:-=-=', data);
  //   let keys = Object.keys(this.connectedUsersArr);
  //   let values = Object.values(this.connectedUsersArr);

  //   let index = values.findIndex((c: any) => c === data.user);
  //   if (index > -1) {
  //     let key = keys[index];
  //     delete this.connectedUsersArr[key];
  //   }
  //   this.connectedUsersArr[client.id] = data.user;
  //   await this.sendNotification(USER_ONLINE, {
  //     onlineUsers: Object.values(this.connectedUsersArr),
  //   });
  // }

  // @SubscribeMessage('CHANGE_MESSAGE_STATUS')
  // async changeMessageStatus(client: any, payload: any) {
  //   const room = await this.roomRepo.find({
  //     messages: { $in: payload.messageId },
  //   });

  //   await this.messagesRepo.updateMany(
  //     {
  //       _id: { $in: room[0].messages },
  //       status: 'delivered',
  //     },
  //     {
  //       status: 'read',
  //     },
  //   );

  //   const data = {
  //     messageId: payload.messageId,
  //     userId: payload.userId,
  //     status: 'read',
  //   };

  //   this.server.emit(`MESSAGE_STATUS_${payload.userId}`, data);
  // }

  // @SubscribeMessage('UPDATE_USER_STATUS')
  // async updateUserStatus(client: any, payload: any) {
  //   if (payload.status == false) {
  //     await this.userRepository.findByIdAndUpdate(
  //       { _id: payload.userId },
  //       {
  //         status: false,
  //         offlineTime: new Date(),
  //       },
  //     );
  //     this.server.emit(`STATUS_${payload.userId}`, {
  //       status: false,
  //       offlineTime: new Date(),
  //     });
  //   } else if (payload.status == true) {
  //     await this.userRepository.findByIdAndUpdate(
  //       { _id: payload.userId },
  //       { status: true },
  //     );

  //     this.server.emit(`STATUS_${payload.userId}`, {
  //       status: true,
  //     });
  //     //change the status of message from sent to delivered
  //     await this.messagesRepo.updateMany(
  //       {
  //         recievedBy: { $in: payload.userId },
  //         status: 'sent',
  //       },
  //       { status: 'delivered' },
  //     );

  //     const message = await this.messagesRepo
  //       .find({ recievedBy: { $in: payload.userId } })
  //       .sort({ createdAt: -1 })
  //       .limit(1);

  //     this.server.emit(`MESSAGE_STATUS_${payload.userId}`, {
  //       messageId: message[0]._id,
  //       userId: payload.userId,
  //       status: 'delivered',
  //     });
  //   }
  // }

  // async SEND_MESSAGE_STATUS(@MessageBody() payload: any): Promise<any> {
  //   this.server.emit(`MESSAGE_STATUS_${payload.userId}`, {
  //     messageId: payload.messageId,
  //     userId: payload.userId,
  //     status: payload.status,
  //   });
  // }

  /**
   * handle the comment socket channel
   * @param payload
   */
  triggerCommentCreated(payload: any) {
    console.log('payload', payload);
    this.server.emit(payload.to, payload);
  }

  /**
   * handle the peers addition
   * @param payload
   */
  triggerPeerAdded(payload: any) {
    console.log(payload);
    this.server.emit(payload.to, payload);
  }
  // async sendSocketWithNotification(event: string, payload: any) {
  //   console.log('run', event, '===>', payload);

  //   let not = await this.notificationRepository.create(payload);
  //   await this.server.emit(event, payload);
  // }

  // async sendNotification(event: string, payload: any) {
  //   await this.server.emit(event, payload);
  // }
}
