import { PlugResponseEmitters } from '@/plug/plug';
import exampleEmitters from '@/emitters/exampleEmitters';


const exampleControllers = {
  exampleController: async (eventData: any, resEmitters: PlugResponseEmitters, execEmitter: Function): Promise<any> => {
    execEmitter(exampleEmitters.emitExampleBroadcastEvent, 'example');
    return resEmitters.emitResponseWithCode(200, { exampleValue: eventData.exampleValue * 2});
  }
}

export default exampleControllers;
