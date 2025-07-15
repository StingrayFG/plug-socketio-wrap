import { Server, Socket } from 'socket.io';


// TYPES
export type PlugResponseEmitters = {
  emitResponse: (data: any) => void,
  emitResponseWithCode: (code: number, data?: any) => void,
  emitErrorMessage: (error?: any) => void,
  emitErrorMessageWithCode: (code: number, error?: any) => void,
}


//
type PlugMiddlewareFunction = (
  eventData: any,
  resEmitters: PlugResponseEmitters,
  execEmitter: Function,
  next: Function,
) => void

type PlugHandlerFunction = (
  eventData: any,
  resEmitters: PlugResponseEmitters,
  execEmitter: Function,
) => void


type PlugHandlerData = {
  route: string;
  handler: PlugHandlerFunction;
  middlewares: Array<PlugMiddlewareFunction>;
}


// CLASSES
export class PlugRouter {
  io?: Server;

  rootRoute: string = '';
  handlersData: Array<PlugHandlerData> = [];

  constructor() {}
  
  attachOnRouteToIO(rootRoute: string, io: Server): void {
    this.rootRoute = rootRoute;
    this.io = io;
  }

  attachToSocket(socket: Socket): void {
    if (this.rootRoute && this.io) {
      this.handlersData.map((handlerData: PlugHandlerData) => {
        this.attachHandlerToSocket(socket, handlerData)
      })
    }
  }

  addRouteHandler(route: string, middlewares: Array<PlugMiddlewareFunction> = [], handler: PlugHandlerFunction): void {
    const handlerData: PlugHandlerData = {
      route: route.startsWith(':') ? route : ':' + route, 
      handler, 
      middlewares
    }
    this.handlersData.push(handlerData);
  }

  private attachHandlerToSocket(socket: Socket, handlerData: PlugHandlerData): void {
    if (this.rootRoute && this.io) {
      socket.on(
        this.rootRoute + handlerData.route, 
        (eventData, ack) => this.runHandler(
          handlerData,
          eventData, 
          this.getResponseEmitters(ack), 
          this.getExecuteEmitter(socket),
          ),
      )
    }
  }

  private runHandler(
    handlerData: PlugHandlerData,
    eventData: any, 
    responseEmitters: PlugResponseEmitters, 
    executeEmitter: Function,
  ): void {
    const runHandler = () => {
      handlerData.handler(
        eventData, 
        responseEmitters, 
        executeEmitter,
      )
    }

    const runMiddleware = (middleware: Function, middlewareIndex: number) => {
      if (middlewareIndex < handlerData.middlewares.length) {
        if (middlewareIndex === (handlerData.middlewares.length - 1)) {
          middleware(
            eventData, 
            responseEmitters, 
            executeEmitter,
            () => runHandler()
          )
        } else {
          middleware(
            eventData, 
            responseEmitters, 
            executeEmitter,
            () => runMiddleware(
              handlerData.middlewares[middlewareIndex + 1], 
              middlewareIndex + 1
            ))
        }
      }
    }

    if (handlerData.middlewares && (handlerData.middlewares.length > 0)) {
      runMiddleware(handlerData.middlewares[0], 0)
    }
  }

  private getResponseEmitters(ack: Function): PlugResponseEmitters {
    return {
      emitResponse: (data: any) => {
        ack({ code: null, data })
      },
      emitResponseWithCode: (code: number, data?: any) => {
        ack({ code, data })
      },
      emitErrorMessage: (error?: any) => {
        ack({ code: null, error })
      },
      emitErrorMessageWithCode: (code: number, error?: any) => {
        ack({ code, error })
      },
    }
  }

  private getExecuteEmitter(socket: Socket): Function {
    return (emitter: Function, ...data: any) => {
      emitter(this.io, socket, ...data)
    }
  }
}

