import { PlugRouter } from '@/plug/plug';

import exampleControllers from '@/controllers/exampleControllers';
import exampleMiddlewares from '@/middlewares/exampleMiddlewares';


const exampleRouter = new PlugRouter();

exampleRouter.addRouteController('get', 
  [exampleMiddlewares.exampleMiddleware1, exampleMiddlewares.exampleMiddleware2], 
  exampleControllers.exampleController)


export default exampleRouter;
