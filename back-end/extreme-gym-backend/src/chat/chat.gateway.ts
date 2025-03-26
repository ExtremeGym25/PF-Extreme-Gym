import { JwtService } from "@nestjs/jwt";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UsersService } from "src/users/users.service";

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<
    string,
    { socket: Socket; userId: string; role: string }
  > = new Map();

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
      const token = client.handshake.query.token as string;

      if (!token) {
        client.disconnect();
        return;
      }

      try {
        const payload = await this.jwtService.verify(token);
        const user = await this.userService.findOne(payload.userId);

        if (!user) {
          client.disconnect();
          return;
        }

        this.connectedClients.set(client.id, { socket: client, userId: user.id, role: user.role});
        console.log(`Cliente conectado: ${client.id}, Usuario: ${user.id}, Role: ${user.role}`);        
      } catch (error) {
        client.disconnect();
        console.log('Error de autenticación:', error);
      }
  }
  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(` Cliente desconectado: ${client.id}`);      
  }
  @SubscribeMessage('mensaje')
  handleMessage(client: Socket, @MessageBody() message: string) {
    const clientData = this.connectedClients.get(client.id);

    if (!clientData) {
      throw new WsException('Cliente no autenticado');
    }
    const {userId, role} = clientData;

    if(role === 'admin') {
      this.server.emit('mensaje', { sender: 
        userId, message});
  } else {
    this.server.emit( 'mensaje', {sender: 
      userId, message});
  }
}
}
