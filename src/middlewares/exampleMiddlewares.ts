import { PlugResponseEmitters } from '@/plug/plug';


const exampleMiddlewares = {
  exampleMiddleware1: (eventData: any, resEmitters: PlugResponseEmitters, execEmitter: Function, next: Function) => {
    if (eventData && 
    eventData.exampleValue && 
    (eventData.exampleValue >= 0)) {
      next();
    } else {
      resEmitters.emitErrorMessageWithCode(400, 'exampleValue should be greater or equal than 0');
    }
  },
  exampleMiddleware2: (eventData: any, resEmitters: PlugResponseEmitters, execEmitter: Function, next: Function) => {
    if (eventData && 
    eventData.exampleValue && 
    ((eventData.exampleValue % 2) == 0)) {
      next();
    } else {
      resEmitters.emitErrorMessageWithCode(400, 'exampleValue should be even');
    }
  }
}

export default exampleMiddlewares;