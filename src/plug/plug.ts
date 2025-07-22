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
) => Promise<any>

type PlugControllerFunction = (
  eventData: any,
  resEmitters: PlugResponseEmitters,
  execEmitter: Function,
) => Promise<any>

type PlugControllerData = {
  route: string;
  controller: PlugControllerFunction;
  middlewares: Array<PlugMiddlewareFunction>;
}


// CLASSES
export class PlugRouter {
  io?: Server;

  rootRoute: string = '';
  controllersData: Array<PlugControllerData> = [];

  constructor() {}
  
  attachOnRouteToIO(rootRoute: string, io: Server): void {
    this.rootRoute = rootRoute;
    this.io = io;
  }

  attachToSocket(socket: Socket): void {
    if (this.rootRoute && this.io) {
      this.controllersData.map((controllerData: PlugControllerData) => {
        this.attachControllerToSocket(socket, controllerData)
      })
    }
  }

  addRouteController(route: string, middlewares: Array<PlugMiddlewareFunction> = [], controller: PlugControllerFunction): void {
    const controllerData: PlugControllerData = {
      route: route.startsWith(':') ? route : ':' + route, 
      controller, 
      middlewares
    }
    this.controllersData.push(controllerData);
  }

  private attachControllerToSocket(socket: Socket, controllerData: PlugControllerData): void {
    if (this.rootRoute && this.io) {
      socket.on(
        this.rootRoute + controllerData.route, 
        (eventData, ack) => this.runControllerAndMiddlewares(
          controllerData,
          eventData, 
          this.getResponseEmitters(ack), 
          this.getExecuteEmitter(socket),
          ),
      )
    }
  }

  private async runControllerAndMiddlewares(
    controllerData: PlugControllerData,
    eventData: any, 
    responseEmitters: PlugResponseEmitters, 
    executeEmitter: Function,
  ): Promise<any> {

    const runController = async (): Promise<any> => {
     await controllerData.controller(
        eventData, 
        responseEmitters, 
        executeEmitter,
      )
    }

    const runMiddleware = async (middlewareIndex: number): Promise<any> => {
      if (middlewareIndex < controllerData.middlewares.length) {
        if (middlewareIndex === (controllerData.middlewares.length - 1)) {
          await controllerData.middlewares[middlewareIndex](eventData, responseEmitters, executeEmitter,
          async () => {
            await runController();
          })
        } else {
          await controllerData.middlewares[middlewareIndex](eventData, responseEmitters, executeEmitter,
          async () => {
            await runMiddleware(middlewareIndex + 1);
          })
        }
      }
    }

    if (controllerData.middlewares && (controllerData.middlewares.length > 0)) {
      await runMiddleware(0);
    } else {
      await runController();
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

