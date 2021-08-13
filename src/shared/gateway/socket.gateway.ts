import { Interval } from '@nestjs/schedule';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsResponse } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { from, Observable } from "rxjs";
import { map } from 'rxjs/operators';
import {SocketService} from "../service";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    @WebSocketServer()
    server: Server;

    constructor(private readonly socketService: SocketService) {}

    handleConnection(client: any, ...args: any[]) {
        console.log('User connected');
    }

    handleDisconnect(client: any) {
        console.log('User disconnected');
    }

    afterInit(server: any) {
        console.log('Socket is live')
    }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void {
        this.server.emit('message', message);
    }
    //para enviar las alertas
    @SubscribeMessage('events')
    findAll(@MessageBody() data: any): Observable<WsResponse<string>> {   
      return from([this.socketService.getHello()]).pipe(map(item => ({ event: 'events', data: item })));
    }
  
    //para enviar las coordenadas
    @Interval(60000)
    @SubscribeMessage('servicio')
    async servicio(@MessageBody() data: any): Promise<any> {     
    //   this.server.emit('servicio', await this.socketService.gpsTren('L0846'));
      this.server.emit('servicio', await this.socketService.getHello());
    }
}
