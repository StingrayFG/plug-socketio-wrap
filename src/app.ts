import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';

import exampleRouter from '@/routers/exampleRouter';
import runExampleRequests from '@/clientExample';


//
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(morgan('dev'));


//
const server = http.createServer(app);

server.listen(process.env.PORT || 4400);
server.on('error', (err: any) => { console.log(err) });


const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

exampleRouter.attachOnRouteToIO('example', io);

io.on('connection', (socket) => {
  console.log('connected')

  exampleRouter.attachToSocket(socket);
})

runExampleRequests();



export default app;
