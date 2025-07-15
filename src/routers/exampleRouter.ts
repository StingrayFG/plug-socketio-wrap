import { PlugRouter } from '@/plug/plug';

import exampleHandlers from '@/handlers/exampleHandlers';
import exampleMiddlewares from '@/middlewares/exampleMiddlewares';


const exampleRouter = new PlugRouter();

exampleRouter.addRouteHandler('get', 
  [exampleMiddlewares.exampleMiddleware1, exampleMiddlewares.exampleMiddleware2], 
  exampleHandlers.exampleHandler)


export default exampleRouter;
