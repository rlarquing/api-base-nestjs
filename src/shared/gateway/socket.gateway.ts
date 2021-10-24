import {Interval} from '@nestjs/schedule';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WsResponse
} from '@nestjs/websockets';
import {Server} from 'socket.io';
import {from, Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {SocketService} from "../service";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    @WebSocketServer()
    server: Server;

    protected clientes: any[] = [];
    protected canales: any[] = [];

    constructor(private readonly socketService: SocketService) {
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('User connected');
        this.canales.push(client);
    }

    handleDisconnect(client: any) {
        console.log('User disconnected');
        let pos = -1;
        for (let i = 0; i < this.canales.length; i++) {
            if (this.canales[i].id === client.id) {
                pos = i;
                break;
            }
        }
        this.canales = this.removeItemFromArr(this.canales, client, 'id');
        this.clientes = this.removeItemFromArr(this.clientes, this.clientes[pos], 'username');
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
        return from([this.socketService.getHello()]).pipe(map(item => ({event: 'events', data: item})));
    }

    //para enviar las coordenadas
    @Interval(60000)
    @SubscribeMessage('servicio')
    async servicio(@MessageBody() data: any): Promise<any> {
        //   this.server.emit('servicio', await this.socketService.gpsTren('L0846'));
        this.server.emit('servicio', await this.socketService.getHello());
    }

    @SubscribeMessage('registro')
    registro(@MessageBody() data: any): void {
        this.clientes.push(data);

        //esto es para salgan los mensajes
        // let pos = 0;
        // let alertas: ReadAlertaDto[];
        // for (const elem of this.clientes) {
        //     alertas = await this.socketService.findAlerta(elem.username);
        //     this.server.to(this.canales[pos].id).emit('alerta',{cantidad: alertas.length, data: alertas});
        //     this.server.to(this.canales[pos].id).emit('notificacion', await this.socketService.findNotificaion(elem.username));
        //     this.server.to(this.canales[pos].id).emit('mensaje', await this.socketService.findMensaje(elem.username));
        //     pos = pos + 1;
        // }
    }

    @Interval(60000)
    @SubscribeMessage('alerta')
    alerta(@MessageBody() data: any): void {
        let pos = 0;
        for (const elem of this.clientes) {
            this.server.to(this.canales[pos].id).emit('alerta', this.socketService.saludar(elem.username));
            pos = pos + 1;
        }

    }

    removeItemFromArr(arr, item, field) {
        return arr.filter(e => e[field] !== item[field]);
    };
}
