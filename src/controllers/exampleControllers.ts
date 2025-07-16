import { PlugResponseEmitters } from '@/plug/plug';
import exampleEmitters from '@/emitters/exampleEmitters';


const exampleControllers = {
  exampleController: (eventData: any, resEmitters: PlugResponseEmitters, execEmitter: Function) => {
    resEmitters.emitResponseWithCode(200, { exampleValue: eventData.exampleValue * 2});
    execEmitter(exampleEmitters.emitExampleBroadcastEvent, 'example')
  }
}

export default exampleControllers;
