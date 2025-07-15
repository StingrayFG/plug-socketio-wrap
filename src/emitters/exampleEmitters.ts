import { Server, Socket } from 'socket.io';


const exampleEmitters = {
  emitExampleBroadcastEvent: (io: Server, socket: Socket, message: any) => {
    socket.broadcast.emit('example:broadcast', message);
  }
}

export default exampleEmitters;
